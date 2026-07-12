UPDATE "User" AS u
SET "installationId" = NULL
WHERE "installationId" IS NOT NULL
  AND NOT EXISTS (
    SELECT 1 FROM "GitHubInstallation" AS i WHERE i."id" = u."installationId"
  );

ALTER TABLE "User"
ADD CONSTRAINT "User_installationId_fkey"
FOREIGN KEY ("installationId") REFERENCES "GitHubInstallation"("id")
ON DELETE SET NULL ON UPDATE CASCADE;
