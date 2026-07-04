import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest, notFound } from "@/lib/api";
import { meritSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const parsed = meritSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  try {
    await prisma.merit.update({
      where: { id },
      data: {
        title: d.title,
        description: d.description || null,
        date: new Date(d.date),
        placement: d.placement || null,
      },
    });
  } catch {
    return notFound("Meriten hittades inte");
  }
  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  try {
    await prisma.merit.delete({ where: { id } });
  } catch {
    return notFound("Meriten hittades inte");
  }
  return NextResponse.json({ ok: true });
}
