-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "privyUserId" TEXT NOT NULL DEFAULT '';

-- CreateIndex
CREATE INDEX "privyUserId_status_index" ON "Order"("privyUserId", "status");
