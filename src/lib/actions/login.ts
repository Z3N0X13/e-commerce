"use server";

import { signIn } from "next-auth/react";
import { FormState } from "@/types";

export async function login(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  try {
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (!res) {
      return { error: "Aucune réponse du serveur." };
    }

    if (res.error) {
      return { error: res.error };
    }

    if (!res.ok) {
      return { error: "Connexion échouée. Vérifie tes informations." };
    }

    return {};
  } catch (error) {
    return { error: "Une erreur est survenue : " + (error as Error).message };
  }
}