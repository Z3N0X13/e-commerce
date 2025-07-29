"use client";

import { FC, useEffect, useState } from "react";
import Image from "next/image";

import { Product, ProductCardProps } from "@/types";
import { AnimatedButton } from "@/components/global/AnimatedButton";
import { toast } from "sonner";
import { Heart, X } from "lucide-react";

export const ProductCard: FC<ProductCardProps> = ({
  id,
  title,
  description,
  price,
  imageUrl,
  inStock = true,
  onRemove,
}) => {
  const [isInFavorites, setIsInFavorites] = useState(false);

  useEffect(() => {
    if (!onRemove) {
      const existing = localStorage.getItem("favorites");
      const favorites = existing ? JSON.parse(existing) : [];
      const found = favorites.some((p: Product) => p.id === id);
      setIsInFavorites(found);
    }
  }, [id, onRemove]);

  const handleAddToFavorites = () => {
    const existing = localStorage.getItem("favorites");
    const favorites = existing ? JSON.parse(existing) : [];

    const isAlreadyInFavorites = favorites.some((p: Product) => p.id === id);
    if (!isAlreadyInFavorites) {
      favorites.push({ id, title, description, price, imageUrl, inStock });
      localStorage.setItem("favorites", JSON.stringify(favorites));
      setIsInFavorites(true);

      toast.success("Cet article a bien été ajouté à vos favoris !");
      const audio = new Audio("/sounds/favorites-added.mp3");
      audio.play();
    }
  };

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 relative group">
      <div
        className={`absolute top-4 right-4 px-2.5 py-1.25 rounded-full z-10 font-semibold text-xs shadow-md
    ${inStock ? "bg-green-500 text-white" : "bg-red-500 text-white"}`}
      >
        {inStock ? "En Stock" : "Hors Stock"}
      </div>

      {!onRemove && !isInFavorites && (
        <button
          onClick={handleAddToFavorites}
          className="absolute top-4 left-4 z-10 bg-gray-100 hover:bg-red-100 text-gray-500 hover:text-red-500 rounded-full p-2 transition-colors shadow-sm"
          aria-label="Ajouter aux favoris"
        >
          <Heart className="w-5 h-5" />
        </button>
      )}

      {onRemove && (
        <button
          onClick={onRemove}
          className="absolute top-4 left-4 z-10 bg-red-100 text-red-600 hover:bg-red-200 rounded-full p-2 transition-colors shadow-sm cursor-pointer"
          aria-label="Retirer des favoris"
        >
          <X className="w-5 h-5" />
        </button>
      )}

      <div className="relative h-48 mb-4 bg-gradient-to-b from-neutral-100 to-neutral-200 rounded-lg overflow-hidden">
        <Image
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          width={500}
          height={500}
          priority
        />
      </div>
      <div className="space-y-3">
        <h3 className="font-bold text-xl">{title}</h3>
        <p className="text-gray-600">{description}</p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-2xl font-bold text-green-600">
            {price.toLocaleString("fr-FR")} €
          </span>
          <AnimatedButton>Voir le produit</AnimatedButton>
        </div>
      </div>
    </div>
  );
};
