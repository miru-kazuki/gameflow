import { NextResponse } from "next/server";
import { syncProjectFromGitHub } from "@/lib/github";

export async function POST(request: Request) {
  const body = await request.json();
  const { repo, branch, buildFolder } = body;

  if (!repo || !branch) {
    return NextResponse.json(
      { message: "repo and branch are required" },
      { status: 400 }
    );
  }

  const token = process.env.GITHUB_TOKEN;
  const result = await syncProjectFromGitHub(
    repo,
    branch,
    buildFolder ?? "builds",
    token
  );

  return NextResponse.json(result);
}
