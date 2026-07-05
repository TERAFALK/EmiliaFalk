import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/api";
import { saveUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Ingen fil bifogad" }, { status: 400 });
  }

  const result = await saveUpload(file);
  if (!result.ok) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ path: result.publicPath });
}
