"use client";

import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import React, { useEffect, useRef } from "react";
import { ArrowLeft, X, Download } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import type { Order } from "@/types";
import { Button } from "@/components/ui/button";

type Props = {
  isOpen: boolean;
  order: Order | null;
  onClose: () => void;
};

export default function InvoiceOverlay({ isOpen, order, onClose }: Props) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleDownload = async () => {
    if (!contentRef.current) return;

    const canvas = await html2canvas(contentRef.current, {
      useCORS: true,
      onclone: (doc) => {
        doc.querySelectorAll<HTMLElement>("*").forEach((el) => {
          const style = window.getComputedStyle(el);

          if (style.color.includes("oklch")) {
            el.style.color = "#101828";
          }
          if (style.backgroundColor.includes("oklch")) {
            el.style.backgroundColor = "#ffffff";
          }
          if (style.borderColor.includes("oklch")) {
            el.style.borderColor = "#6a7282";
          }
        });
      },
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`facture-${order ? order.id : ""}.pdf`);
  };

  return (
    <AnimatePresence>
      {isOpen && order && (
        <>
          <motion.div
            className="fixed inset-0 bg-[#000000]/50 z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-x-4 md:inset-x-16 inset-y-8 bg-[#ffffff] z-55 rounded-xl shadow-xl p-6 overflow-y-auto flex flex-col"
            initial={{ y: "-20%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-20%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={onClose} className="mr-1">
                  <ArrowLeft size={20} />
                </Button>
                <h2 className="text-xl font-bold text-[#101828]">Facture</h2>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  onClick={handleDownload}
                  className="gap-2"
                >
                  <Download size={16} /> Télécharger (PDF)
                </Button>
                <Button variant="ghost" onClick={onClose}>
                  <X size={20} />
                </Button>
              </div>
            </div>

            <div className="mt-6 bg-[#ffffff]" ref={contentRef}>
              <div className="flex items-start justify-between flex-wrap gap-4 border rounded-lg p-4">
                <div>
                  <p className="text-xs uppercase tracking-wide text-[#6a7282]">
                    Facture
                  </p>
                  <p className="text-lg font-semibold text-[#101828]">
                    {order.id}
                  </p>
                  <p className="text-sm text-[#6a7282]">
                    Date: {new Date(order.date).toLocaleDateString("fr-FR")}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-wide text-[#6a7282]">
                    Total
                  </p>
                  <p className="text-2xl font-bold text-[#101828]">
                    {order.total.toLocaleString("fr-FR")} €
                  </p>
                </div>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-[#6a7282]">
                      <th className="py-2">Article</th>
                      <th className="py-2">Qté</th>
                      <th className="py-2">Prix</th>
                      <th className="py-2 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((it, idx) => (
                      <tr key={idx} className="border-t">
                        <td className="py-3 pr-4 text-[#101828]">{it.title}</td>
                        <td className="py-3 pr-4">{it.quantity}</td>
                        <td className="py-3 pr-4">
                          {it.price.toLocaleString("fr-FR")} €
                        </td>
                        <td className="py-3 text-right font-medium">
                          {(it.price * it.quantity).toLocaleString("fr-FR")} €
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
