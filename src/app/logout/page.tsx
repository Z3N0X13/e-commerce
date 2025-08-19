"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500 border-opacity-50" />

        <p className="text-gray-700 text-lg font-medium">
          Déconnexion en cours...
        </p>
      </div>
    </div>
  );
}
