/*
  Warnings:

  - You are about to drop the column `userId` on the `Details` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[id]` on the table `Details` will be added. If there are existing duplicate values, this will fail.
  - The required column `id` was added to the `Details` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropIndex
DROP INDEX "Details_userId_key";

-- AlterTable
ALTER TABLE "Details" DROP COLUMN "userId",
ADD COLUMN     "id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Details_id_key" ON "Details"("id");
