import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import axios from "axios";
import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

export async function getAccessToken(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    throw new Error("Authentication token is missing");
  }

  const { payload } = await jwtVerify(
    token,
    new TextEncoder().encode(process.env.JWT_SECRET)
  );
  const githubId = payload.githubId as string;

  const userInfo = await db.user.findUnique({
    where: { githubId: String(githubId) },
    select: { installationId: true },
  });

  const payloadCreate = {
    iss: process.env.GITHUB_APP_ID,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 10 * 60,
  };

  const privateKey = process.env.GITHUB_APP_PRIVATE_KEY!.replace(/\\n/g, "\n");

  const jwtToken = jwt.sign(payloadCreate, privateKey, { algorithm: "RS256" });

  const tokenResponse = await axios.post(
    `https://api.github.com/app/installations/${userInfo?.installationId}/access_tokens`,
    {},
    {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
    }
  );

  const accessToken = tokenResponse.data.token;
  return accessToken;
}
