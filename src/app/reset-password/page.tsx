"use client";

import { useState } from "react";
import { redirect, useSearchParams } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const params = useSearchParams();
  const token = params.get("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, password }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setMessage("Mot de passe mis à jour !");
      redirect("/login")
    } else {
      setMessage("Lien invalide ou expiré.");
    }
  };
m
  if (!token) return <p>Token manquant.</p>;

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md border p-6 rounded-lg shadow-md"
      >
        <h1 className="text-xl font-bold">Réinitialisation du mot de passe</h1>

        <div className="space-y-2">
          <Label htmlFor="password" className="flex gap-2 items-center">
            Nouveau mot de passe
          </Label>
          <Input
            name="password"
            type="password"
            id="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Réinitialiser
        </Button>

        {message && (
          <p className="text-sm text-center text-muted-foreground">{message}</p>
        )}
      </form>
    </div>
  );
}
