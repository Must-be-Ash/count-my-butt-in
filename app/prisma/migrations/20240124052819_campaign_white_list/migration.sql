/*
  Warnings:

  - You are about to drop the column `whitelistedCollectionAddresses` on the `Campaign` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Campaign" DROP COLUMN "whitelistedCollectionAddresses";

-- CreateTable
CREATE TABLE "CampaignWhiteList" (
    "campaignId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "networkId" "Network" NOT NULL DEFAULT 'ETHEREUM',
    "contractAddress" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL DEFAULT ''
);

-- CreateIndex
CREATE UNIQUE INDEX "CampaignWhiteList_campaignId_networkId_contractAddress_toke_key" ON "CampaignWhiteList"("campaignId", "networkId", "contractAddress", "tokenId");
