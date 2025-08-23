"use client";

import React, { useEffect, useMemo, useState } from "react";

import TopBar from "@/components/global/TopBar";
import Footer from "@/components/global/Footer";
import type { Order as OrderModel } from "@/types";
import OrderCard from "@/components/orders/OrderCard";
import FiltersBar from "@/components/orders/FiltersBar";
import EmptyState from "@/components/orders/EmptyState";
import InvoiceOverlay from "@/components/orders/InvoiceOverlay";
import OrderDetailsOverlay from "@/components/orders/OrderDetailsOverlay";

const OrdersPage = () => {
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [openDetails, setOpenDetails] = useState(false);
  const [openInvoice, setOpenInvoice] = useState(false);
  const [autoProgress, setAutoProgress] = useState(true);
  const [orders, setOrders] = useState<OrderModel[]>([]);
  const [selected, setSelected] = useState<OrderModel | null>(null);

  useEffect(() => {
    const loadOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (!res.ok) throw new Error("Erreur lors du chargement des commandes");
        const data = await res.json();
        setOrders(data.orders ?? []);
      } catch (e) {
        setOrders([]);
        console.error(e);
      }
      setLoading(false);
    };
    loadOrders();
  }, []);

  useEffect(() => {
    if (!autoProgress) return;

    const intervals: NodeJS.Timeout[] = [];

    orders.forEach((order) => {
      const statusOrder: OrderModel["status"][] = [
        "pending",
        "processing",
        "shipped",
        "delivered",
      ];
      const currentIndex = statusOrder.indexOf(order.status);

      if (currentIndex >= 0) {
        const randomDelay = Math.random() * (60000 - 15000) + 15000;

        const timeout = setTimeout(async () => {
          let nextStatus: OrderModel["status"];

          if (order.status === "delivered") {
            nextStatus = "pending";
          } else {
            nextStatus = statusOrder[currentIndex + 1];
          }

          try {
            if (order.dbId) {
              const res = await fetch(`/api/orders/${order.dbId}/status`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: nextStatus }),
              });

              if (res.ok) {
                setOrders((prev) =>
                  prev.map((o) =>
                    o.id === order.id ? { ...o, status: nextStatus } : o
                  )
                );
              }
            }
          } catch (error) {
            console.error("Failed to update order status:", error);
          }
        }, randomDelay);

        intervals.push(timeout);
      }
    });

    return () => {
      intervals.forEach(clearTimeout);
    };
  }, [orders, autoProgress]);

  const filtered = useMemo(() => {
    return orders
      .filter((o) => (status ? o.status === status : true))
      .filter((o) => {
        if (!search.trim()) return true;
        const needle = search.toLowerCase();
        return (
          o.id.toLowerCase().includes(needle) ||
          o.items.some((it) => it.title.toLowerCase().includes(needle))
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [orders, status, search]);

  const totalSpent = useMemo(
    () => orders.reduce((acc, o) => acc + o.total, 0),
    [orders]
  );

  return (
    <>
      <TopBar />
      <main className="bg-gray-100 dark:bg-black/30 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <header className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">
              Mes commandes
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {orders.length} commandes · Total dépensé :
              <span className="font-semibold text-gray-900">
                {" "}
                {totalSpent.toLocaleString("fr-FR")} €
              </span>
            </p>
            <div className="flex items-center gap-2 mt-2">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={autoProgress}
                  onChange={(e) => setAutoProgress(e.target.checked)}
                  className="rounded"
                />
                Auto-progression des statuts (15-60s aléatoire)
              </label>
            </div>
          </header>

          <section className="bg-white dark:bg-neutral-900 border rounded-xl p-4 md:p-5 shadow-sm mb-6">
            <FiltersBar
              status={status}
              setStatus={setStatus}
              search={search}
              setSearch={setSearch}
            />
          </section>

          {loading ? (
            <div className="bg-white dark:bg-neutral-800 border rounded-xl p-8 text-center text-gray-500 dark:text-gray-400">
              Chargement des commandes…
            </div>
          ) : filtered.length === 0 ? (
            <EmptyState />
          ) : (
            <section className="grid grid-cols-1 gap-4">
              {filtered.map((order) => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onDetails={(o) => {
                    setSelected(o);
                    setOpenDetails(true);
                  }}
                  onInvoice={(o) => {
                    setSelected(o);
                    setOpenInvoice(true);
                  }}
                />
              ))}
            </section>
          )}
        </div>
      </main>

      <OrderDetailsOverlay
        isOpen={openDetails}
        order={selected}
        onClose={() => setOpenDetails(false)}
      />
      <InvoiceOverlay
        isOpen={openInvoice}
        order={selected}
        onClose={() => setOpenInvoice(false)}
      />
      <Footer />
    </>
  );
};

export default OrdersPage;
