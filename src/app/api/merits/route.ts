import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest } from "@/lib/api";
import { meritSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const parsed = meritSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  const merit = await prisma.merit.create({
    data: {
      title: d.title,
      description: d.description || null,
      date: new Date(d.date),
      placement: d.placement || null,
    },
  });

  return NextResponse.json({ id: merit.id }, { status: 201 });
}
