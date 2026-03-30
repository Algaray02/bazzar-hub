"use client";

import AdminBlogsDisplay from "@/components/pages/admin/blogs-display";
import { useBlogs } from "@/hooks/use-blogs";
import { AdminPageLayout } from "@/components/layout/admin-page-layout";

export default function AdminBlogsPage() {
  const { data, isLoading, error } = useBlogs({
    publishedOnly: false,
    page: 1,
    limit: 50,
  });

  return (
    <AdminPageLayout
      title="Blog Management"
      subtitle="Manage blog posts, drafts, and published content."
      isLoading={isLoading}
      error={error}
      loadingMessage="Loading blogs..."
      errorMessage={error?.message}
    >
      <AdminBlogsDisplay initialPosts={data?.data || []} />
    </AdminPageLayout>
  );
}
