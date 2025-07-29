import bcrypt from "bcryptjs";
import { prisma } from "../prisma";

export async function registerUser(name: string, email: string, password: string) {
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) throw new Error("Email already in use");

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({
    data: { name, email, password: hashedPassword },
  })

  return user;
}