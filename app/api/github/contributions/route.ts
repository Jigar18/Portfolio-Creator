import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  getInstallationAccessTokenById,
  getUserAccessTokenById,
} from "@/lib/accessToken";
import { resolvePortfolioUser } from "@/lib/publicPortfolio";
import { getSession } from "@/lib/session";

const CONTRIBUTIONS_QUERY = `
  query ContributionCalendar($login: String!, $from: DateTime!, $to: DateTime!) {
    user(login: $login) {
      contributionsCollection(from: $from, to: $to) {
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

const fetchContributionCalendar = async (
  accessToken: string,
  username: string,
  from: string,
  to: string,
) => {
  const response = await fetch("https://api.github.com/graphql", {
    method: "POST",
    headers: {
      Accept: "application/vnd.github+json",
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
      "User-Agent": "portfolio-creator",
      "X-GitHub-Api-Version": "2022-11-28",
    },
    body: JSON.stringify({
      query: CONTRIBUTIONS_QUERY,
      variables: { login: username, from, to },
    }),
    cache: "no-store",
  });

  return {
    response,
    data: (await response.json()) as GitHubContributionResponse,
  };
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
        showGitHubHeatmap: true,
      },
    });
    if (!user) {
      return NextResponse.json({ success: false, error: "Portfolio not found" }, { status: 404 });
    }
    if (!portfolioUser.isOwner && !user.showGitHubHeatmap) {
      return NextResponse.json({ success: true, visible: false });
    }
    let githubAccessToken: string | null = null;
    try {
      githubAccessToken = await getUserAccessTokenById(portfolioUser.id);
    } catch (error) {
      console.error(
        "Unable to refresh the GitHub user token for contributions",
        error instanceof Error ? error.message : "Unknown error",
      );
    }
    if (!githubAccessToken && user.installationId) {
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

    const now = new Date();
    const contributionYear = now.getUTCFullYear();
    const from = `${contributionYear}-01-01T00:00:00.000Z`;
    const to = now.toISOString();
    let result = await fetchContributionCalendar(githubAccessToken, user.username, from, to);

    if (result.response.status === 401 && user.installationId) {
      try {
        const installationToken = await getInstallationAccessTokenById(user.installationId);
        result = await fetchContributionCalendar(installationToken, user.username, from, to);
      } catch (error) {
        console.error(
          "Unable to retry GitHub contributions with an installation token",
          error instanceof Error ? error.message : "Unknown error",
        );
      }
    }

    const { response: githubResponse, data: githubData } = result;
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
      contributionYear,
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
