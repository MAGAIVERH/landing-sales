import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

type Body = {
  orderId?: string;
};

export const POST = async (req: Request) => {
  try {
    const body = (await req.json()) as Body;

    if (!body.orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const stripePriceId = process.env.STRIPE_PRICE_DEPLOY_HOSTING;
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Missing STRIPE_PRICE_DEPLOY_HOSTING env' },
        { status: 500 },
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: body.orderId },
      select: {
        id: true,
        stripeCustomerId: true,
        customerEmail: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    // Evita vender 2x o mesmo upsell (opcional, mas recomendado)
    const alreadyPaid = await prisma.upsellPurchase.findFirst({
      where: {
        orderId: order.id,
        kind: 'hosting',
        status: 'PAID',
      },
      select: { id: true },
    });

    if (alreadyPaid) {
      return NextResponse.json(
        { error: 'Hosting already purchased for this order.' },
        { status: 409 },
      );
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000';

    // cria registro pending do upsell (rastreio)
    const upsell = await prisma.upsellPurchase.create({
      data: {
        kind: 'hosting',
        orderId: order.id,
        status: 'PENDING',
      },
    });

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: stripePriceId, quantity: 1 }],

      success_url: `${origin}/checkout/hosting/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/onboarding/completed?orderId=${encodeURIComponent(
        order.id,
      )}`,

      ...(order.stripeCustomerId
        ? { customer: order.stripeCustomerId }
        : order.customerEmail
        ? { customer_email: order.customerEmail }
        : {}),

      metadata: {
        kind: 'hosting',
        orderId: order.id,
        upsellId: upsell.id,
        stripePriceId,
      },
    });

    await prisma.upsellPurchase.update({
      where: { id: upsell.id },
      data: { stripeCheckoutSessionId: session.id },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to create hosting checkout session' },
      { status: 500 },
    );
  }
};

export const GET = async (req: Request) => {
  try {
    const { searchParams } = new URL(req.url);
    const sessionId = searchParams.get('session_id');

    if (!sessionId) {
      return NextResponse.json(
        { ok: false, error: 'Missing session_id' },
        { status: 400 },
      );
    }

    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Confirma pagamento
    if (session.payment_status !== 'paid') {
      return NextResponse.json(
        { ok: false, error: 'Pagamento ainda não confirmado.' },
        { status: 409 },
      );
    }

    const kind = session.metadata?.kind;
    const orderId = session.metadata?.orderId;
    const upsellId = session.metadata?.upsellId;

    if (kind !== 'hosting' || !orderId) {
      return NextResponse.json(
        { ok: false, error: 'Invalid session metadata.' },
        { status: 400 },
      );
    }

    // Marca como PAID (idempotente)
    if (upsellId) {
      await prisma.upsellPurchase.update({
        where: { id: upsellId },
        data: { status: 'PAID' },
      });
    } else {
      // fallback se upsellId não existir por algum motivo
      await prisma.upsellPurchase.updateMany({
        where: { stripeCheckoutSessionId: session.id, kind: 'hosting' },
        data: { status: 'PAID' },
      });
    }

    return NextResponse.json({
      ok: true,
      orderId,
      checks: {
        paymentConfirmed: true,
        purchaseRegistered: true,
        teamNotified: false,
      },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { ok: false, error: 'Failed to confirm hosting purchase' },
      { status: 500 },
    );
  }
};
