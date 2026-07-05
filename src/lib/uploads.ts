import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";

// Uppladdade bilder (sponsorloggor, nyhetsbilder) lagras på en volym.
export const UPLOAD_DIR = process.env.UPLOAD_DIR || "/app/uploads";

const ALLOWED = new Map<string, string>([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/webp", "webp"],
  ["image/avif", "avif"],
  ["image/gif", "gif"],
  ["image/svg+xml", "svg"],
]);

const MAX_BYTES = 4 * 1024 * 1024; // 4 MB

export type SaveResult =
  | { ok: true; filename: string; publicPath: string }
  | { ok: false; error: string };

/** Sparar en uppladdad fil på volymen och returnerar dess publika sökväg. */
export async function saveUpload(file: File): Promise<SaveResult> {
  const ext = ALLOWED.get(file.type);
  if (!ext) {
    return {
      ok: false,
      error: "Otillåten filtyp (använd PNG, JPG, WEBP, AVIF, GIF eller SVG).",
    };
  }
  if (file.size > MAX_BYTES) {
    return { ok: false, error: "Filen är för stor (max 4 MB)." };
  }

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return { ok: true, filename, publicPath: `/api/uploads/${filename}` };
}

/** Tar bort en uppladdad fil (best effort) givet dess publika sökväg. */
export async function deleteUpload(publicPath: string | null | undefined) {
  if (!publicPath) return;
  const filename = publicPath.split("/").pop();
  if (!filename) return;
  // Skydda mot path traversal.
  if (filename.includes("..") || filename.includes("/") || filename.includes("\\")) return;
  try {
    await fs.unlink(path.join(UPLOAD_DIR, filename));
  } catch {
    // Ignorera om filen redan är borta.
  }
}

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  webp: "image/webp",
  avif: "image/avif",
  gif: "image/gif",
  svg: "image/svg+xml",
};

export function contentTypeFor(filename: string): string {
  const ext = filename.split(".").pop()?.toLowerCase() || "";
  return CONTENT_TYPES[ext] || "application/octet-stream";
}
