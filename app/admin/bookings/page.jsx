"use client";

import AdminBookingsDisplay from "@/components/pages/admin/bookings-display";
import { useBookings } from "@/hooks/use-bookings";
import { AdminPageLayout } from "@/components/layout/admin-page-layout";

export default function AdminBookingsPage() {
  const { data, isLoading, error } = useBookings({ page: 1, limit: 50 });

  return (
    <AdminPageLayout
      title="Booking Management"
      subtitle="Manage event booth bookings and reservations."
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading bookings..."
      errorMessage={error?.message}
    >
      <AdminBookingsDisplay initialBookings={data?.data || []} />
    </AdminPageLayout>
  );
}