"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Trophy,
  Star,
  TrendingUp,
  Medal,
  Phone,
  ScanLine,
  X,
  Camera,
} from "lucide-react";
import Link from "next/link";
import jsQR from "jsqr";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useBookings } from "@/hooks/use-bookings";
import { useReviews } from "@/hooks/use-reviews";
import { getCategoryLabel } from "@/constant/category-store";
import { CITIES_OPTIONS } from "@/constant/cities";
import { ReviewDialog } from "@/components/shared/dialog/review-dialog";
import { recordScanAction } from "@/app/actions/scan-actions";
import { createReviewAction } from "../actions/review-actions";
import { PageLoader } from "@/components/ui/page-loader";
import { PageError } from "@/components/ui/page-error";

const TenantLeaderboard = () => {
  const [selectedCity, setSelectedCity] = useState("ALL");
  const [searchTerm, setSearchTerm] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [scanError, setScanError] = useState("");
  const [isReviewOpen, setIsReviewOpen] = useState(false);
  const [foundBooking, setFoundBooking] = useState(null);

  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const canvasRef = useRef(null);
  const scanIntervalRef = useRef(null);

  const {
    data: bookingsData,
    isLoading: bookingsLoading,
    error: bookingsError,
  } = useBookings({
    status: "PAID",
    limit: 100,
  });
  const { data: reviewsData, error: reviewsError } = useReviews({ limit: 500 });

  const bookings = bookingsData?.data || [];
  const reviews = reviewsData?.data || [];

  const processedTenants = bookings.map((tenant) => {
    const tenantReviews = reviews.filter((r) => r.bookingId === tenant.id);
    const totalRating = tenantReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating =
      tenantReviews.length > 0 ? totalRating / tenantReviews.length : 0;
    return {
      ...tenant,
      rating: avgRating,
      reviewCount: tenantReviews.length,
      city: tenant.booth?.event?.city || "Unknown",
    };
  });

  const leaderboardData = processedTenants
    .filter((tenant) => {
      const matchCity =
        selectedCity === "ALL" ||
        tenant.city.toLowerCase() === selectedCity.toLowerCase();
      const matchSearch = tenant.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      return matchCity && matchSearch;
    })
    .sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);

  const startScanner = async () => {
    setScanError("");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      const msg = "Browser tidak mendukung kamera.";
      setScanError(msg);
      toast.error("Gagal Membuka Kamera", { description: msg });
      return;
    }

    try {
      setIsScanning(true);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });

      streamRef.current = stream;

      setTimeout(() => {
        if (videoRef.current && streamRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.setAttribute("playsinline", true);

          videoRef.current.onloadedmetadata = () => {
            if (videoRef.current) {
              videoRef.current.play().catch((e) => console.error(e));
              scanIntervalRef.current = setInterval(scanQRCode, 300);
            }
          };
        } else {
          stopScanner();
        }
      }, 100);
    } catch (error) {
      console.error("Camera Error:", error);
      setIsScanning(false);

      let errorMessage = "Terjadi kesalahan saat mengakses kamera.";
      let errorTitle = "Gagal Akses Kamera";

      if (
        error.name === "NotAllowedError" ||
        error.name === "PermissionDeniedError"
      ) {
        errorMessage =
          "Anda menolak izin kamera. Mohon izinkan akses di pengaturan browser.";
        errorTitle = "Izin Ditolak";
      } else if (error.name === "NotFoundError") {
        errorMessage = "Perangkat kamera tidak ditemukan.";
      } else if (error.name === "NotReadableError") {
        errorMessage = "Kamera sedang digunakan aplikasi lain.";
      }

      toast.error(errorTitle, {
        description: errorMessage,
      });

      setScanError(errorMessage);
    }
  };

  const stopScanner = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }

    if (scanIntervalRef.current) {
      clearInterval(scanIntervalRef.current);
      scanIntervalRef.current = null;
    }

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    setIsScanning(false);
    setScanError("");
  };

  const scanQRCode = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    if (video.readyState === video.HAVE_ENOUGH_DATA) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height, {
        inversionAttempts: "dontInvert",
      });

      if (code) {
        handleQRCodeDetected(code.data);
      }
    }
  };

  const handleQRCodeDetected = (qrData) => {
    const matchedBooking = bookingsData?.data?.find((b) => b.id === qrData);

    if (matchedBooking) {
      stopScanner();
      setFoundBooking(matchedBooking);
      setIsReviewOpen(true);

      toast.success("Tenant Ditemukan!", {
        description: `Berhasil scan: ${matchedBooking.name || "Tenant"}`,
      });

      recordScanAction(qrData).then(() => {});
    } else {
      if (!scanError) {
        setScanError("QR Code tidak valid atau tenant tidak ditemukan.");

        toast.warning("QR Tidak Dikenali", {
          description: "Pastikan Anda menscan QR Code tenant yang benar.",
        });

        setTimeout(() => setScanError(""), 3000);
      }
    }
  };

  const handleReviewSubmit = async (data) => {
    const promise = createReviewAction(data);

    toast.promise(promise, {
      loading: "Mengirim ulasan...",
      success: (result) => {
        if (result.success) {
          setIsReviewOpen(false);
          setFoundBooking(null);
          return "Terima kasih! Ulasan Anda telah tersimpan.";
        } else {
          throw new Error(result.error || "Gagal menyimpan.");
        }
      },
      error: (err) => {
        return err.message || "Gagal mengirim ulasan.";
      },
    });
  };

  useEffect(() => {
    return () => {
      stopScanner();
    };
  }, []);

  if (bookingsLoading) {
    return <PageLoader message="Memuat tenant..." />;
  }

  if (bookingsError) {
    return (
      <PageError
        message={
          bookingsError.message || "Terjadi kesalahan saat memuat tenant"
        }
      />
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-zinc-100">
        <PageError message="Belum ada tenant yang tersedia" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <section className="pt-32 pb-12 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-fuchsia-900/10 blur-[120px] pointer-events-none" />
        <div className="container mx-auto text-center space-y-4 relative z-10">
          <Badge
            variant="outline"
            className="border-fuchsia-500/50 text-fuchsia-400 mb-2"
          >
            <Trophy className="w-3 h-3 mr-2" />
            Top Seller & Tenant
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
            Leaderboard <span className="text-fuchsia-500">UMKM</span>
          </h1>
          <p className="text-zinc-400 max-w-2xl mx-auto text-lg">
            Temukan tenant paling favorit berdasarkan ulasan asli dari
            pengunjung di kotamu.
          </p>

          <div className="pt-6">
            <Button
              onClick={startScanner}
              className="bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold px-8 py-6 text-base rounded-2xl shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300 group"
            >
              <ScanLine className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
              Scan untuk Review & Support UMKM
            </Button>
          </div>
        </div>
      </section>

      <AnimatePresence>
        {isScanning && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg"
            >
              <Card className="bg-zinc-950 border-white/10 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-linear-to-r from-fuchsia-600/20 to-purple-600/20 border-b border-white/10 p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-fuchsia-600/20 flex items-center justify-center">
                        <Camera className="w-5 h-5 text-fuchsia-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-white">
                          Scan QR Code
                        </h3>
                        <p className="text-xs text-zinc-400">
                          Arahkan kamera ke QR code UMKM
                        </p>
                      </div>
                    </div>
                    <Button
                      onClick={stopScanner}
                      variant="ghost"
                      size="icon"
                      className="text-zinc-400 hover:text-white hover:bg-white/10 rounded-full"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>

                  <div className="relative bg-black aspect-square overflow-hidden">
                    <video
                      ref={videoRef}
                      autoPlay
                      playsInline
                      muted
                      className="w-full h-full object-cover"
                    />

                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="relative w-64 h-64">
                        <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-fuchsia-500 rounded-tl-2xl" />
                        <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-fuchsia-500 rounded-tr-2xl" />
                        <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-fuchsia-500 rounded-bl-2xl" />
                        <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-fuchsia-500 rounded-br-2xl" />

                        <motion.div
                          className="absolute left-0 right-0 h-1 bg-linear-to-r from-transparent via-fuchsia-500 to-transparent shadow-lg shadow-fuchsia-500/50"
                          animate={{ top: ["0%", "100%"] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        />
                      </div>
                    </div>

                    <canvas ref={canvasRef} className="hidden" />
                  </div>

                  <div className="bg-zinc-900/50 border-t border-white/10 p-4">
                    {scanError ? (
                      <div className="flex items-start gap-3 p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                        <X className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm text-red-400">{scanError}</p>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-zinc-400 text-sm">
                          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                          <span>
                            Kamera aktif - Posisikan QR code di dalam frame
                          </span>
                        </div>
                        <p className="text-xs text-zinc-500 pl-4">
                          QR code akan terdeteksi secara otomatis
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="sticky top-20 z-30 bg-[#050505]/80 backdrop-blur-md py-4 border-b border-white/5">
        <div className="container mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <Select value={selectedCity} onValueChange={setSelectedCity}>
              <SelectTrigger className="h-12 bg-[#0F0F11] border-white/10 text-zinc-300 focus:ring-fuchsia-500/50 rounded-xl">
                <MapPin className="w-4 h-4 mr-2 text-fuchsia-500" />
                <SelectValue placeholder="Pilih Kota" />
              </SelectTrigger>
              <SelectContent className="bg-[#0F0F11] border-white/10 text-zinc-300 rounded-xl">
                <SelectItem value="ALL" className="rounded-lg">
                  Semua Kota
                </SelectItem>
                {CITIES_OPTIONS.filter((c) => c.value !== "ALL").map((city) => (
                  <SelectItem
                    key={city.value}
                    value={city.value}
                    className="rounded-lg"
                  >
                    {city.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="relative w-full md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <Input
              placeholder="Cari nama tenant..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-[#0F0F11] border-white/10 text-white focus-visible:ring-fuchsia-500 rounded-xl"
            />
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-12">
        {bookingsLoading ? (
          <div className="text-center py-20 text-zinc-400">
            Loading tenants...
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {leaderboardData.map((tenant, index) => {
              const rank = index + 1;
              let rankColor = "text-zinc-500";
              let rankIcon = (
                <span className="font-bold font-mono text-xl">#{rank}</span>
              );
              let glow = "";

              if (rank === 1) {
                rankColor = "text-yellow-400";
                rankIcon = <Trophy className="w-8 h-8 fill-yellow-400/20" />;
                glow =
                  "shadow-[0_0_30px_rgba(250,204,21,0.15)] border-yellow-500/30";
              } else if (rank === 2) {
                rankColor = "text-zinc-300";
                rankIcon = <Medal className="w-7 h-7 fill-zinc-300/20" />;
                glow = "border-zinc-500/30";
              } else if (rank === 3) {
                rankColor = "text-orange-400";
                rankIcon = <Medal className="w-6 h-6 fill-orange-400/20" />;
                glow = "border-orange-500/30";
              }

              return (
                <motion.div
                  key={tenant.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <Card
                    className={`bg-[#0F0F11] border-white/10 hover:bg-white/5 transition-all group overflow-hidden rounded-2xl ${glow}`}
                  >
                    <CardContent className="p-0">
                      <div className="flex items-center p-4 sm:p-6 gap-4 sm:gap-6">
                        <div
                          className={`shrink-0 w-12 text-center ${rankColor}`}
                        >
                          {rankIcon}
                        </div>

                        <div className="relative shrink-0">
                          <div className="w-16 h-16 rounded-xl bg-zinc-800 overflow-hidden border border-white/10 group-hover:border-fuchsia-500/50 transition-colors">
                            {tenant.logo ? (
                              <img
                                src={tenant.logo}
                                alt={tenant.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-zinc-600 font-bold">
                                {tenant.name.charAt(0)}
                              </div>
                            )}
                          </div>
                          {rank <= 3 && (
                            <div className="absolute -bottom-2 -right-2 bg-black rounded-full p-1 border border-white/10">
                              <TrendingUp className="w-3 h-3 text-green-500" />
                            </div>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-1">
                            <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-fuchsia-400 transition-colors truncate">
                              {tenant.name}
                            </h3>
                            <Badge
                              variant="outline"
                              className="w-fit bg-white/5 border-white/10 text-[10px] text-zinc-400"
                            >
                              {getCategoryLabel(tenant.category)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-4 text-sm text-zinc-400">
                            <div className="flex items-center gap-1 text-yellow-500">
                              <Star className="w-4 h-4 fill-current" />
                              <span className="font-bold text-white">
                                {tenant.rating.toFixed(1)}
                              </span>
                              <span className="text-zinc-600">
                                ({tenant.reviewCount} Reviews)
                              </span>
                            </div>
                            <div className="hidden sm:flex items-center gap-1">
                              <Phone className="w-4 h-4" />
                              {tenant.user.phone}
                            </div>
                          </div>
                        </div>

                        <div className="hidden sm:block">
                          <Link
                            href={`/tenants/${tenant.id}`}
                            className="bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white font-semibold px-6 py-3 text-base rounded-2xl shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transition-all duration-300"
                          >
                            Lihat Profil
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}

            {leaderboardData.length === 0 && !bookingsLoading && (
              <div className="text-center py-20 text-zinc-500">
                Tidak ada tenant ditemukan untuk filter ini.
              </div>
            )}
          </div>
        )}
      </section>

      {foundBooking && (
        <ReviewDialog
          isOpen={isReviewOpen}
          onOpenChange={setIsReviewOpen}
          booking={foundBooking}
          onSubmit={handleReviewSubmit}
        />
      )}
    </div>
  );
};

export default TenantLeaderboard;
