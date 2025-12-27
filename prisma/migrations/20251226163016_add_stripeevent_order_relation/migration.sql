-- CreateEnum
CREATE TYPE "BriefingStatus" AS ENUM ('DRAFT', 'SUBMITTED');

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "customerEmail" TEXT,
ADD COLUMN     "stripeCustomerId" TEXT,
ADD COLUMN     "stripeMetadata" JSONB;

-- AlterTable
ALTER TABLE "StripeEvent" ADD COLUMN     "orderId" TEXT,
ADD COLUMN     "processedAt" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "Briefing" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "status" "BriefingStatus" NOT NULL DEFAULT 'DRAFT',
    "data" JSONB,
    "submittedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Briefing_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Briefing_orderId_key" ON "Briefing"("orderId");

-- CreateIndex
CREATE INDEX "Briefing_status_createdAt_idx" ON "Briefing"("status", "createdAt");

-- CreateIndex
CREATE INDEX "StripeEvent_orderId_idx" ON "StripeEvent"("orderId");

-- AddForeignKey
ALTER TABLE "Briefing" ADD CONSTRAINT "Briefing_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StripeEvent" ADD CONSTRAINT "StripeEvent_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE SET NULL ON UPDATE CASCADE;
