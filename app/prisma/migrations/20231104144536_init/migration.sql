-- CreateTable
CREATE TABLE "Artist" (
    "id" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "email" TEXT,
    "walletAddress" TEXT,

    CONSTRAINT "Artist_pkey" PRIMARY KEY ("id")
);
