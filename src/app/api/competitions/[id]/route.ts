import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest, notFound } from "@/lib/api";
import { competitionSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const parsed = competitionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  try {
    await prisma.competition.update({
      where: { id },
      data: {
        name: d.name,
        date: new Date(d.date),
        location: d.location || null,
        discipline: d.discipline || "Luftgevär stående",
        description: d.description || null,
        isCompleted: d.isCompleted ?? false,
      },
    });
  } catch {
    return notFound("Tävlingen hittades inte");
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
    await prisma.competition.delete({ where: { id } });
  } catch {
    return notFound("Tävlingen hittades inte");
  }
  return NextResponse.json({ ok: true });
}
