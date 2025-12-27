import { NextResponse } from 'next/server';

import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

type CheckoutBody = {
  stripePriceId?: string;

  /**
   * Identificador estável do plano/produto no seu app
   * ex: "sage_base", "sage_pay", "sage_ai", "deploy_hosting"
   */
  productKey?: string;

  /**
   * Mantido por compatibilidade com o que você já envia hoje.
   * Se productKey não vier, usamos slug como fallback.
   */
  slug?: string;

  /**
   * Opcional: se existir usuário logado / lead
   * (mesmo que você ainda não esteja usando, já deixa pronto)
   */
  userId?: string;
  leadId?: string;

  /**
   * Opcional: se você já conhece o customer do Stripe (ex: user.stripeCustomerId)
   * ajuda muito para upsell e para o Checkout ficar mais “1-click”.
   */
  stripeCustomerId?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as CheckoutBody;

    const stripePriceId = body.stripePriceId;
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Missing stripePriceId' },
        { status: 400 },
      );
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000';

    const productKey = (body.productKey ?? body.slug ?? '').trim();

    const userId = (body.userId ?? '').trim();
    const leadId = (body.leadId ?? '').trim();
    const stripeCustomerId = (body.stripeCustomerId ?? '').trim();

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: stripePriceId, quantity: 1 }],

      // Success precisa carregar session_id para a página conseguir consultar o DB
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#precos`,

      // Ajuda muito em rastreio/debug dentro do Stripe
      client_reference_id: userId || leadId ? userId || leadId : undefined,

      // Se você já tiver customer, reaproveite aqui (melhora upsell e cadastro)
      ...(stripeCustomerId
        ? {
            customer: stripeCustomerId,
            customer_update: { name: 'auto', address: 'auto' },
          }
        : {}),

      // Metadata ESSENCIAL para o webhook amarrar pagamento -> plano -> user/lead
      metadata: {
        productKey, // preferido
        slug: body.slug ?? '', // compatibilidade
        stripePriceId,

        userId, // string vazia ok
        leadId, // string vazia ok
      },

      // Se quiser coletar endereço/telefone no futuro, você já tinha os comentários:
      // billing_address_collection: 'auto',
      // phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
