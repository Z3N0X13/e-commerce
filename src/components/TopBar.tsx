import clsx from "clsx";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Home, LucideMenu, LucideSearch, ShoppingCart, X } from "lucide-react";

import { cn } from "@/lib/utils";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { SidebarMenu } from "./SidebarMenu";
import { useRouter } from "next/navigation";
import { useCartUI } from "@/app/context/cart-ui";
import { CartOverlay } from "./CartOverlay";
import { CheckoutOverlay } from "./CheckoutOverlay";

export const TopBar = () => {
  const { hasNewItem, newItemCount } = useCartUI();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchquery, setSearchquery] = useState("");

  const router = useRouter();

  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchquery.trim()) {
      router.push(
        `/dashboard/products/search?query=${encodeURIComponent(
          searchquery.trim()
        )}`
      );
      setShowSearch(false);
      setSearchquery("");
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
  }, [menuOpen]);

  return (
    <>
      <header
        className={clsx(
          "w-full bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50 transition-all duration-300 overflow-x-hidden",
          {
            "backdrop-blur-md bg-white/50 border-gray-200": scrolled,
            "bg-white": !scrolled,
          }
        )}
      >
        <div>
          <Image
            src="/assets/logo-EP_Informatik.png"
            alt="Logo"
            width={32}
            height={32}
          />
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={"ghost"}
            className="flex items-center gap-2 cursor-pointer font-medium"
            onClick={() => (window.location.href = "/dashboard")}
          >
            <Home size={20} /> Menu
          </Button>
          <Button
            variant="ghost"
            onClick={() => setShowSearch((v) => !v)}
            aria-label="Toggle Search"
            className="cursor-pointer"
          >
            <LucideSearch size={20} />
          </Button>

          <Input
            type="text"
            placeholder="Rechercher..."
            value={searchquery}
            onChange={(e) => setSearchquery(e.target.value)}
            onKeyDown={handleSearch}
            className={cn(
              "transition-all duration-300 ease-in-out transform",
              showSearch
                ? "opacity-100 w-60 ml-2"
                : "opacity-0 w-0 overflow-hidden"
            )}
            autoFocus
            onBlur={() => setShowSearch(false)}
          />
          <div
            className={clsx("h-8 w-[2px] -ml-8 bg-gray-300 rounded-full", {
              "ml-4": showSearch,
              "-ml-8": !showSearch,
            })}
            style={{ minWidth: 2 }}
          />
          <div className="relative">
            <CartButton />
            {hasNewItem && newItemCount > 0 && (
              <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white text-xs font-bold">
                {newItemCount}
              </span>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          className="cursor-pointer"
          onClick={() => setMenuOpen(true)}
        >
          <LucideMenu size={20} />
        </Button>
      </header>
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/30 z-40"
              onClick={() => setMenuOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />

            <motion.aside
              className="fixed top-0 right-0 h-full w-64 bg-white z-50 shadow-lg px-4 py-4 flex flex-col"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              <div className="flex items-center justify-between mb-6">
                <span className="text-lg font-semibold">Menu</span>
                <Button variant="ghost" onClick={() => setMenuOpen(false)}>
                  <X size={20} />
                </Button>
              </div>

              <SidebarMenu onLinkClick={() => setMenuOpen(false)} />
            </motion.aside>
          </>
        )}
      </AnimatePresence>
      <CartOverlay />
      <CheckoutOverlay />
    </>
  );
};

export default TopBar;

export const CartButton = () => {
  const { open } = useCartUI();

  return (
    <Button
      onClick={open}
      variant="ghost"
      aria-label="Open Cart"
      className="cursor-pointer"
    >
      <ShoppingCart size={20} /> Panier
    </Button>
  );
};
