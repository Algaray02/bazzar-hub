"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle,
  XCircle,
  Image as ImageIcon,
  Clock,
  CheckCheck,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/shared/card/stat-card";
import { useBookings, useVerifyBooking } from "@/hooks/use-bookings";

const AdminBookingsDisplay = ({ initialBookings = [] }) => {
  const bookings = initialBookings;
  const verifyBooking = useVerifyBooking();

  const handleAction = (id, newStatus) => {
    verifyBooking.mutate({ bookingId: id, status: newStatus });
  };

  const pendingBookings = bookings.filter((b) => b.status === "PENDING");
  const verifiedBookings = bookings.filter((b) => b.status === "PAID");

  const totalRevenue = bookings
    .filter((b) => b.status === "PAID")
    .reduce((sum, b) => sum + (b.booth?.price || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Verifikasi Booking
        </h1>
        <p className="text-zinc-400">
          Kelola validasi pembayaran dan cashflow event dari seller.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard
          label="Perlu Tindakan"
          value={pendingBookings.length}
          icon={Clock}
          color="text-amber-500"
          subtext="Booking menunggu verifikasi admin"
        />
        <StatCard
          label="Terverifikasi"
          value={verifiedBookings.length}
          icon={CheckCheck}
          color="text-emerald-500"
          subtext="Booking sukses bulan ini"
        />
        <StatCard
          label="Total Revenue"
          value={`Rp ${(totalRevenue / 1000000).toFixed(1)}JT`}
          icon={TrendingUp}
          color="text-fuchsia-500"
          subtext="+12% dari bulan lalu"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-amber-500 rounded-full" />
            <h2 className="text-xl font-bold text-white">
              Menunggu Persetujuan
            </h2>
            <Badge
              variant="outline"
              className="border-amber-500/20 text-amber-500 bg-amber-500/10 ml-2"
            >
              {pendingBookings.length} Request
            </Badge>
          </div>

          <AnimatePresence>
            {pendingBookings.length > 0 ? (
              pendingBookings.map((booking) => (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="mb-4"
                >
                  <Card className="bg-[#0F0F11] border-white/10 hover:border-amber-500/30 transition-all overflow-hidden group">
                    <div className="absolute inset-0 bg-linear-to-r from-amber-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

                    <CardContent className="p-6 relative z-10">
                      <div className="flex flex-col md:flex-row gap-6 items-start">
                        <div className="flex-1 space-y-4 w-full">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="text-xl font-bold text-white group-hover:text-amber-400 transition-colors">
                                {booking.name || "N/A"}
                              </h3>
                              <p className="text-zinc-400 text-sm flex items-center gap-1 mt-1">
                                <span className="text-zinc-500">Owner:</span>{" "}
                                {booking.user?.name || "N/A"}
                              </p>
                            </div>
                            <Badge className="bg-amber-500/10 text-amber-500 border-amber-500/20 hover:bg-amber-500/20">
                              Review Needed
                            </Badge>
                          </div>

                          <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 p-4 rounded-xl border border-white/5">
                            <div>
                              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                                Event
                              </p>
                              <p className="font-medium text-white truncate">
                                {booking.booth?.event?.title || "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                                Tanggal Event
                              </p>
                              <p className="font-medium text-white">
                                {booking.booth?.event?.date
                                  ? new Date(
                                      booking.booth.event.date
                                    ).toLocaleDateString("id-ID", {
                                      weekday: "long",
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                                Tanggal Booking
                              </p>
                              <p className="font-medium text-white">
                                {booking.createdAt
                                  ? new Date(
                                      booking.createdAt
                                    ).toLocaleDateString("id-ID", {
                                      day: "numeric",
                                      month: "long",
                                      year: "numeric",
                                    })
                                  : "N/A"}
                              </p>
                            </div>
                            <div>
                              <p className="text-zinc-500 text-xs uppercase tracking-wider font-semibold">
                                Total Transfer
                              </p>
                              <p className="font-bold text-fuchsia-400">
                                Rp{" "}
                                {booking.booth?.price
                                  ? booking.booth.price.toLocaleString("id-ID")
                                  : "N/A"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-row md:flex-col gap-3 w-full md:w-40 shrink-0">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline"
                                className="w-full bg-white/5 border-white/10 hover:bg-neutral-800 text-white! justify-start"
                                disabled={verifyBooking.isPending}
                              >
                                <ImageIcon className="w-4 h-4 mr-2" /> Bukti
                                Bayar
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="bg-[#0a0a0b] border-white/10 p-0 overflow-hidden max-w-md">
                              <DialogHeader className="px-6 pt-6 pb-2">
                                <DialogTitle
                                  className={"text-lg font-semibold text-white"}
                                >
                                  Bukti Transfer
                                </DialogTitle>
                                <DialogDescription>
                                  Pastikan nominal dan tanggal sesuai.
                                </DialogDescription>
                              </DialogHeader>
                              <div className="p-6 pt-0">
                                {booking.paymentProof ? (
                                  <img
                                    src={booking.paymentProof}
                                    alt="Bukti Transfer"
                                    className="w-full rounded-lg border border-white/10"
                                  />
                                ) : (
                                  <div className="w-full h-64 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                    <p className="text-zinc-500 text-sm">
                                      Tidak ada bukti pembayaran
                                    </p>
                                  </div>
                                )}
                              </div>
                            </DialogContent>
                          </Dialog>

                          <Button
                            onClick={() => handleAction(booking.id, "PAID")}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20 justify-start"
                            disabled={verifyBooking.isPending}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" /> Terima
                          </Button>

                          <Button
                            onClick={() => handleAction(booking.id, "REJECTED")}
                            variant="outline"
                            className="w-full bg-red-500/20 border-red-500/20 text-red-500 hover:bg-red-500/10 hover:text-red-400 justify-start disabled:opacity-50"
                            disabled={verifyBooking.isPending}
                          >
                            <XCircle className="w-4 h-4 mr-2" /> Tolak
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            ) : (
              <Card className="bg-[#0F0F11] border-dashed border-white/10 py-12">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCheck className="w-8 h-8 text-zinc-500" />
                  </div>
                  <h3 className="text-lg font-medium text-white">
                    Semua Bersih!
                  </h3>
                  <p className="text-zinc-500 mt-1">
                    Tidak ada booking yang menunggu verifikasi saat ini.
                  </p>
                </div>
              </Card>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-1 bg-emerald-500 rounded-full" />
            <h2 className="text-xl font-bold text-white">Riwayat Terbaru</h2>
          </div>

          <Card className="bg-[#0F0F11] border-white/10 py-6">
            <CardHeader className="border-b border-white/5">
              <CardTitle className="text-sm font-medium text-zinc-400 uppercase tracking-wider">
                Verified Bookings ({verifiedBookings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-white/5 max-h-[500px] overflow-y-auto">
                {verifiedBookings.length > 0 ? (
                  verifiedBookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="p-4 hover:bg-white/5 transition-colors group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <h4 className="font-bold text-white text-sm group-hover:text-emerald-400 transition-colors">
                          {booking.name || "N/A"}
                        </h4>
                        <Badge
                          variant="outline"
                          className="text-[10px] px-1.5 py-0 h-5 border-emerald-500/30 text-emerald-500 bg-emerald-500/10"
                        >
                          PAID
                        </Badge>
                      </div>
                      <p className="text-xs text-zinc-400 mb-2 line-clamp-1 flex items-center gap-1">
                        <FileText className="w-3 h-3" />{" "}
                        {booking.booth?.event?.title || "N/A"}
                      </p>
                      <div className="flex justify-between items-center text-xs">
                        <span className="text-zinc-500 bg-white/5 px-2 py-0.5 rounded">
                          {booking.booth?.code || "N/A"}
                        </span>
                        <span className="font-mono font-medium text-zinc-300">
                          Rp{" "}
                          {booking.booth?.price
                            ? booking.booth.price.toLocaleString("id-ID")
                            : "N/A"}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-zinc-500 text-sm">
                    Belum ada booking terverifikasi
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsDisplay;