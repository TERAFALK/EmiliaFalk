// Seed-script som körs vid containerstart (node prisma/seed.mjs).
// Skapar admin-användaren (pappa) från env, idempotent.
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administratör";

  if (!email || !password) {
    console.warn(
      "[seed] ADMIN_EMAIL/ADMIN_PASSWORD saknas – hoppar över admin-seed."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    // Uppdatera lösenord/namn ifall env ändrats.
    await prisma.user.update({
      where: { email },
      data: { passwordHash, name },
    });
    console.log(`[seed] Uppdaterade admin: ${email}`);
  } else {
    await prisma.user.create({
      data: { email, name, passwordHash, role: "ADMIN" },
    });
    console.log(`[seed] Skapade admin: ${email}`);
  }
}

main()
  .catch((e) => {
    console.error("[seed] Fel:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
