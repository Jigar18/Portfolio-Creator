/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `Details` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Details` table without a default value. This is not possible if the table is not empty.
  - Added the required column `userId` to the `Details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Details" ADD COLUMN     "about" TEXT,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "userId" TEXT NOT NULL,
ADD CONSTRAINT "Details_pkey" PRIMARY KEY ("id");

-- DropIndex
DROP INDEX "Details_id_key";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "accessToken" TEXT;

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "skills" TEXT[],
    "userId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Details_userId_key" ON "Details"("userId");

-- AddForeignKey
ALTER TABLE "Details" ADD CONSTRAINT "Details_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
