"use client";

import React from "react";
import Image from "next/image";

import { useCartUI } from "@/app/context/cart-ui";

export const Footer = () => {
  const { open } = useCartUI();
  return (
    <footer className="w-full bg-black text-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
        <div className="mb-4 md:mb-0 flex items-center gap-2">
          <Image
            src="/assets/logo-EP_Informatik.png"
            alt="Logo"
            width={32}
            height={32}
          />
          <span className="font-semibold text-lg">EP Informatik</span>
        </div>
        <div className="text-sm text-gray-400">
          © {new Date().getFullYear()} EP Informatik. Tous droits réservés.
        </div>
        <div className="flex gap-4 mt-4 md:mt-0">
          <a
            href="/dashboard"
            className="hover:text-green-400 transition-colors cursor-pointer"
          >
            Accueil
          </a>
          <a
            onClick={open}
            className="hover:text-green-400 transition-colors cursor-pointer"
          >
            Panier
          </a>
          <a
            href="mailto:contact@ep-informatik.com"
            className="hover:text-green-400 transition-colors cursor-pointer"
          >
            Contact
          </a>
          <a
            href="/legal-notices"
            className="hover:text-green-400 transition-colors cursor-pointer"
          >
            Mentions légales
          </a>
          <a
            href="/privacy-policy"
            className="hover:text-green-400 transition-colors cursor-pointer"
          >
            Politique de confidentialité
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
