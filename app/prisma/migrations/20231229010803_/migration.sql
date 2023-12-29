-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "transactionId" DROP NOT NULL,
ALTER COLUMN "mintedTokenId" DROP NOT NULL,
ALTER COLUMN "mintedNetworkId" DROP NOT NULL;
