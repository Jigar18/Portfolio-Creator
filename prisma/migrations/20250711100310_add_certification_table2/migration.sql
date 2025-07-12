/*
  Warnings:

  - Added the required column `userId` to the `Certifications` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Certifications" ADD COLUMN     "userId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "Certifications" ADD CONSTRAINT "Certifications_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
