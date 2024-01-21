-- DropIndex
DROP INDEX "Order_mintedTokenId_collectionAddress_status_idx";

-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "mintedContractAddress" TEXT;

-- CreateIndex
CREATE INDEX "Order_mintedTokenId_mintedContractAddress_status_idx" ON "Order"("mintedTokenId", "mintedContractAddress", "status");
