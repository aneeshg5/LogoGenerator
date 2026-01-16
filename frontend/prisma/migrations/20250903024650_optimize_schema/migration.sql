/*
  Warnings:

  - You are about to drop the column `id_token` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `scope` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `session_state` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `token_type` on the `Account` table. All the data in the column will be lost.
  - You are about to drop the column `emailVerified` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `VerificationToken` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `type` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Made the column `email` on table `User` required. This step will fail if there are existing NULL values in that column.
  - Made the column `username` on table `User` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "public"."Account" DROP COLUMN "id_token",
DROP COLUMN "scope",
DROP COLUMN "session_state",
DROP COLUMN "token_type";

-- AlterTable
ALTER TABLE "public"."Logo" ADD COLUMN     "downloads" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "isPublic" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "public"."Payment" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "type" TEXT NOT NULL DEFAULT 'one_time',
ALTER COLUMN "currency" SET DEFAULT 'usd';

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "emailVerified",
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Update existing users to ensure they have required fields
UPDATE "public"."User" SET "username" = 'user_' || "id" WHERE "username" IS NULL;
UPDATE "public"."User" SET "email" = 'user_' || "id" || '@temp.com' WHERE "email" IS NULL;

-- Now make the columns required
ALTER TABLE "public"."User" ALTER COLUMN "email" SET NOT NULL,
ALTER COLUMN "username" SET NOT NULL;

-- DropTable
DROP TABLE "public"."VerificationToken";

-- CreateIndex
CREATE INDEX "Logo_userId_idx" ON "public"."Logo"("userId");

-- CreateIndex
CREATE INDEX "Logo_isPublic_createdAt_idx" ON "public"."Logo"("isPublic", "createdAt");

-- CreateIndex
CREATE INDEX "Logo_downloads_idx" ON "public"."Logo"("downloads");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "public"."Payment"("userId");
