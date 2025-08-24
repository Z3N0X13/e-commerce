"use client";

import { toast } from "sonner";
import React, { useEffect, useState } from "react";

import { Product } from "@/types";
import Footer from "@/components/global/Footer";
import TopBar from "@/components/global/TopBar";
import { ProductCard } from "@/components/global/ProductCard";

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState<Product[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    const parsed = stored ? JSON.parse(stored) : [];
    setFavorites(parsed);
  }, []);

  const removeFromFavorites = (id: number) => {
    const updated = favorites.filter((product) => product.id !== id);
    localStorage.setItem("favorites", JSON.stringify(updated));
    setFavorites(updated);
    toast.success("Cet article a bien été retiré de vos favoris !");
    const audio = new Audio("/sounds/favorites-added.mp3");
    audio.play();
  };

  return (
    <>
      <TopBar />
      <div className="min-h-screen max-w-7xl mx-auto px-4 py-10">
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Résultats de recherche
            </h1>
            <p className="text-gray-400 text-lg">
              {favorites.length} article(s) enregistré(s)
            </p>
          </div>
        {favorites.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 ml-2">Aucun article dans vos favoris.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <ProductCard
                key={product.id}
                {...product}
                onRemove={() => removeFromFavorites(product.id)}
              />
            ))}
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default FavoritesPage;
