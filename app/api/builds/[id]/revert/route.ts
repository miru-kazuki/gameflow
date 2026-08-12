import { NextResponse } from "next/server";
import { revertBuild } from "@/lib/store";

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const result = revertBuild(id);

  if (!result.success) {
    return NextResponse.json(
      { success: false, message: result.message },
      { status: 404 }
    );
  }

  return NextResponse.json({
    success: true,
    message: result.message,
    activeBuild: result.activeBuild,
  });
}
