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
    "transactionId" TEXT NOT NULL,
    "mintedTokenId" TEXT NOT NULL,
    "mintedNetworkId" "Network" NOT NULL,
    "status" "NetworkStatus",
    "autographData" TEXT,
    "autographDataURL" TEXT,
    "metadataUrl" TEXT,

    CONSTRAINT "Order_pkey" PRIMARY KEY ("orderId")
);
