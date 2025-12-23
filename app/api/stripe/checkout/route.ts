import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

type Plan = 'sage_base' | 'sage_pay' | 'sage_ai';

const PRICE_BY_PLAN: Record<Plan, string | undefined> = {
  sage_base: process.env.STRIPE_PRICE_SAGE_BASE,
  sage_pay: process.env.STRIPE_PRICE_SAGE_PAY,
  sage_ai: process.env.STRIPE_PRICE_SAGE_AI,
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as { plan?: Plan };

    const plan = body.plan;
    if (!plan) {
      return NextResponse.json({ error: 'Missing plan' }, { status: 400 });
    }

    const price = PRICE_BY_PLAN[plan];
    if (!price) {
      return NextResponse.json(
        { error: `Missing Stripe price for plan: ${plan}` },
        { status: 400 },
      );
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price, quantity: 1 }],
      success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}#precos`,
      // opcional (melhora conversão/checkout):
      // billing_address_collection: 'auto',
      // phone_number_collection: { enabled: true },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 },
    );
  }
}
