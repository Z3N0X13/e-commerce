"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });

    if (res.ok) {
      setMessage("Un lien de réinitialisation a été envoyé.");
    } else {
      setMessage("Erreur lors de la demande.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="space-y-4 w-full max-w-md border p-6 rounded-lg shadow-md"
      >
        <h1 className="text-xl font-bold">Mot de passe oublié</h1>

        <div className="space-y-2">
          <Label htmlFor="email" className="flex gap-2 items-center">
            <Mail className="w-4 h-4" />
            Email
          </Label>
          <Input
            name="email"
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <Button type="submit" className="w-full cursor-pointer">
          Envoyer un lien
        </Button>

        {message && (
          <p className="text-sm text-center text-muted-foreground">{message}</p>
        )}
      </form>
    </div>
  );
}
