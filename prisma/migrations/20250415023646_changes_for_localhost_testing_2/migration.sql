/*
  Warnings:

  - The primary key for the `Details` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - A unique constraint covering the columns `[userId]` on the table `Details` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Details" DROP CONSTRAINT "Details_pkey";

-- CreateIndex
CREATE UNIQUE INDEX "Details_userId_key" ON "Details"("userId");
