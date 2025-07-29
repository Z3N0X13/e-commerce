import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { addHours } from "date-fns";

export async function POST(req: Request) {
  const { email } = await req.json();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  const token = randomBytes(32).toString("hex");

  await prisma.passwordResetToken.create({
    data: {
      email,
      token,
      expiresAt: addHours(new Date(), 1),
    },
  });

  const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;
  console.log("🔗 Lien de réinitialisation :", resetLink);

  return NextResponse.json({ success: true });
}