-- CreateTable
CREATE TABLE "OrderAccessLink" (
    "id" TEXT NOT NULL,
    "orderId" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "revokedAt" TIMESTAMP(3),
    "destinationEmail" TEXT,
    "destinationPhone" TEXT,
    "lastUsedAt" TIMESTAMP(3),
    "useCount" INTEGER NOT NULL DEFAULT 0,
    "lastSentAt" TIMESTAMP(3),
    "sendCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OrderAccessLink_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "OrderAccessLink_tokenHash_key" ON "OrderAccessLink"("tokenHash");

-- CreateIndex
CREATE INDEX "OrderAccessLink_orderId_idx" ON "OrderAccessLink"("orderId");

-- CreateIndex
CREATE INDEX "OrderAccessLink_expiresAt_idx" ON "OrderAccessLink"("expiresAt");

-- AddForeignKey
ALTER TABLE "OrderAccessLink" ADD CONSTRAINT "OrderAccessLink_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
