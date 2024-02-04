-- CreateEnum
CREATE TYPE "UserType" AS ENUM ('MINION', 'ARTIST');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userType" "UserType" NOT NULL DEFAULT 'MINION';
