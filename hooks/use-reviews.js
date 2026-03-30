import { useQuery } from "@tanstack/react-query";

export const REVIEW_KEYS = {
  all: ["reviews"],
  byBooking: (bookingId) => ["reviews", "booking", bookingId],
};

export const useReviews = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [...REVIEW_KEYS.all, params],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.bookingId) searchParams.set("bookingId", params.bookingId);
      if (params.page) searchParams.set("page", params.page);
      if (params.limit) searchParams.set("limit", params.limit);

      const response = await fetch(`/api/reviews?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data reviews");
      }
      return await response.json();
    },
    ...options,
  });
};

export const useReviewsByBooking = (bookingId, options = {}) => {
  return useQuery({
    queryKey: REVIEW_KEYS.byBooking(bookingId),
    queryFn: async () => {
      const response = await fetch(`/api/reviews?bookingId=${bookingId}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data reviews");
      }
      return await response.json();
    },
    enabled: !!bookingId,
    ...options,
  });
};