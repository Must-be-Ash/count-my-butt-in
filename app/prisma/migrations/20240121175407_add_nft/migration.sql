-- CreateTable
CREATE TABLE "Nft" (
    "networkId" "Network" NOT NULL DEFAULT 'ETHEREUM',
    "contractAddress" TEXT NOT NULL,
    "tokenId" TEXT NOT NULL,
    "tokenUri" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Nft_networkId_contractAddress_tokenId_key" ON "Nft"("networkId", "contractAddress", "tokenId");
