import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { requireAdmin, badRequest } from "@/lib/api";
import { newsSchema } from "@/lib/validation";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const auth = await requireAdmin();
  if ("response" in auth) return auth.response;

  const parsed = newsSchema.safeParse(await req.json());
  if (!parsed.success) {
    return badRequest("Valideringsfel", parsed.error.flatten());
  }
  const d = parsed.data;

  const post = await prisma.newsPost.create({
    data: {
      title: d.title,
      body: d.body,
      imagePath: d.imagePath || null,
      publishedAt: d.publishedAt ? new Date(d.publishedAt) : new Date(),
      authorId: auth.session.userId,
    },
  });

  return NextResponse.json({ id: post.id }, { status: 201 });
}
