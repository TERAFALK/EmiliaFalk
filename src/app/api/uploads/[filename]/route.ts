import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { UPLOAD_DIR, contentTypeFor } from "@/lib/uploads";

export const runtime = "nodejs";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ filename: string }> }
) {
  const { filename } = await params;

  // Skydda mot path traversal.
  if (
    filename.includes("..") ||
    filename.includes("/") ||
    filename.includes("\\")
  ) {
    return new NextResponse("Bad request", { status: 400 });
  }

  try {
    const filePath = path.join(UPLOAD_DIR, filename);
    const file = await fs.readFile(filePath);
    return new NextResponse(new Uint8Array(file), {
      status: 200,
      headers: {
        "Content-Type": contentTypeFor(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}
