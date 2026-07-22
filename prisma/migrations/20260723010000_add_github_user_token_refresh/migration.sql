ALTER TABLE "User"
ADD COLUMN "githubRefreshToken" TEXT,
ADD COLUMN "githubAccessTokenExpiresAt" TIMESTAMP(3),
ADD COLUMN "githubRefreshTokenExpiresAt" TIMESTAMP(3);
