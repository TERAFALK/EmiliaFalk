import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest } from "@/lib/api";
import { sponsorSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const parsed = sponsorSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  const sponsor = await prisma.sponsor.create({
    data: {
      name: d.name,
      logoPath: d.logoPath,
      url: d.url || null,
      sortOrder: d.sortOrder ?? 0,
      active: d.active ?? true,
    },
  });

  return NextResponse.json({ id: sponsor.id }, { status: 201 });
}
