"use client";

import clsx from "clsx";
import React from "react";

import type { OrderStatus } from "@/types";

export default function StatusBadge({ status }: { status: OrderStatus }) {
  const color = {
    pending: "bg-amber-100 text-amber-800 border-amber-200",
    processing: "bg-blue-100 text-blue-800 border-blue-200",
    shipped: "bg-indigo-100 text-indigo-800 border-indigo-200",
    delivered: "bg-emerald-100 text-emerald-800 border-emerald-200",
    cancelled: "bg-rose-100 text-rose-800 border-rose-200",
  }[status];

  const label = {
    pending: "En attente",
    processing: "En préparation",
    shipped: "Expédiée",
    delivered: "Livrée",
    cancelled: "Annulée",
  }[status];

  return (
    <span
      className={clsx(
        "inline-flex items-center gap-2 px-2.5 py-1 rounded-full text-xs font-semibold border",
        color
      )}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  );
}


