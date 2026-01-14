import { NextResponse } from 'next/server';
import type Stripe from 'stripe';

import { sendAccessLinkEmail } from '@/lib/email';
import { createOrRotateOrderAccessLink } from '@/lib/magic-link';
import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

const toNullIfEmpty = (value?: string | null) => {
  const v = (value ?? '').trim();
  return v.length > 0 ? v : null;
};

export const POST = async (req: Request) => {
  const signature = req.headers.get('stripe-signature');
  console.log('[stripe-webhook] received');

  if (!signature) {
    return NextResponse.json(
      { error: 'Missing stripe-signature header' },
      { status: 400 },
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return NextResponse.json(
      { error: 'Missing STRIPE_WEBHOOK_SECRET' },
      { status: 500 },
    );
  }

  let event: Stripe.Event;

  try {
    // IMPORTANTE: corpo RAW (não use req.json aqui)
    const rawBody = await req.text();
    event = stripe.webhooks.constructEvent(rawBody, signature, webhookSecret);
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Invalid webhook signature';
    return NextResponse.json({ error: message }, { status: 400 });
  }

  // 1) Idempotência / auditoria: registra o evento
  // Se já existir e já tiver sido processado, devolve 200 e encerra.
  let storedEvent = await prisma.stripeEvent.upsert({
    where: { stripeEventId: event.id },
    create: {
      stripeEventId: event.id,
      type: event.type,
      apiVersion: event.api_version ?? null,
      payload: event as any,
    },
    update: {
      payload: event as any,
    },
  });

  if (storedEvent.processedAt) {
    return NextResponse.json({ received: true, deduped: true });
  }

  const markProcessed = async (orderId?: string | null) => {
    storedEvent = await prisma.stripeEvent.update({
      where: { stripeEventId: event.id },
      data: { processedAt: new Date(), ...(orderId ? { orderId } : {}) },
    });
  };

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Busca sessão completa com line_items
        const fullSession = await stripe.checkout.sessions.retrieve(
          session.id,
          {
            expand: ['line_items.data.price'],
          },
        );

        const metadata = fullSession.metadata ?? {};
        const kind = toNullIfEmpty(metadata.kind as string | undefined);

        const stripePaymentIntentId =
          typeof fullSession.payment_intent === 'string'
            ? fullSession.payment_intent
            : null;

        const stripeCustomerId =
          typeof fullSession.customer === 'string'
            ? fullSession.customer
            : null;

        const customerEmail =
          fullSession.customer_details?.email ??
          fullSession.customer_email ??
          null;

        const currency = (fullSession.currency ?? 'brl').toLowerCase();
        const amountTotal = fullSession.amount_total ?? null;

        // =========================
        // A) UPSLL: HOSTING
        // =========================
        if (kind === 'hosting') {
          const orderId = toNullIfEmpty(metadata.orderId as string | undefined);
          const upsellId = toNullIfEmpty(
            metadata.upsellId as string | undefined,
          );

          if (!orderId || !upsellId) {
            throw new Error('Missing orderId/upsellId in hosting metadata.');
          }

          // Atualiza o UpsellPurchase (idempotente)
          await prisma.upsellPurchase.update({
            where: { id: upsellId },
            data: {
              status: 'PAID',
              stripePaymentIntentId,
              stripeCheckoutSessionId: fullSession.id,
              currency,
              amountTotal: amountTotal ?? undefined,
              updatedAt: new Date(),
            },
          });

          // Opcional: também garante que a Order principal existe (não muda status dela)
          // e vincula o evento ao orderId para rastreio
          await markProcessed(orderId);

          return NextResponse.json({ received: true });
        }

        // =========================
        // B) COMPRA PRINCIPAL
        // =========================

        const metaStripePriceId = toNullIfEmpty(
          metadata.stripePriceId as string | undefined,
        );
        const userId = toNullIfEmpty(metadata.userId as string | undefined);
        const leadId = toNullIfEmpty(metadata.leadId as string | undefined);

        const lineItem = fullSession.line_items?.data?.[0];
        const lineItemStripePriceId =
          typeof lineItem?.price === 'object' && lineItem.price?.id
            ? lineItem.price.id
            : null;

        const stripePriceId = lineItemStripePriceId ?? metaStripePriceId;
        if (!stripePriceId) {
          throw new Error(
            'Unable to resolve stripePriceId from session (line_items/metadata)',
          );
        }

        const price = await prisma.price.findUnique({
          where: { stripePriceId },
        });

        if (!price) {
          throw new Error(
            `Price not found in DB for stripePriceId=${stripePriceId}`,
          );
        }

        const quantity = lineItem?.quantity ?? 1;
        const normalizedCurrency = (
          fullSession.currency ??
          price.currency ??
          'brl'
        ).toLowerCase();

        const fallbackSubtotal = price.unitAmount * quantity;
        const amountSubtotal = fullSession.amount_subtotal ?? fallbackSubtotal;
        const total = fullSession.amount_total ?? amountSubtotal;
        const amountDiscount = Math.max(0, amountSubtotal - total);

        // Upsert do Order pelo stripeCheckoutSessionId (idempotente)
        const order = await prisma.order.upsert({
          where: { stripeCheckoutSessionId: fullSession.id },
          create: {
            userId,
            leadId,
            priceId: price.id,
            quantity,
            currency: normalizedCurrency,
            amountSubtotal,
            amountDiscount,
            amountTotal: total,
            status: 'PAID',
            stripeCheckoutSessionId: fullSession.id,
            stripePaymentIntentId,
            stripeCustomerId,
            customerEmail,
            stripeMetadata: metadata as any,
            paidAt: new Date(),
          },
          update: {
            userId,
            leadId,
            priceId: price.id,
            quantity,
            currency: normalizedCurrency,
            amountSubtotal,
            amountDiscount,
            amountTotal: total,
            status: 'PAID',
            stripePaymentIntentId,
            stripeCustomerId,
            customerEmail,
            stripeMetadata: metadata as any,
            paidAt: new Date(),
          },
        });

        // Se userId existir e stripeCustomerId ainda não estiver salvo
        if (userId && stripeCustomerId) {
          await prisma.user.updateMany({
            where: { id: userId, stripeCustomerId: null },
            data: { stripeCustomerId },
          });
        }

        // ✅ MAGIC LINK (no-login) — generate access URL and send email
        if (customerEmail) {
          try {
            const { token, expiresAt } = await createOrRotateOrderAccessLink({
              orderId: order.id,
              destinationEmail: customerEmail,
              revokeExisting: false, // webhook should NOT invalidate previous links
            });

            const baseUrlRaw =
              process.env.NEXT_PUBLIC_APP_URL ??
              process.env.APP_URL ??
              'http://localhost:3000';

            const baseUrl = baseUrlRaw.replace(/\/$/, ''); // remove trailing "/"

            // ✅ route is in English
            const accessUrl = `${baseUrl}/access/${encodeURIComponent(token)}`;

            // ✅ Send email (Resend)
            await sendAccessLinkEmail({
              to: customerEmail,
              accessUrl,
              expiresInDays: 7,
            });

            console.log('[magic-link] orderId:', order.id);
            console.log('[magic-link] expiresAt:', expiresAt.toISOString());
            console.log('[magic-link] email sent to:', customerEmail);
          } catch (e) {
            console.error('[magic-link] failed:', e);
          }
        } else {
          console.warn(
            '[magic-link] customerEmail missing, orderId:',
            order.id,
          );
        }

        await markProcessed(order.id);

        return NextResponse.json({ received: true });
      }

      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;

        // Se for upsell, cancela UpsellPurchase pelo stripeCheckoutSessionId
        await prisma.upsellPurchase.updateMany({
          where: {
            stripeCheckoutSessionId: session.id,
            status: { not: 'PAID' },
          },
          data: { status: 'CANCELED' },
        });

        // Se existir order com essa session e não estiver pago, cancela
        await prisma.order.updateMany({
          where: {
            stripeCheckoutSessionId: session.id,
            status: { not: 'PAID' },
          },
          data: { status: 'CANCELED' },
        });

        await markProcessed(null);
        return NextResponse.json({ received: true });
      }

      default: {
        // Eventos que não usamos: apenas marca como processado
        await markProcessed(null);
        return NextResponse.json({ received: true });
      }
    }
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Webhook handler error';
    console.error('[stripe-webhook]', message);

    // Não marca processedAt aqui para o Stripe reenviar
    return NextResponse.json({ error: message }, { status: 500 });
  }
};
