import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest, notFound } from "@/lib/api";
import { resultSchema } from "@/lib/validation";
import { computeAggregates } from "@/lib/stats";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const parsed = resultSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const { date, matchType, shots, competitionId, note } = parsed.data;
  const agg = computeAggregates(shots);

  try {
    await prisma.result.update({
      where: { id },
      data: {
        date: new Date(date),
        matchType,
        shots: JSON.stringify(shots),
        total: agg.total,
        shotCount: agg.shotCount,
        average: agg.average,
        note: note || null,
        competitionId: competitionId || null,
      },
    });
  } catch {
    return notFound("Resultatet hittades inte");
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
    await prisma.result.delete({ where: { id } });
  } catch {
    return notFound("Resultatet hittades inte");
  }
  return NextResponse.json({ ok: true });
}
