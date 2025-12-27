-- CreateEnum
CREATE TYPE "UpsellStatus" AS ENUM ('PENDING', 'PAID', 'CANCELED');

-- CreateTable
CREATE TABLE "UpsellPurchase" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "kind" TEXT NOT NULL,
    "status" "UpsellStatus" NOT NULL DEFAULT 'PENDING',
    "orderId" TEXT NOT NULL,
    "stripeCheckoutSessionId" TEXT,
    "stripePaymentIntentId" TEXT,
    "amountTotal" INTEGER,
    "currency" TEXT,

    CONSTRAINT "UpsellPurchase_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpsellPurchase_stripeCheckoutSessionId_key" ON "UpsellPurchase"("stripeCheckoutSessionId");

-- CreateIndex
CREATE UNIQUE INDEX "UpsellPurchase_stripePaymentIntentId_key" ON "UpsellPurchase"("stripePaymentIntentId");

-- CreateIndex
CREATE INDEX "UpsellPurchase_orderId_kind_idx" ON "UpsellPurchase"("orderId", "kind");

-- CreateIndex
CREATE INDEX "UpsellPurchase_status_createdAt_idx" ON "UpsellPurchase"("status", "createdAt");

-- AddForeignKey
ALTER TABLE "UpsellPurchase" ADD CONSTRAINT "UpsellPurchase_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
