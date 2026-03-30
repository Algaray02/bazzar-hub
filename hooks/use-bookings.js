import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { verifyBookingAction } from "@/app/actions/booking-actions";
import { toast } from "sonner";
import { BOOKING_KEYS } from "@/lib/utils/query-keys";

export const useBookings = (params = {}, options = {}) => {
  return useQuery({
    queryKey: BOOKING_KEYS.lists(params),
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      if (params.userId) searchParams.set("userId", params.userId);
      if (params.status) searchParams.set("status", params.status);
      if (params.eventId) searchParams.set("eventId", params.eventId);
      if (params.page) searchParams.set("page", params.page);
      if (params.limit) searchParams.set("limit", params.limit);

      const response = await fetch(`/api/bookings?${searchParams.toString()}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data bookings");
      }
      const result = await response.json();
      return result;
    },
    ...options,
  });
};

export const useBooking = (id, options = {}) => {
  return useQuery({
    queryKey: [BOOKING_KEYS.all[0], id],
    queryFn: async () => {
      const response = await fetch(`/api/bookings/${id}`);
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Gagal mengambil data booking");
      }
      return await response.json();
    },
    enabled: !!id,
    ...options,
  });
};

export const useVerifyBooking = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ bookingId, status }) => {
      const result = await verifyBookingAction(bookingId, status);
      if (!result.success) throw new Error(result.error);
      return result;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: BOOKING_KEYS.all });
      toast.success(
        variables.status === "PAID"
          ? "Booking berhasil diverifikasi"
          : "Booking ditolak"
      );
    },
    onError: (error) => {
      toast.error(error.message || "Gagal memverifikasi booking");
    },
  });
};
