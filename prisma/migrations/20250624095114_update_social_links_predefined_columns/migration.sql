/*
  Warnings:

  - You are about to drop the column `isActive` on the `SocialLink` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SocialLink` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `SocialLink` table. All the data in the column will be lost.
  - You are about to drop the column `platform` on the `SocialLink` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `SocialLink` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[userId]` on the table `SocialLink` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "SocialLink" DROP COLUMN "isActive",
DROP COLUMN "name",
DROP COLUMN "order",
DROP COLUMN "platform",
DROP COLUMN "url",
ADD COLUMN     "blog" TEXT,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "github" TEXT,
ADD COLUMN     "hackerrank" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "leetcode" TEXT,
ADD COLUMN     "linkedin" TEXT,
ADD COLUMN     "medium" TEXT,
ADD COLUMN     "portfolio" TEXT,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "youtube" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "SocialLink_userId_key" ON "SocialLink"("userId");
