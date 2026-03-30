"use client";

import EventsPageDisplay from "@/components/pages/events-page-display";
import { useEvents } from "@/hooks/use-events";
import { PageLoader } from "@/components/ui/page-loader";
import { PageError } from "@/components/ui/page-error";

export default function EventPage() {
  const { data, isLoading, error } = useEvents({ page: 1, limit: 50 });

  if (isLoading) {
    return <PageLoader message="Memuat events..." />;
  }

  if (error) {
    return (
      <PageError
        message={error.message || "Terjadi kesalahan saat memuat events"}
      />
    );
  }

  if (data.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-100">
        <PageError message="Belum ada events yang tersedia" />
      </div>
    );
  }

  return <EventsPageDisplay initialEvents={data} isLoading={false} />;
}
