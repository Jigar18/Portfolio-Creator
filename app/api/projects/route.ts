import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import {
  deleteProjectVideo,
  getVerifiedProjectVideo,
} from "@/lib/cloudinary";
import { portfolioLookupStatus, resolvePortfolioUser } from "@/lib/publicPortfolio";
import { getRequestUserId } from "@/lib/session";

type ProjectInput = {
  id?: string;
  title?: unknown;
  description?: unknown;
  techStack?: unknown;
  githubUrl?: unknown;
  liveUrl?: unknown;
  videoUrl?: unknown;
  videoPublicId?: unknown;
  videoDuration?: unknown;
  videoBytes?: unknown;
  videoFormat?: unknown;
};

async function parseProject(body: ProjectInput, userId: string) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const techStack = Array.isArray(body.techStack)
    ? body.techStack.filter((skill): skill is string => typeof skill === "string" && skill.trim().length > 0).map((skill) => skill.trim())
    : [];
  const githubUrl = typeof body.githubUrl === "string" && body.githubUrl.trim() ? body.githubUrl.trim() : null;
  const liveUrl = typeof body.liveUrl === "string" && body.liveUrl.trim() ? body.liveUrl.trim() : null;
  const hasVideo = [body.videoUrl, body.videoPublicId, body.videoDuration, body.videoBytes, body.videoFormat]
    .some((value) => value !== null && value !== undefined && value !== "");
  let video = { videoUrl: null as string | null, videoPublicId: null as string | null, videoDuration: null as number | null, videoBytes: null as number | null, videoFormat: null as string | null };

  if (hasVideo) {
    const videoPublicId = typeof body.videoPublicId === "string" ? body.videoPublicId.trim() : "";
    if (!videoPublicId) throw new Error("Project video not found");
    video = await getVerifiedProjectVideo(videoPublicId, userId);
  }

  if (!title || !description) throw new Error("A project title and description are required");
  return { title, description, techStack, githubUrl, liveUrl, ...video };
}

async function removeReplacedVideo(publicId: string | null | undefined) {
  if (!publicId) return;
  try {
    await deleteProjectVideo(publicId);
  } catch (error) {
    console.error("Unable to clean up replaced project video:", error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await resolvePortfolioUser(request);
    if (!user) return NextResponse.json({ success: false, error: "Portfolio not found" }, { status: portfolioLookupStatus(request) });
    const projects = await db.project.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } });
    return NextResponse.json({ success: true, projects });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to load projects" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const userId = await getRequestUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: "Authentication token is missing" }, { status: 401 });
    const project = await db.project.create({ data: { ...await parseProject(await request.json(), userId), userId } });
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to create project" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getRequestUserId(request);
    const body = (await request.json()) as ProjectInput;
    if (!userId || !body.id) return NextResponse.json({ success: false, error: "Project not found" }, { status: 401 });
    const existing = await db.project.findFirst({ where: { id: body.id, userId } });
    if (!existing) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    const projectData = await parseProject(body, userId);
    const project = await db.project.updateMany({ where: { id: body.id, userId }, data: projectData });
    if (!project.count) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    const updated = await db.project.findUnique({ where: { id: body.id } });
    if (existing.videoPublicId && existing.videoPublicId !== projectData.videoPublicId) {
      await removeReplacedVideo(existing.videoPublicId);
    }
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to update project" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getRequestUserId(request);
    const id = request.nextUrl.searchParams.get("id");
    if (!userId || !id) return NextResponse.json({ success: false, error: "Project not found" }, { status: 401 });
    const existing = await db.project.findFirst({ where: { id, userId }, select: { videoPublicId: true } });
    const result = await db.project.deleteMany({ where: { id, userId } });
    if (!result.count) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    await removeReplacedVideo(existing?.videoPublicId);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to delete project" }, { status: 500 });
  }
}
