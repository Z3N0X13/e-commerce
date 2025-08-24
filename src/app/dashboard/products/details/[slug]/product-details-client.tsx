"use client";

import Image from "next/image";
import { Star, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useState, useEffect } from "react";

import { Comment, Product } from "@/types";
import { Badge } from "@/components/ui/badge";
import TopBar from "@/components/global/TopBar";
import Footer from "@/components/global/Footer";
import { Button } from "@/components/ui/button";
import { useCartUI } from "@/app/context/cart-ui";
import CommentForm from "@/components/form/CommentForm";
import { AnimatedButton } from "@/components/global/AnimatedButton";

type Props = {
  product: Product;
};

const ProductDetailsClient = ({ product }: Props) => {
  const { addToCart } = useCartUI();
  const { data: session } = useSession();
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchComments = async () => {
    try {
      const response = await fetch(`/api/comments?productId=${product.id}`);
      if (response.ok) {
        const data = await response.json();
        setComments(data);
      }
    } catch (error) {
      console.error("Erreur lors du chargement des commentaires:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [product.id]);

  const handleCommentAdded = () => {
    fetchComments();
  };

  const handleCommentDeleted = () => {
    fetchComments();
  };

  return (
    <>
      <TopBar />
      <section className="min-h-screen max-w-6xl mx-auto px-4 py-10">
        <h1 className="text-3xl md:text-4xl font-bold text-center mb-10">
          {product.title}
        </h1>

        <div className="flex flex-col lg:flex-row gap-10 bg-white dark:bg-neutral-900 shadow-lg rounded-2xl p-6 mt-16">
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
                  ? "bg-green-100 dark:bg-green-500 text-green-800 dark:text-white"
                  : "bg-red-100 dark:bg-red-500 text-red-800 dark:text-white"
              }`}
            >
              {product.inStock ? "En stock" : "Hors stock"}
            </Badge>

            <p className="text-lg text-gray-600 dark:text-gray-400">{product.description}</p>

            <p className="text-3xl font-semibold text-green-600">
              {product.price.toLocaleString("fr-FR")} €
            </p>

            <AnimatedButton
              size={"lg"}
              disabled={!product.inStock}
              onClick={() => addToCart(product)}
              className={`mt-4 ${
                product.inStock ? "bg-green-600 hover:bg-green-700 dark:text-white" : ""
              }`}
            >
              {product.inStock ? "Ajouter au panier" : "Produit indisponible"}
            </AnimatedButton>
          </div>
        </div>

        <div className="mt-12 space-y-8">
          <h2 className="text-2xl font-semibold mb-6">Commentaires</h2>

          <CommentForm
            productId={product.id}
            onCommentAdded={handleCommentAdded}
          />

          <div className="space-y-4">
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">
                  Chargement des commentaires...
                </p>
              </div>
            ) : comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500 dark:text-gray-300">
                  Aucun commentaire pour ce produit
                </p>
                <p className="text-sm text-gray-400 dark:text-gray-200 mt-1">
                  Soyez le premier à donner votre avis !
                </p>
              </div>
            ) : (
              comments.map((comment, index) => (
                <CommentItem
                  key={comment.id || index}
                  comment={comment}
                  currentUser={
                    session?.user?.name || session?.user?.email || undefined
                  }
                  onCommentDeleted={handleCommentDeleted}
                />
              ))
            )}
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
};

export default ProductDetailsClient;

const CommentItem = ({
  comment,
  currentUser,
  onCommentDeleted,
}: {
  comment: Comment;
  currentUser?: string;
  onCommentDeleted: () => void;
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const isAuthor = currentUser === comment.user;

  const handleDelete = async () => {
    if (!comment.id || !isAuthor) return;

    if (!confirm("Êtes-vous sûr de vouloir supprimer ce commentaire ?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/comments/${comment.id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        onCommentDeleted();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de la suppression");
      }
    } catch (error) {
      alert("Erreur lors de la suppression du commentaire");
      console.error("Server error: " + (error as Error).message)
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-neutral-800 border border-gray-200 dark:border-0 p-4 rounded-xl shadow-sm relative">
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
      <p className="text-sm text-gray-700 dark:text-gray-300">{comment.comment}</p>
      <div className="flex justify-between items-center mt-2">
        {comment.createdAt && (
          <p className="text-xs text-gray-500 dark:text-gray-400">
            {new Date(comment.createdAt).toLocaleDateString("fr-FR")}
          </p>
        )}
        {isAuthor && (
          <Button
            variant={"ghost"}
            onClick={handleDelete}
            disabled={isDeleting}
            className="text-red-500 transition-colors p-1 rounded ml-auto hover:bg-red-100 hover:text-red-500 cursor-pointer"
            title="Supprimer ce commentaire"
          >
            <Trash2 size={14} />
          </Button>
        )}
      </div>
    </div>
  );
};
