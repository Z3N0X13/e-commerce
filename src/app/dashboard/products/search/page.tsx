"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

import type { Product } from "@/types";
import { TopBar } from "@/components/TopBar";
import { Footer } from "@/components/Footer";
import { ProductCard } from "@/components/global/ProductCard";

export default function SearchPage() {
  const searchParams = useSearchParams();
  const query = searchParams.get("query");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await fetch(`/api/products${query ? `?query=${query}` : ''}`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Erreur lors du chargement des produits:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, [query]);

  return (
    <>
      <TopBar />
      <main className="flex flex-col items-center bg-gray-100 w-full min-h-screen">
        <div className="max-w-7xl w-full px-4 py-8">
          <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 rounded-xl p-8 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
              Résultats de recherche
            </h1>
            <p className="text-gray-400 text-lg">
              {query
                ? `${products.length} résultat(s) pour : "${query}"`
                : "Tous les produits"}
            </p>
          </div>

          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-500">Chargement...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.length > 0 ? (
                products.map((product) => (
                  <ProductCard
                    key={product.id}
                    {...product}
                  />
                ))
              ) : (
                <div className="col-span-3 text-center py-12">
                  <p className="text-gray-500 text-lg">
                    Aucun produit ne correspond à votre recherche.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}