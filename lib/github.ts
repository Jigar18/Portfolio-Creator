import jwt from "jsonwebtoken";

export function getGitHubAppJwt() {
  const appId = process.env.GITHUB_APP_ID ?? process.env.APP_ID;
  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY;

  if (!appId || !privateKey) {
    throw new Error("GitHub App credentials are not configured");
  }

  return jwt.sign(
    {
      iss: appId,
      iat: Math.floor(Date.now() / 1000) - 30,
      exp: Math.floor(Date.now() / 1000) + 9 * 60,
    },
    privateKey.replace(/\\n/g, "\n"),
    { algorithm: "RS256" }
  );
}
