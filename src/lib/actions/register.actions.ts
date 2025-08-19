"use server";

import { prisma } from "../prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { FormState } from "@/types";

export async function register(_prevState: FormState, formData: FormData): Promise<FormState> {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return { error: "Cet email est déjà utilisé." };
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: { name, email, password: hashedPassword },
  });

  redirect("/login");
}