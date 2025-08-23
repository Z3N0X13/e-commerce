"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  status: string;
  setStatus: (v: string) => void;
  search: string;
  setSearch: (v: string) => void;
};

export default function FiltersBar({ status, setStatus, search, setSearch }: Props) {
  return (
    <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
      <div className="flex items-center gap-2">
        <button
          onClick={() => setStatus("")}
          className={`px-3 py-1.5 rounded-full text-sm border ${status === "" ? "bg-neutral-900 text-white border-neutral-900" : "hover:bg-gray-50"}`}
        >
          Tous
        </button>
        {[
          { key: "pending", label: "En attente" },
          { key: "processing", label: "En préparation" },
          { key: "shipped", label: "Expédiée" },
          { key: "delivered", label: "Livrée" },
          { key: "cancelled", label: "Annulée" },
        ].map((s) => (
          <button
            key={s.key}
            onClick={() => setStatus(s.key)}
            className={`px-3 py-1.5 rounded-full text-sm border ${status === s.key ? "bg-neutral-900 text-white border-neutral-900" : "hover:bg-gray-50"}`}
          >
            {s.label}
          </button>
        ))}
      </div>
      <div className="flex gap-2 w-full md:w-auto">
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Rechercher une commande (n°, produit...)"
          className="w-full md:w-80"
        />
        <Button type="button" onClick={() => setSearch("")}>Effacer</Button>
      </div>
    </div>
  );
}


