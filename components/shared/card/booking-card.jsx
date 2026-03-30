"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  CheckCircle,
  Clock,
  MapPin,
  Store,
  Ticket,
  XCircle,
  Ban,
  Tag,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { motion } from "framer-motion";

const getStatusConfig = (status) => {
  switch (status) {
    case "PAID":
      return {
        icon: CheckCircle,
        label: "TERKONFIRMASI",
        bg: "bg-fuchsia-950",
        text: "text-fuchsia-400",
        border: "border-fuchsia-500",
        iconColor: "text-fuchsia-400",
        buttonBg: "bg-fuchsia-600 hover:bg-fuchsia-700",
      };
    case "PENDING":
      return {
        icon: Clock,
        label: "MENUNGGU VERIFIKASI",
        bg: "bg-amber-950",
        text: "text-amber-400",
        border: "border-amber-500",
        iconColor: "text-amber-400",
        buttonBg: "bg-amber-600 hover:bg-amber-700",
      };
    case "REJECTED":
      return {
        icon: XCircle,
        label: "DITOLAK",
        bg: "bg-red-950",
        text: "text-red-400",
        border: "border-red-500",
        iconColor: "text-red-400",
        buttonBg: "bg-red-600 hover:bg-red-700",
      };
    case "CANCELLED":
      return {
        icon: Ban,
        label: "DIBATALKAN",
        bg: "bg-zinc-950",
        text: "text-zinc-400",
        border: "border-zinc-500",
        iconColor: "text-zinc-400",
        buttonBg: "bg-zinc-600 hover:bg-zinc-700",
      };
    default:
      return {
        icon: AlertCircle,
        label: status,
        bg: "bg-blue-950",
        text: "text-blue-400",
        border: "border-blue-500",
        iconColor: "text-blue-400",
        buttonBg: "bg-blue-600 hover:bg-blue-700",
      };
  }
};

const BookingCard = ({ booking, onShowQR, index = 0 }) => {
  const status = booking.status || "PENDING";
  const config = getStatusConfig(status);
  const StatusIcon = config.icon;

  const eventImage =
    booking.booth?.event?.image || "/placeholder.svg?height=400&width=600";
  const eventTitle = booking.booth?.event?.title || "Event Title";
  const eventLocation = booking.booth?.event?.location || "Lokasi Event";
  const eventDate = booking.booth?.event?.date || new Date();
  const boothCode = booking.booth?.code || "N/A";
  const boothPrice = booking.booth?.price || 0;
  const category = booking.category || "UMUM";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      whileHover={{ scale: 1.01 }}
    >
      <Card className="bg-black border-zinc-800 overflow-hidden hover:border-fuchsia-500 transition-all duration-300 group relative">
        <div className="flex flex-col md:flex-row relative">
          <div className="relative md:w-72 h-64 md:h-auto overflow-hidden">
            <img
              src={eventImage}
              alt="Event"
              className={`w-full h-full object-cover ${
                status === "REJECTED" || status === "CANCELLED"
                  ? "grayscale opacity-70"
                  : ""
              }`}
            />

            <div className="absolute inset-0 bg-black/40" />

            <div className="absolute top-4 left-4">
              <Badge
                variant="outline"
                className={`${config.bg} ${config.text} ${config.border} backdrop-blur-xl px-3 py-1.5 border-2`}
              >
                <div className="inline-flex items-center text-xs font-bold tracking-wider">
                  <StatusIcon className="w-3.5 h-3.5 mr-1.5" />
                  {config.label}
                </div>
              </Badge>
            </div>

            <div className="absolute bottom-4 left-4 md:hidden">
              <p className="text-white font-bold text-lg drop-shadow">
                Rp {boothPrice.toLocaleString("id-ID")}
              </p>
            </div>
          </div>

          <CardContent className="flex-1 p-6 flex flex-col justify-between relative z-10">
            <div>
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2 flex-1">
                  <Badge
                    variant="secondary"
                    className="bg-zinc-900 text-zinc-400 text-[10px] border border-zinc-800"
                  >
                    <Tag className="w-3 h-3 mr-1" />
                    {category.replace("_", " ")}
                  </Badge>

                  <h3 className="text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors line-clamp-2">
                    {eventTitle}
                  </h3>
                </div>

                <div className="text-right shrink-0 bg-zinc-950 border-2 border-zinc-800 rounded-lg p-3 min-w-[90px]">
                  <div className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider text-center mb-1">
                    Nama Toko
                  </div>
                  <div className="text-xl font-bold text-fuchsia-400 text-center font-mono">
                    {booking.name}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 mt-4 text-sm">
                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <Calendar className="w-4 h-4 text-fuchsia-500" />
                  </div>
                  <span className="font-medium">
                    {new Date(eventDate).toLocaleDateString("id-ID", {
                      weekday: "long",
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <MapPin className="w-4 h-4 text-fuchsia-500" />
                  </div>
                  <span className="truncate font-medium">{eventLocation}</span>
                </div>

                <div className="flex items-center gap-3 text-zinc-300">
                  <div className="p-2 rounded-lg bg-zinc-900 border border-zinc-800">
                    <CreditCard className="w-4 h-4 text-fuchsia-500" />
                  </div>
                  <span className="font-bold text-white">
                    Rp {boothPrice.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-zinc-800">
              {status === "PAID" ? (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Button
                      onClick={() => onShowQR("TIKET", boothCode)}
                      className="w-full bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
                    >
                      <Ticket className="w-4 h-4 mr-2" />
                      Tiket
                    </Button>
                  </div>
                  <div className="flex-1">
                    <Button
                      onClick={() => onShowQR("TOKO", booking.id)}
                      variant="outline"
                      className="w-full border-2 border-zinc-700 text-zinc-300 bg-zinc-900 hover:border-fuchsia-500 hover:text-fuchsia-500"
                    >
                      <Store className="w-4 h-4 mr-2" />
                      Toko
                    </Button>
                  </div>
                </div>
              ) : status === "PENDING" ? (
                <div className="w-full p-3 rounded-xl bg-amber-950 border-2 border-amber-500/30 text-amber-400 text-sm flex items-center justify-center gap-2 font-medium">
                  <Clock className="w-4 h-4 animate-spin" />
                  <span>Menunggu persetujuan admin...</span>
                </div>
              ) : status === "REJECTED" ? (
                <div className="w-full p-3 rounded-xl bg-red-950 border-2 border-red-500/30 text-red-400 text-sm flex flex-col items-center text-center gap-1.5">
                  <div className="flex items-center gap-2 font-semibold">
                    <XCircle className="w-4 h-4" />
                    <span>Booking Ditolak</span>
                  </div>
                  <span className="text-xs text-red-400/70">
                    Silakan cek email atau hubungi admin.
                  </span>
                </div>
              ) : (
                <div className="w-full p-3 rounded-xl bg-zinc-950 border-2 border-zinc-700 text-zinc-400 text-sm flex items-center justify-center gap-2 font-medium">
                  <Ban className="w-4 h-4" />
                  <span>Booking Dibatalkan</span>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </motion.div>
  );
};

export default BookingCard;
