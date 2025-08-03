import React from "react";

import { Product } from "@/types";
import ProductDetailsClient from "@/components/ProductDetailsClient";
import { notFound } from "next/navigation";

export default async function DetailsProductsPage({params }: { params: { slug: string } }) {
  const res = await fetch("http://localhost:3000/api/products", {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }

  const products: Product[] = await res.json();
  const product = products.find((product) => product.slug === params.slug);

  if (!product) return notFound();

  const sampleComments = [
  { user: "Alice", rating: 5, comment: "Excellente carte graphique !" },
  { user: "Bob", rating: 4, comment: "Très bonne mais un peu chère." },
  { user: "Claire", rating: 3, comment: "Correcte, mais chauffe beaucoup." },
];

  return (
    <ProductDetailsClient product={product} comments={sampleComments} />
  );
}
