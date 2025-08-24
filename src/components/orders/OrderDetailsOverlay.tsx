"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import { ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Order } from "@/types";
import StatusBadge from "./StatusBadge";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
};

export default function OrderDetailsOverlay({ isOpen, order, onClose }: Props) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && order && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-x-4 md:inset-x-16 inset-y-8 bg-white z-55 rounded-xl shadow-xl p-6 overflow-y-auto flex flex-col"
            initial={{ y: "-20%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-20%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant={"ghost"} onClick={onClose} className="mr-1">
                  <ArrowLeft size={20} />
                </Button>
                <h2 className="text-xl font-bold text-gray-900">Détails de la commande</h2>
              </div>
              <Button variant={"ghost"} onClick={onClose}>
                <X size={20} />
              </Button>
            </div>

            <div className="mt-4 flex items-center justify-between flex-wrap gap-3">
              <div className="text-sm text-gray-600">
                <div><span className="text-gray-500">N° commande :</span> <span className="font-medium text-gray-900">{order.id}</span></div>
                <div><span className="text-gray-500">Date :</span> {new Date(order.date).toLocaleString("fr-FR")}</div>
              </div>
              <StatusBadge status={order.status} />
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4">
              {order.items.map((it, idx) => (
                <div key={idx} className="flex items-center justify-between gap-4 border rounded-lg p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded border bg-gray-50 overflow-hidden">
                      <Image src={it.imageUrl} alt={it.title} width={64} height={64} className="w-full h-full object-contain" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">{it.title}</p>
                      <p className="text-sm text-gray-500">Quantité : {it.quantity}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Prix</p>
                    <p className="text-base font-semibold text-gray-900">{(it.price * it.quantity).toLocaleString("fr-FR")} €</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 border-t pt-4 flex items-center justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500">Total</p>
                <p className="text-xl font-bold text-gray-900">{order.total.toLocaleString("fr-FR")} €</p>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}


