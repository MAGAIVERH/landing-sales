import { NextResponse } from 'next/server';

import { prisma } from '@/lib/prisma';
import { stripe } from '@/lib/stripe';

export const runtime = 'nodejs';

export const POST = async (
  req: Request,
  { params }: { params: Promise<{ orderId: string }> },
) => {
  try {
    const { orderId } = await params;

    if (!orderId) {
      return NextResponse.json({ error: 'Missing orderId' }, { status: 400 });
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        amountTotal: true,
        paidAt: true,
        stripePaymentIntentId: true,
        stripeRefundId: true,
        refundedAmount: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (order.stripeRefundId) {
      return NextResponse.json(
        {
          error: 'Order already refunded',
          stripeRefundId: order.stripeRefundId,
        },
        { status: 409 },
      );
    }

    if (order.status !== 'PAID') {
      return NextResponse.json(
        { error: 'Only PAID orders can be refunded' },
        { status: 400 },
      );
    }

    if (!order.paidAt) {
      return NextResponse.json(
        { error: 'Missing paidAt on order' },
        { status: 400 },
      );
    }

    if (!order.stripePaymentIntentId) {
      return NextResponse.json(
        { error: 'Missing stripePaymentIntentId on order' },
        { status: 400 },
      );
    }

    const refundWindowDays = 7;
    const msPerDay = 1000 * 60 * 60 * 24;

    const now = new Date();
    const paidAt = order.paidAt;

    const daysElapsed = Math.min(
      refundWindowDays,
      Math.max(1, Math.ceil((now.getTime() - paidAt.getTime()) / msPerDay)),
    );

    if (daysElapsed >= refundWindowDays) {
      return NextResponse.json(
        { error: 'Outside refund window (7 days)' },
        { status: 400 },
      );
    }

    const totalCents = order.amountTotal ?? 0;
    if (totalCents <= 0) {
      return NextResponse.json(
        { error: 'Invalid amountTotal for refund' },
        { status: 400 },
      );
    }

    const dailyRateCents = Math.floor(totalCents / refundWindowDays);
    const refundAmountCents = Math.max(
      0,
      totalCents - dailyRateCents * daysElapsed,
    );

    if (refundAmountCents <= 0) {
      return NextResponse.json(
        { error: 'Refund amount is zero' },
        { status: 400 },
      );
    }

    const refund = await stripe.refunds.create({
      payment_intent: order.stripePaymentIntentId,
      amount: refundAmountCents,
      reason: 'requested_by_customer',
      metadata: {
        orderId: order.id,
        daysElapsed: String(daysElapsed),
        refundWindowDays: String(refundWindowDays),
      },
    });

    const nextStatus =
      refundAmountCents >= totalCents ? 'REFUNDED' : 'PARTIALLY_REFUNDED';

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: nextStatus,
        refundedAmount: refundAmountCents,
        refundedAt: new Date(),
        stripeRefundId: refund.id,
      },
    });

    return NextResponse.json({
      ok: true,
      orderId: order.id,
      status: nextStatus,
      daysElapsed,
      totalCents,
      dailyRateCents,
      refundAmountCents,
      stripeRefundId: refund.id,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal error' }, { status: 500 });
  }
};
