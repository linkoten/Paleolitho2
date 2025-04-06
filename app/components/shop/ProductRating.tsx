"use client";

import React, { useEffect, useState } from "react";
import { Star } from "lucide-react";
import { rateProduct } from "@/lib/actionsProducts";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface RatingProps {
  userId: string;
  productId: string;
  ratings: {
    ratings: Array<{
      userId: string;
      rating: number;
    }>;
  };
}

const RATING_LABELS = ["Terrible", "Mauvais", "Moyen", "Bien", "Excellent"];

const ProductRating = ({ userId, productId, ratings }: RatingProps) => {
  const [userRating, setUserRating] = useState<number | null>(null);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Calculate statistics
  const totalRatings = ratings.ratings.length;
  const sumRatings = ratings.ratings.reduce(
    (sum, rating) => sum + rating.rating,
    0
  );
  const averageRating = totalRatings > 0 ? sumRatings / totalRatings : 0;

  useEffect(() => {
    // Check if user has already rated this product
    const existingRating = ratings.ratings.find(
      (rating) => rating.userId === userId
    );

    if (existingRating) {
      setUserRating(existingRating.rating);
    } else {
      setUserRating(null);
    }
  }, [ratings, userId]);

  const handleRating = async (newRating: number) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setUserRating(newRating);

    const formData = new FormData();
    formData.append("userId", userId);
    formData.append("productId", productId);
    formData.append("rating", newRating.toString());

    try {
      await rateProduct(formData);
    } catch (error) {
      console.error("Error submitting rating:", error);
      // Optionally revert to previous rating on error
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-2">
      <form action={rateProduct} className="hidden">
        <Input type="hidden" name="userId" value={userId} />
        <Input type="hidden" name="productId" value={productId} />
        <Input
          type="hidden"
          name="rating"
          value={userRating?.toString() || "0"}
        />
      </form>

      <div className="flex items-center gap-1">
        <TooltipProvider>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled =
                hoveredStar !== null
                  ? hoveredStar >= star
                  : userRating !== null
                    ? userRating >= star
                    : averageRating >= star;

              return (
                <Tooltip key={star}>
                  <TooltipTrigger asChild>
                    <button
                      type="button"
                      className="focus:outline-none"
                      onClick={() => handleRating(star)}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(null)}
                      disabled={isSubmitting}
                    >
                      <Star
                        className={`h-5 w-5 transition-colors ${
                          isFilled
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        } hover:text-yellow-400`}
                      />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent side="bottom">
                    {RATING_LABELS[star - 1]}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </TooltipProvider>

        <div className="flex items-center ml-2">
          <span className="font-medium text-sm">
            {averageRating.toFixed(1)}
          </span>
          <span className="text-xs text-muted-foreground ml-2">
            ({totalRatings} {totalRatings === 1 ? "avis" : "avis"})
          </span>
        </div>
      </div>

      {userRating && (
        <p className="text-xs text-muted-foreground">
          Vous avez noté ce produit {userRating}/5
        </p>
      )}
    </div>
  );
};

export default ProductRating;
