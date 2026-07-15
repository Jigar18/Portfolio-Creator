import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { db } from "@/lib/db";
import { portfolioLookupStatus, resolvePortfolioUser } from "@/lib/publicPortfolio";

type ProjectInput = {
  id?: string;
  title?: unknown;
  description?: unknown;
  techStack?: unknown;
  githubUrl?: unknown;
  liveUrl?: unknown;
};

async function getUserId(request: NextRequest) {
  const token = request.cookies.get("id&Uname")?.value;
  if (!token) return null;
  const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.JWT_SECRET!));
  return typeof payload.userId === "string" ? payload.userId : null;
}

function parseProject(body: ProjectInput) {
  const title = typeof body.title === "string" ? body.title.trim() : "";
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const techStack = Array.isArray(body.techStack)
    ? body.techStack.filter((skill): skill is string => typeof skill === "string" && skill.trim().length > 0).map((skill) => skill.trim())
    : [];
  const githubUrl = typeof body.githubUrl === "string" && body.githubUrl.trim() ? body.githubUrl.trim() : null;
  const liveUrl = typeof body.liveUrl === "string" && body.liveUrl.trim() ? body.liveUrl.trim() : null;

  if (!title || !description) throw new Error("A project title and description are required");
  return { title, description, techStack, githubUrl, liveUrl };
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
    const userId = await getUserId(request);
    if (!userId) return NextResponse.json({ success: false, error: "Authentication token is missing" }, { status: 401 });
    const project = await db.project.create({ data: { ...parseProject(await request.json()), userId } });
    return NextResponse.json({ success: true, project }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to create project" }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    const body = (await request.json()) as ProjectInput;
    if (!userId || !body.id) return NextResponse.json({ success: false, error: "Project not found" }, { status: 401 });
    const project = await db.project.updateMany({ where: { id: body.id, userId }, data: parseProject(body) });
    if (!project.count) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    const updated = await db.project.findUnique({ where: { id: body.id } });
    return NextResponse.json({ success: true, project: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: error instanceof Error ? error.message : "Unable to update project" }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const userId = await getUserId(request);
    const id = request.nextUrl.searchParams.get("id");
    if (!userId || !id) return NextResponse.json({ success: false, error: "Project not found" }, { status: 401 });
    const result = await db.project.deleteMany({ where: { id, userId } });
    if (!result.count) return NextResponse.json({ success: false, error: "Project not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ success: false, error: "Unable to delete project" }, { status: 500 });
  }
}
