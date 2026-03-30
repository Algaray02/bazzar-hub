"use client";

import AdminUsersDisplay from "@/components/pages/admin/users-display";
import { useUsers } from "@/hooks/use-users";
import { AdminPageLayout } from "@/components/layout/admin-page-layout";

export default function AdminUsersPage() {
  const { data, isLoading, error } = useUsers({ page: 1, limit: 50 });

  return (
    <AdminPageLayout
      title="Database User"
      subtitle="Manajemen akses dan data pengguna."
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading users..."
      errorMessage={error?.message}
    >
      <AdminUsersDisplay initialUsers={data?.data || []} />
    </AdminPageLayout>
  );
}