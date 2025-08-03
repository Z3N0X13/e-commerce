"use client";

import React from "react";
import Image from "next/image";
import { Star } from "lucide-react";

import TopBar from "./TopBar";
import Footer from "./Footer";
import { Badge } from "./ui/badge";
import { Comment, Product } from "@/types";
import { AnimatedButton } from "./global/AnimatedButton";

type Props = {
  product: Product;
  comments?: Comment[];
};

const ProductDetailsClient = ({ product, comments = [] }: Props) => {

  return (
    <>
      <TopBar />
      <section className="min-h-screen max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          {product.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 bg-white shadow-lg rounded-2xl p-6 mt-16">
          <div className="flex-1 flex justify-center items-center">
            <Image
              src={product.imageUrl}
              alt={product.title}
              width={500}
              height={500}
              className="rounded-xl object-contain max-h-[400px]"
            />
          </div>

          <div className="flex-1 flex flex-col justify-center gap-4">
            <Badge
              className={`w-fit px-3 py-1 text-sm font-medium rounded-full ${
                product.inStock
                  ? "bg-green-100 text-green-800"
                  : "bg-red-100 text-red-800"
              }`}
            >
              {product.inStock ? "En stock" : "Hors stock"}
            </Badge>

            <p className="text-lg text-gray-600">{product.description}</p>

            <p className="text-3xl font-semibold text-green-600">
              {product.price.toLocaleString("fr-FR")} €
            </p>

            <AnimatedButton
              size={"lg"}
              disabled={!product.inStock}
              className={`mt-4 ${
                product.inStock ? "bg-green-600 hover:bg-green-700" : ""
              }`}
            >
              {product.inStock ? "Ajouter au panier" : "Produit indisponible"}
            </AnimatedButton>
          </div>
        </div>

        <div className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Commentaires</h2>
          {comments.length === 0 ? (
            <p className="text-gray-500">Aucun commentaire pour ce produit</p>
          ) : (
            comments.map((c, index) => (
              <CommentItem key={index} comment={c} />
            ))
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProductDetailsClient;


const CommentItem = ({ comment }: { comment: Comment }) => {
  return (
    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl shadow-sm not-last:mb-4">
      <div className="flex justify-between items-center mb-2">
        <p className="font-semibold text-sm">{comment.user}</p>
        <div className="flex items-center gap-1">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              size={16}
              fill={i < comment.rating ? "#facc15" : "none"}
              stroke="#facc15"
            />
          ))}
        </div>
      </div>
      <p className="text-sm text-gray-700">{comment.comment}</p>
    </div>
  );
};
