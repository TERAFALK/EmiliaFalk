import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest } from "@/lib/api";
import { competitionSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const parsed = competitionSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  const comp = await prisma.competition.create({
    data: {
      name: d.name,
      date: new Date(d.date),
      location: d.location || null,
      discipline: d.discipline || "Luftgevär stående",
      description: d.description || null,
      isCompleted: d.isCompleted ?? false,
    },
  });

  return NextResponse.json({ id: comp.id }, { status: 201 });
}
