"use client";

import Image from "next/image";
import React from "react";

import StatusBadge from "./StatusBadge";
import type { Order } from "@/types";

export default function OrderCard({ order, onDetails, onInvoice }: { order: Order; onDetails?: (order: Order) => void; onInvoice?: (order: Order) => void; }) {
  const first = order.items[0];
  const otherCount = Math.max(0, order.items.length - 1);

  return (
    <article className="bg-white dark:bg-neutral-900 rounded-xl shadow-sm border border-gray-200 dark:border-gray-500 overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center gap-4 p-5">
        <div className="flex items-center gap-4 flex-1">
          <div className="w-16 h-16 rounded-lg overflow-hidden border bg-gray-50 dark:bg-neutral-700">
            <Image
              src={first.imageUrl}
              alt={first.title}
              width={64}
              height={64}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-3 flex-wrap">
              <h3 className="font-semibold text-gray-900 dark:text-white truncate">{first.title}{otherCount > 0 ? ` + ${otherCount} autre(s)` : ""}</h3>
              <StatusBadge status={order.status} />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              N° {order.id} · {new Date(order.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between md:justify-end gap-4 w-full md:w-auto">
          <div className="text-right">
            <p className="text-xs text-gray-500 dark:text-gray-400">Total</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">{order.total.toLocaleString("fr-FR")} €</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => onDetails?.(order)}>Détails</button>
            <button className="px-3 py-2 text-sm rounded-lg border hover:bg-gray-50 dark:hover:bg-neutral-800" onClick={() => onInvoice?.(order)}>Facture</button>
          </div>
        </div>
      </div>
      <div className="px-5 pb-5 pt-0">
        <div className="flex gap-6 text-sm text-gray-600 dark:text-gray-500">
          <div>
            <span className="text-gray-500 dark:text-gray-400">Articles:</span> {order.items.reduce((a, i) => a + i.quantity, 0)}
          </div>
          <div>
            <span className="text-gray-500 dark:text-gray-400">Statut:</span> <span className="capitalize">{order.status}</span>
          </div>
        </div>
      </div>
    </article>
  );
}


