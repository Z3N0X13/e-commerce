"use client";

import Link from "next/link";
import { signIn } from "next-auth/react";
import { redirect } from "next/navigation";
import { useActionState, useState } from "react";
import { Lock, Mail, User, Eye, EyeOff } from "lucide-react";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { FormState } from "@/types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function AuthForm({
  action,
  type,
}: {
  action: (prevState: FormState, formData: FormData) => Promise<FormState>;
  type: "login" | "register";
}) {
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [state, formAction] = useActionState<FormState, FormData>(action, {});

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (type === "register") {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erreur lors de l'inscription.");
        return;
      }
    }

    const resSignIn = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (resSignIn?.error) {
      setError(resSignIn.error);
    } else if (resSignIn?.ok) {
      redirect("/dashboard");
    } else {
      setError("Une erreur est survenue.");
    }
  };

  return (
    <main className=" h-screen flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-xl shadow-xl rounded-2xl p-6 md:p-10">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-3xl font-bold">
            {type === "login" ? "Connexion" : "Créer un compte"}
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {type === "login"
              ? "Connectez-vous pour accéder à votre espace"
              : "Inscrivez-vous pour commencer l'expérience"}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form
            onSubmit={handleSubmit}
            action={formAction}
            className="space-y-6 mt-4 w-full mx-auto"
          >
            {type === "register" && (
              <div className="space-y-2">
                <Label htmlFor="name" className="flex gap-2 items-center">
                  <User className="w-4 h-4" />
                  Nom
                </Label>
                <Input name="name" type="text" required />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="flex gap-2 items-center">
                <Mail className="w-4 h-4" />
                Email
              </Label>
              <Input name="email" type="email" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex gap-2 items-center">
                <Lock className="w-4 h-4" />
                Mot de passe
              </Label>
              <div className="relative">
                <Input 
                  name="password" 
                  type={showPassword ? "text" : "password"} 
                  required 
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </Button>
              </div>
            </div>

            {type === "login" && (
              <div className="flex justify-end text-sm text-muted-foreground -mb-2 transition-all">
                <Link href="/forgot-password" className="hover:text-green-500 hover:underline">
                  Mot de passe oublié ?
                </Link>
              </div>
            )}

            {error && (
              <p className="text-sm text-red-500 text-center italic">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full mt-4 text-base h-11 cursor-pointer"
            >
              {type === "login" ? "Se connecter" : "S'inscrire"}
            </Button>

            <div className="mt-2 text-sm text-center text-muted-foreground">
              {type === "login" ? (
                <>
                  Pas encore de compte ?{" "}
                  <Link href="/register" className="transition-all hover:text-green-500 hover:underline">
                    Inscrivez-vous
                  </Link>
                </>
              ) : (
                <>
                  Déjà un compte ?{" "}
                  <Link href="/login" className="transition-all hover:text-green-500 hover:underline">
                    Connectez-vous
                  </Link>
                </>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}
