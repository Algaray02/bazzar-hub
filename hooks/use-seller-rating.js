import { useState, useEffect } from "react";

export const useSellerRating = (userId) => {
  const [rating, setRating] = useState(null);
  const [reviewCount, setReviewCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const fetchRating = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `/api/users/rating?userId=${userId}`
        );

        if (!response.ok) {
          throw new Error("Failed to fetch rating");
        }

        const data = await response.json();
        setRating(data.averageRating);
        setReviewCount(data.reviewCount);
        setError(null);
      } catch (err) {
        console.error("Error fetching seller rating:", err);
        setError(err.message);
        setRating(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRating();
  }, [userId]);

  return { rating, reviewCount, isLoading, error };
};
