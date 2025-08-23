"use client";

import React from "react";

export default function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 bg-white border rounded-xl">
      <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
        <span className="text-2xl">🧾</span>
      </div>
      <h3 className="text-lg font-semibold text-gray-900">Aucune commande trouvée</h3>
      <p className="text-gray-500 mt-1 max-w-md">
        Vous n&apos;avez pas encore passé de commande, ou aucun résultat ne correspond à votre recherche.
      </p>
    </div>
  );
}


