import type { Prisma } from '@prisma/client';

export type OrderDetailsParams = Promise<{ orderId: string }>;

export type OrderWithIncludes = Prisma.OrderGetPayload<{
  include: {
    lead: true;
    briefing: true;
    price: { include: { product: true } };
  };
}>;

export type OrderDetailsPageProps = {
  order: OrderWithIncludes;
};
