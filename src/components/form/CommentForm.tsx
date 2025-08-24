"use client";

import { toast } from "sonner";
import { Star } from "lucide-react";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

import { Button } from "../ui/button";
import { Textarea } from "../ui/textarea";

interface CommentFormProps {
  productId: number;
  onCommentAdded: () => void;
}

const CommentForm = ({ productId, onCommentAdded }: CommentFormProps) => {
  const { data: session } = useSession();
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!session) {
      toast.error("Vous devez être connecté pour ajouter un commentaire");
      return;
    }

    if (rating === 0) {
      toast.error("Veuillez sélectionner une note");
      return;
    }

    if (!comment.trim()) {
      toast.error("Veuillez écrire un commentaire");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          productId,
          rating,
          comment: comment.trim(),
        }),
      });

      if (response.ok) {
        setRating(0);
        setComment("");
        onCommentAdded();
      } else {
        const error = await response.json();
        alert(error.error || "Erreur lors de l'ajout du commentaire");
      }
    } catch (error) {
      console.error(error);
      alert("Erreur lors de l'ajout du commentaire");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) {
    return (
      <div className="bg-gray-50 dark:bg-neutral-900 border border-gray-200 dark:border-0 p-4 rounded-xl">
        <p className="text-gray-600 dark:text-gray-400 text-center">
          Connectez-vous pour ajouter un commentaire
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-0 p-6 rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Ajouter un commentaire</h3>
      
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Note
        </label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => setRating(star)}
              className="focus:outline-none"
            >
              <Star
                size={24}
                fill={star <= rating ? "#facc15" : "none"}
                stroke="#facc15"
                className="cursor-pointer hover:scale-110 transition-transform"
              />
            </button>
          ))}
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {rating > 0 ? `${rating}/5 étoiles` : "Sélectionnez une note"}
        </p>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Votre commentaire
        </label>
        <Textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Partagez votre expérience avec ce produit..."
          rows={4}
          className="resize-none"
          maxLength={500}
        />
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {comment.length}/500 caractères
        </p>
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || rating === 0 || !comment.trim()}
        className="w-full"
      >
        {isSubmitting ? "Envoi en cours..." : "Publier le commentaire"}
      </Button>
    </form>
  );
};

export default CommentForm;
