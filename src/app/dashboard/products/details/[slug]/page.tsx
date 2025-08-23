import React from "react";
import { notFound } from "next/navigation";

import { Product } from "@/types";
import ProductDetailsClient from "./product-details-client";

export default async function DetailsProductsPage({params }: { params: { slug: string } }) {
  const { slug } = await params;
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL ?? ''}/api/products`, {
    cache: "no-store",
  })

  if (!res.ok) {
    throw new Error("Erreur lors du chargement des produits");
  }

  const products: Product[] = await res.json();
  const product = products.find((product) => product.slug === slug);

  if (!product) return notFound();

  return (
    <ProductDetailsClient product={product} />
  );
}
