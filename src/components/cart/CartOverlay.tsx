"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

import { Button } from "../ui/button";
import { useCartUI } from "@/app/context/cart-ui";

export const CartOverlay = () => {
  const {
    isOpen,
    close,
    cart,
    removeFromCart,
    updateQuantity,
    setHasNewItem,
    setNewItemCount,
    openCheckout,
  } = useCartUI();
  const router = useRouter();

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

  useEffect(() => {
    if (isOpen) {
      setHasNewItem(false);
      setNewItemCount(0);
    }
  }, [isOpen, setHasNewItem, setNewItemCount]);

  const totalPrice = cart.reduce((sum, item) => {
    return sum + item.price * item.quantity;
  }, 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/50 z-50"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            className="fixed inset-x-16 inset-y-8 bg-white dark:bg-gray-900 z-55 rounded-xl shadow-xl p-6 overflow-y-auto flex flex-col"
            initial={{ y: "-20%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "-20%", opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 border-b border-gray-200 dark:border-gray-700 pb-2">
                Votre panier
              </h2>
              <Button variant={"ghost"} onClick={close}>
                <X size={20} />
              </Button>
            </div>

            {cart.length === 0 ? (
              <div className="flex flex-col items-center justify-center mt-20 text-center">
                <ShoppingCart className="h-14 w-14 mb-4 text-gray-600 dark:text-gray-400" />
                <p className="text-xl font-bold text-gray-800 dark:text-white">
                  Votre panier est vide
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  Ajoutez des articles pour commencer vos achats.
                </p>
                <Button
                  onClick={() => {
                    close();
                    router.push("/dashboard/products/search");
                  }}
                  className="mt-6 px-6 py-2 text-white font-semibold bg-black hover:bg-gray-800"
                >
                  Retourner à la boutique
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 flex-1">
                {cart.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between gap-4 border-b border-gray-200 dark:border-gray-700 pb-2"
                  >
                    <div className="flex flex-col">
                      <span className="font-semibold">{item.title}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        Quantité :
                        <input
                          type="number"
                          min={1}
                          value={item.quantity}
                          onChange={(e) =>
                            updateQuantity(item.id, parseInt(e.target.value))
                          }
                          className="ml-2 w-16 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </span>
                    </div>
                    <div className="flex flex-row items-center">
                      <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mr-8">
                        Total :{" "}
                        {(item.price * item.quantity).toLocaleString("fr-FR")} €
                      </p>
                      <Button
                        variant={"destructive"}
                        size={"sm"}
                        onClick={() => removeFromCart(item.id)}
                      >
                        Supprimer
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {cart.length > 0 && (
              <>
                <div className="w-full px-4 py-4 border-t border-gray-200 dark:border-gray-700 flex justify-between items-center">
                  <div className="flex flex-col items-start bg-gray-50 dark:bg-gray-800 rounded-md border border-gray-200 dark:border-gray-700 px-4 py-3">
                    <span className="text-base font-semibold text-gray-800 dark:text-white">
                      Total :
                    </span>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 max-w-xs">
                      * TVA incluse. Livraison calculée à l&apos;étape suivante.
                    </p>
                  </div>

                  <span className="text-xl font-bold text-gray-900 dark:text-white">
                    {totalPrice.toLocaleString("fr-FR")} €
                  </span>
                </div>
                <div className="mt-4 flex justify-center">
                  <Button
                  type="button"
                    onClick={() => {
                      close();
                      openCheckout();
                    }}
                    className="mx-auto w-full sm:w-2/3 md:w-1/2 h-12 mt-4 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:ring-2 focus-visible:ring-purple-500"
                  >
                    Valider la commande
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
