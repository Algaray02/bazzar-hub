"use client";
import AdminMessagesDisplay from "@/components/pages/admin/messages-display";
import { useMessages } from "@/hooks/use-messages";
import { AdminPageLayout } from "@/components/layout/admin-page-layout";

export default function AdminMessagesPage() {
  const { data, isLoading, error } = useMessages({ page: 1, limit: 50 });

  return (
    <AdminPageLayout
      title="Kotak Masuk"
      subtitle="Pesan dari organizer dan pengguna."
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading messages..."
      errorMessage={error?.message}
    >
      <AdminMessagesDisplay initialMessages={data?.data || []} />
    </AdminPageLayout>
  );
}