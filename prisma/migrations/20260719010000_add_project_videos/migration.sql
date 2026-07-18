ALTER TABLE "Project"
ADD COLUMN "videoUrl" TEXT,
ADD COLUMN "videoPublicId" TEXT,
ADD COLUMN "videoDuration" DOUBLE PRECISION,
ADD COLUMN "videoBytes" INTEGER,
ADD COLUMN "videoFormat" TEXT;

CREATE UNIQUE INDEX "Project_videoPublicId_key" ON "Project"("videoPublicId");
