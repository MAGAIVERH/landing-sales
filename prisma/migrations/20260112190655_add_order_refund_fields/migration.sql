/*
  Warnings:

  - A unique constraint covering the columns `[stripeRefundId]` on the table `Order` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
ALTER TYPE "OrderStatus" ADD VALUE 'PARTIALLY_REFUNDED';

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "refundedAmount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "refundedAt" TIMESTAMP(3),
ADD COLUMN     "stripeRefundId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Order_stripeRefundId_key" ON "Order"("stripeRefundId");
