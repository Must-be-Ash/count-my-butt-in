-- CreateEnum
CREATE TYPE "Network" AS ENUM ('ETHEREUM', 'POLYGON', 'GNOSIS', 'BASE');

-- CreateEnum
CREATE TYPE "NetworkStatus" AS ENUM ('PENDING', 'CONFIRMED', 'FAILED');

-- CreateTable
CREATE TABLE "Order" (
    "orderId" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,
    "collectionNetwork" "Network" NOT NULL,
    "collectionAddress" TEXT NOT NULL,
    "selectedTokenId" TEXT NOT NULL,
    "personalNote" TEXT,
    "transactionId" TEXT,
    "mintedTokenId" TEXT,
    "mintedNetworkId" "Network",
    "status" "NetworkStatus",
    "autographData" TEXT,
    "autographDataURL" TEXT,
    "metadataUrl" TEXT,
    "toUpload" TEXT,
    "nftImageURL" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);
