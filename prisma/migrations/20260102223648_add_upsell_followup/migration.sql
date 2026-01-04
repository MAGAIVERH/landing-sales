-- CreateTable
CREATE TABLE "UpsellFollowup" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "kind" TEXT NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3),
    "closeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UpsellFollowup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UpsellFollowup_orderId_key" ON "UpsellFollowup"("orderId");

-- CreateIndex
CREATE INDEX "UpsellFollowup_kind_idx" ON "UpsellFollowup"("kind");

-- CreateIndex
CREATE INDEX "UpsellFollowup_closeAt_idx" ON "UpsellFollowup"("closeAt");

-- AddForeignKey
ALTER TABLE "UpsellFollowup" ADD CONSTRAINT "UpsellFollowup_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
