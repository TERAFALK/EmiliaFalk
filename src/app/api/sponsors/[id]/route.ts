import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest, notFound } from "@/lib/api";
import { sponsorSchema } from "@/lib/validation";
import { deleteUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const parsed = sponsorSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  const existing = await prisma.sponsor.findUnique({ where: { id } });
  if (!existing) return notFound("Sponsorn hittades inte");

  if (existing.logoPath && existing.logoPath !== d.logoPath) {
    await deleteUpload(existing.logoPath);
  }

  await prisma.sponsor.update({
    where: { id },
    data: {
      name: d.name,
      logoPath: d.logoPath,
      url: d.url || null,
      sortOrder: d.sortOrder ?? existing.sortOrder,
      active: d.active ?? existing.active,
    },
  });

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const existing = await prisma.sponsor.findUnique({ where: { id } });
  if (!existing) return notFound("Sponsorn hittades inte");

  await deleteUpload(existing.logoPath);
  await prisma.sponsor.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
