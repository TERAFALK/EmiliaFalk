import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest, notFound } from "@/lib/api";
import { newsSchema } from "@/lib/validation";
import { deleteUpload } from "@/lib/uploads";

export const runtime = "nodejs";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;
  const { id } = await params;

  const parsed = newsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  const existing = await prisma.newsPost.findUnique({ where: { id } });
  if (!existing) return notFound("Nyheten hittades inte");

  // Ta bort gammal bild om den bytts ut.
  if (existing.imagePath && existing.imagePath !== d.imagePath) {
    await deleteUpload(existing.imagePath);
  }

  await prisma.newsPost.update({
    where: { id },
    data: {
      title: d.title,
      body: d.body,
      imagePath: d.imagePath || null,
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : existing.publishedAt,
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

  const existing = await prisma.newsPost.findUnique({ where: { id } });
  if (!existing) return notFound("Nyheten hittades inte");

  await deleteUpload(existing.imagePath);
  await prisma.newsPost.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
