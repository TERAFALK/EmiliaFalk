import { NextResponse } from "next/server";
import { getSession, type SessionPayload } from "@/lib/session";

/**
 * Säkerställer att anroparen är inloggad admin.
 * Returnerar antingen sessionen eller ett färdigt 401-svar att returnera direkt.
 */
export async function requireAdmin(): Promise<
  { session: SessionPayload } | { response: NextResponse }
> {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    return {
      response: NextResponse.json(
        { error: "Ej behörig" },
        { status: 401 }
      ),
    };
  }
  return { session };
}

export function badRequest(message: string, details?: unknown) {
  return NextResponse.json({ error: message, details }, { status: 400 });
}

export function notFound(message = "Hittades inte") {
  return NextResponse.json({ error: message }, { status: 404 });
}
