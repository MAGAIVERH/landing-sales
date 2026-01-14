import { prisma } from '@/lib/prisma';

export const getOrderDetailsData = async (orderId: string) => {
  return prisma.order.findUnique({
    where: { id: orderId },
    include: {
      lead: true,
      briefing: true,
      price: { include: { product: true } },
    },
  });
};
