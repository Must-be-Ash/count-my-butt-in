-- AlterTable
ALTER TABLE "Campaign" ADD COLUMN     "defaultURI" TEXT,
ADD COLUMN     "networkId" "Network" NOT NULL DEFAULT 'ETHEREUM';
