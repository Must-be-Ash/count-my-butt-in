-- CreateIndex
CREATE INDEX "Order_mintedTokenId_collectionAddress_status_idx" ON "Order"("mintedTokenId", "collectionAddress", "status");
