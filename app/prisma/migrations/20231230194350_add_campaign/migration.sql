-- CreateTable
CREATE TABLE "Campaign" (
    "campaignId" TEXT NOT NULL,
    "manifestUrl" TEXT,
    "whitelistedCollectionAddresses" TEXT[],

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("campaignId")
);
