"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BookingCard from "@/components/shared/card/booking-card";
import { useSellerBookings } from "@/hooks/use-seller-bookings";

export function BookingTab({ onShowQR }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: bookings = [], isLoading } = useSellerBookings();

  const filteredBookings = bookings.filter((booking) => {
    const matchesSearch =
      booking.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      booking.booth?.event?.title
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === "ALL" || booking.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    ALL: bookings.length,
    PENDING: bookings.filter((b) => b.status === "PENDING").length,
    PAID: bookings.filter((b) => b.status === "PAID").length,
    REJECTED: bookings.filter((b) => b.status === "REJECTED").length,
    COMPLETED: bookings.filter((b) => b.status === "COMPLETED").length,
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Tiket & Booking
          </h2>
          <p className="text-zinc-400">Kelola semua booking dan tiket Anda</p>
        </div>
        <div className="relative w-full md:w-80">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <Input
            placeholder="Cari event atau toko..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-11 bg-zinc-900/50 border-zinc-700 text-white focus:ring-fuchsia-500 focus:border-fuchsia-500 h-11 rounded-xl"
          />
        </div>
      </div>

      <Tabs
        value={statusFilter}
        onValueChange={setStatusFilter}
        className="w-full"
      >
        <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1">
          {[
            { value: "ALL", label: "Semua" },
            { value: "PENDING", label: "Menunggu" },
            { value: "PAID", label: "Terkonfirmasi" },
            { value: "COMPLETED", label: "Selesai" },
            { value: "REJECTED", label: "Ditolak" },
          ].map((tab) => (
            <TabsTrigger
              key={tab.value}
              value={tab.value}
              className="data-[state=active]:bg-linear-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-purple-600 data-[state=active]:text-white rounded-lg px-4 text-zinc-400 hover:text-zinc-300 transition-all font-medium"
            >
              {tab.label} ({statusCounts[tab.value]})
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-10 text-zinc-400">
          Loading bookings...
        </div>
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-20 text-zinc-500">
          {searchQuery
            ? "Tidak ada booking yang cocok dengan pencarian."
            : "Belum ada booking. Mulai booking event untuk mengembangkan bisnis Anda!"}
        </div>
      ) : (
        <div className="grid gap-6">
          {filteredBookings.map((booking, index) => (
            <BookingCard
              key={booking.id}
              booking={booking}
              onShowQR={onShowQR}
              index={index}
            />
          ))}
        </div>
      )}
    </>
  );
}
