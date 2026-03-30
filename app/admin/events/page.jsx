"use client";

import AdminEventsDisplay from "@/components/pages/admin/events-display";
import { useEvents } from "@/hooks/use-events";
import { AdminPageLayout } from "@/components/layout/admin-page-layout";

export default function AdminEventsPage() {
  const { data, isLoading, error } = useEvents({ page: 1, limit: 50 });

  return (
    <AdminPageLayout
      title="Kelola Event"
      subtitle="Atur jadwal, layout booth, dan publikasi event."
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading events..."
      errorMessage={error?.message}
    >
      <AdminEventsDisplay initialEvents={data || []} />
    </AdminPageLayout>
  );
}