-- CreateEnum
CREATE TYPE "AdminWorkItemKind" AS ENUM ('READY', 'STALLED', 'LEAD', 'UPSELL');

-- CreateEnum
CREATE TYPE "AdminWorkItemStatus" AS ENUM ('TODO', 'IN_PROGRESS', 'DONE', 'SNOOZED');

-- CreateTable
CREATE TABLE "AdminWorkItem" (
    "id" TEXT NOT NULL,
    "kind" "AdminWorkItemKind" NOT NULL,
    "refId" TEXT NOT NULL,
    "status" "AdminWorkItemStatus" NOT NULL DEFAULT 'TODO',
    "note" TEXT,
    "snoozeUntil" TIMESTAMP(3),
    "doneAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdminWorkItem_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AdminWorkItem_kind_status_idx" ON "AdminWorkItem"("kind", "status");

-- CreateIndex
CREATE UNIQUE INDEX "AdminWorkItem_kind_refId_key" ON "AdminWorkItem"("kind", "refId");
