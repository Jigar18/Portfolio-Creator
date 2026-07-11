ALTER TABLE "User" ADD COLUMN "githubAccessTokenUpdatedAt" TIMESTAMP(3);

CREATE TABLE "GitHubInstallation" (
    "id" TEXT NOT NULL,
    "accountId" TEXT NOT NULL,
    "accountLogin" TEXT NOT NULL,
    "accountType" TEXT NOT NULL,
    "targetId" TEXT,
    "targetType" TEXT,
    "senderGithubId" TEXT,
    "permissions" JSONB NOT NULL,
    "events" TEXT[] NOT NULL,
    "suspendedAt" TIMESTAMP(3),
    "deletedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GitHubInstallation_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "GitHubInstallation_accountId_idx" ON "GitHubInstallation"("accountId");
CREATE INDEX "GitHubInstallation_senderGithubId_idx" ON "GitHubInstallation"("senderGithubId");
