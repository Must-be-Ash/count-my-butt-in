-- AlterTable
ALTER TABLE "User" ADD COLUMN     "funded" BOOLEAN DEFAULT false,
ALTER COLUMN "privyId" DROP NOT NULL;
