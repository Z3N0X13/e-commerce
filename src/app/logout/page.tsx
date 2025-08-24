"use client";

import { useEffect } from "react";
import { signOut } from "next-auth/react";

export default function LogoutPage() {
  useEffect(() => {
    signOut({ callbackUrl: "/login" });
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-black/30">
      <div className="flex flex-col items-center gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-4 border-green-500 border-opacity-50" />

        <p className="text-gray-700 dark:text-gray-400 text-lg font-medium">
          Déconnexion en cours...
        </p>
      </div>
    </div>
  );
}
