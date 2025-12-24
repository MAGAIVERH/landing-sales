import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      stripePriceId?: string;
      slug?: string;
    };

    const stripePriceId = body.stripePriceId;
    if (!stripePriceId) {
      return NextResponse.json(
        { error: 'Missing stripePriceId' },
        { status: 400 },
      );
    }

    const origin = req.headers.get('origin') ?? 'http://localhost:3000';

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: [{ price: stripePriceId, quantity: 1 }],
      success_url: `${origin}/checkout/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/#precos`,
      metadata: {
        slug: body.slug ?? '',
        stripePriceId,
      },
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
