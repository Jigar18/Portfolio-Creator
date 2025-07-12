/*
  Warnings:

  - The `pdfUrl` column on the `Certifications` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Certifications" DROP COLUMN "pdfUrl",
ADD COLUMN     "pdfUrl" TEXT[];
