"use client";

import { ArrowLeft, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "./ui/button";
import { useCartUI } from "@/app/context/cart-ui";
import CheckoutForm from "./CheckoutForm";
import { useEffect } from "react";

export const CheckoutOverlay = () => {
  const { isCheckoutOpen, closeCheckout, open } = useCartUI();

  useEffect(() => {
      if (isCheckoutOpen) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "";
      }
  
      return () => {
        document.body.style.overflow = "";
      };
    }, [isCheckoutOpen]);

  return (
    <AnimatePresence>
      {isCheckoutOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={closeCheckout}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.div
            className="fixed inset-x-16 inset-y-8 bg-white z-55 rounded-xl shadow-xl p-6 overflow-y-auto flex flex-col"
            initial={{ y: "-20%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-20%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between">
              <div className="flex">
                <Button variant={"ghost"} onClick={() => {
                  closeCheckout();
                  open();
                }} className="mr-2">
                  <ArrowLeft size={20} />
                </Button>
                <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">
                  Finalisation de la commande
                </h2>
              </div>
              <Button variant={"ghost"} onClick={closeCheckout}>
                <X size={20} />
              </Button>
            </div>

            {/* WIP : Faire le formulaire de paiement */}
            <CheckoutForm />

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
