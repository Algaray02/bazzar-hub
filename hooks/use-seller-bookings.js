import { useBookings } from "./use-bookings";
import { useSession } from "next-auth/react";

export function useSellerBookings() {
  const { data: session } = useSession();

  const {
    data: bookingsData,
    isLoading,
    error,
  } = useBookings(
    {
      userId: session?.user?.id,
    },
    {
      enabled: !!session?.user?.id,
    }
  );

  const bookings = bookingsData?.data || [];

  return { bookings, isLoading, error, data: bookings };
}