import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getInstallationAccessTokenById } from "@/lib/accessToken";
import { resolvePortfolioUser } from "@/lib/publicPortfolio";
import { getSession } from "@/lib/session";

const CONTRIBUTIONS_QUERY = `
  query ContributionCalendar($login: String!) {
    user(login: $login) {
      contributionsCollection {
        contributionCalendar {
          totalContributions
          weeks {
            contributionDays {
              color
              contributionCount
              date
              weekday
            }
          }
        }
      }
    }
  }
`;

type ContributionDay = {
  color: string;
  contributionCount: number;
  date: string;
  weekday: number;
};

type GitHubContributionResponse = {
  data?: {
    user?: {
      contributionsCollection: {
        contributionCalendar: {
          totalContributions: number;
          weeks: Array<{ contributionDays: ContributionDay[] }>;
        };
      };
    } | null;
  };
  errors?: Array<{ message: string }>;
};

export async function GET(request: NextRequest) {
  try {
    const portfolioUser = await resolvePortfolioUser(request);
    if (!portfolioUser) {
      return NextResponse.json({ success: false, error: "Portfolio not found" }, { status: 404 });
    }

    const user = await db.user.findUnique({
      where: { id: portfolioUser.id },
      select: {
        username: true,
        installationId: true,
        accessToken: true,
        showGitHubHeatmap: true,
      },
    });
    if (!user) {
      return NextResponse.json({ success: false, error: "Portfolio not found" }, { status: 404 });
    }
    if (!portfolioUser.isOwner && !user.showGitHubHeatmap) {
      return NextResponse.json({ success: true, visible: false });
    }
    let githubAccessToken = user.accessToken;
    if (user.installationId) {
      try {
        githubAccessToken = await getInstallationAccessTokenById(user.installationId);
      } catch (error) {
        console.error(
          "Unable to create GitHub installation token for contributions",
          error instanceof Error ? error.message : "Unknown error"
        );
      }
    }

    if (!githubAccessToken) {
      return NextResponse.json({ success: true, visible: user.showGitHubHeatmap, available: false });
    }

    const githubResponse = await fetch("https://api.github.com/graphql", {
      method: "POST",
      headers: {
        Accept: "application/vnd.github+json",
        Authorization: `Bearer ${githubAccessToken}`,
        "Content-Type": "application/json",
        "User-Agent": "portfolio-creator",
        "X-GitHub-Api-Version": "2022-11-28",
      },
      body: JSON.stringify({ query: CONTRIBUTIONS_QUERY, variables: { login: user.username } }),
      cache: "no-store",
    });
    const githubData = (await githubResponse.json()) as GitHubContributionResponse;
    const calendar = githubData.data?.user?.contributionsCollection.contributionCalendar;
    if (!githubResponse.ok || githubData.errors?.length || !calendar) {
      console.error("GitHub contribution query failed", githubData.errors ?? githubResponse.status);
      return NextResponse.json(
        { success: false, error: "GitHub contribution activity is unavailable" },
        { status: 502 }
      );
    }

    const response = NextResponse.json({
      success: true,
      visible: user.showGitHubHeatmap,
      available: true,
      calendar,
    });
    response.headers.set("Cache-Control", "no-store");
    return response;
  } catch (error) {
    console.error("Failed to load GitHub contributions", error);
    return NextResponse.json(
      { success: false, error: "Unable to load GitHub contribution activity" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  const session = await getSession(request);
  if (!session) {
    return NextResponse.json({ success: false, error: "Authentication required" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { visible?: unknown };
    if (typeof body.visible !== "boolean") {
      return NextResponse.json({ success: false, error: "Visibility must be a boolean" }, { status: 400 });
    }

    await db.user.update({
      where: { id: session.userId },
      data: { showGitHubHeatmap: body.visible },
    });
    return NextResponse.json({ success: true, visible: body.visible });
  } catch (error) {
    console.error("Failed to update GitHub heatmap visibility", error);
    return NextResponse.json({ success: false, error: "Unable to update visibility" }, { status: 500 });
  }
}
