import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest } from "@/lib/api";
import { resultSchema } from "@/lib/validation";
import { computeAggregates } from "@/lib/stats";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const parsed = resultSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const { date, matchType, shots, competitionId, note } = parsed.data;
  const agg = computeAggregates(shots);

  const result = await prisma.result.create({
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

  return NextResponse.json({ id: result.id }, { status: 201 });
}
