"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Star,
  ArrowLeft,
  Store,
  Clock,
  CheckCircle,
  ExternalLink,
  QrCode,
  Download,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { useParams, useRouter } from "next/navigation";
import { useBooking } from "@/hooks/use-bookings";
import { useReviewsByBooking } from "@/hooks/use-reviews";
import { getCategoryLabel } from "@/constant/category-store";
import { PageLoader } from "@/components/ui/page-loader";
import { PageError } from "@/components/ui/page-error";
import { useQrCode } from "@/hooks/use-qr-code";

export default function TenantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const { data: tenant, isLoading, error } = useBooking(params.id);
  const { data: reviewsData } = useReviewsByBooking(params.id);
  const { qrState, generateQr, closeQr } = useQrCode();

  const reviews = reviewsData?.data || [];
  const galleryImages = tenant?.gallery || []; // Ambil dari data tenant atau array kosong
  
  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const handleNextImage = () => {
    setSelectedImageIndex((prev) =>
      prev === galleryImages.length - 1 ? 0 : prev + 1
    );
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) =>
      prev === 0 ? galleryImages.length - 1 : prev - 1
    );
  };

  const handleDownloadQr = () => {
    if (qrState.dataUrl) {
      const link = document.createElement("a");
      link.href = qrState.dataUrl;
      link.download = `QR-${qrState.code}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  if (isLoading) {
    return <PageLoader message="Loading tenant..." />;
  }

  if (error || !tenant) {
    return (
      <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center">
        <PageError message="Tenant tidak ditemukan." />
        <Button
          className="mt-4"
          variant="outline"
          onClick={() => router.push("/tenants")}
        >
          Kembali ke Tenants
        </Button>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <Dialog
        open={qrState.isOpen}
        onOpenChange={(open) => {
          if (!open) closeQr();
        }}
      >
        <DialogContent className="bg-[#0F0F11] border-white/10 sm:max-w-sm text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-center text-xl font-bold flex items-center justify-center gap-2">
              <QrCode className="w-5 h-5 text-fuchsia-500" />
              {qrState.type}
            </DialogTitle>
            <DialogDescription className="text-center text-zinc-400">
              Tunjukkan kode ini kepada petugas untuk verifikasi.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="bg-white p-4 rounded-2xl shadow-xl shadow-fuchsia-500/10">
              {qrState.dataUrl ? (
                <img
                  src={qrState.dataUrl}
                  alt="QR Code"
                  className="w-48 h-48 object-contain"
                />
              ) : (
                <div className="w-48 h-48 bg-zinc-200 animate-pulse rounded-lg" />
              )}
            </div>
          </div>

          <DialogFooter className="sm:justify-center">
            <Button
              variant="outline"
              className="w-full bg-zinc-800 border-white/10 hover:bg-zinc-900 hover:text-white"
              onClick={handleDownloadQr}
            >
              <Download className="w-4 h-4 mr-2" />
              Simpan Gambar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/50 to-transparent z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={
            tenant.banner ||
            "/placeholder.svg?height=600&width=1200&query=event"
          }
          alt={tenant.name}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-28 left-6 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full bg-black/50 border-white/10 text-white hover:bg-black hover:text-white backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <main className="container mx-auto px-6 -mt-32 relative z-20 pb-20">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col lg:flex-row gap-8"
        >
          <motion.div variants={itemVariants} className="lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              <Card className="bg-[#0F0F11]/80 backdrop-blur-xl border-white/10 overflow-hidden shadow-2xl">
                <CardContent className="p-8 text-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", delay: 0.2 }}
                    className="relative inline-block mb-6"
                  >
                    <div className="absolute inset-0 rounded-full bg-linear-to-br from-fuchsia-600/30 via-pink-600/30 to-rose-600/30 blur-2xl" />
                    <div className="relative w-32 h-32 rounded-full border-4 border-[#0F0F11] bg-zinc-800 overflow-hidden shadow-2xl">
                      {tenant.logo ? (
                        <img
                          src={tenant.logo || "/placeholder.svg"}
                          alt="Logo"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-500">
                          {tenant.name.charAt(0)}
                        </div>
                      )}
                    </div>
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5 }}
                      className="absolute -bottom-1 -right-1 bg-linear-to-br from-blue-500 to-cyan-500 text-white p-2 rounded-full border-4 border-[#0F0F11] shadow-lg"
                    >
                      <CheckCircle className="w-5 h-5" />
                    </motion.div>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-3xl font-bold text-white mb-2"
                  >
                    {tenant.name}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-zinc-400 text-sm mb-6"
                  >
                    {getCategoryLabel(tenant.category)}
                  </motion.p>

                  <div className="flex justify-center items-center gap-6 mb-8">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-linear-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/20"
                    >
                      <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
                      <span className="font-bold text-lg text-white">
                        {avgRating}
                      </span>
                    </motion.div>

                    <Separator
                      orientation="vertical"
                      className="h-10 bg-white/10"
                    />

                    <div className="text-center">
                      <span className="block font-bold text-white text-xl">
                        {reviews.length}
                      </span>
                      <span className="text-xs text-zinc-500">Review</span>
                    </div>
                  </div>

                  {tenant.booth?.event && (
                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      className="bg-linear-to-br from-fuchsia-600/5 via-pink-600/5 to-rose-600/5 rounded-2xl p-5 border border-white/10 text-left backdrop-blur-sm"
                    >
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-2 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/20">
                          <MapPin className="w-4 h-4 text-fuchsia-400" />
                        </div>
                        <p className="text-xs text-zinc-400 uppercase font-bold tracking-wider">
                          Lokasi Saat Ini
                        </p>
                      </div>

                      <div className="space-y-3">
                        <h4 className="font-bold text-white text-lg hover:text-fuchsia-400 transition-colors cursor-pointer">
                          {tenant.booth.event.title}
                        </h4>
                        <p className="text-sm text-zinc-400 flex items-start gap-2">
                          <MapPin className="w-4 h-4 mt-0.5 shrink-0" />
                          {tenant.booth.event.location}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-zinc-500">
                          <Clock className="w-3 h-3" />
                          {new Date(tenant.booth.event.date).toLocaleDateString(
                            "id-ID",
                            {
                              dateStyle: "medium",
                            }
                          )}
                        </div>
                        <div className="pt-2">
                          <Button
                            onClick={() =>
                              generateQr("Booth Code", tenant.booth.code)
                            }
                            className="w-full bg-linear-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 border-0 shadow-lg shadow-fuchsia-500/20 text-white font-bold h-auto py-2.5 rounded-xl group"
                          >
                            <QrCode className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                            Lihat QR Booth
                          </Button>
                          <p className="text-center text-[10px] text-zinc-500 mt-2">
                            Klik untuk scan verifikasi
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="lg:w-2/3">
            <Tabs defaultValue="about" className="w-full">
              <TabsList className="bg-[#0F0F11]/80 backdrop-blur-xl border border-white/10 w-full justify-start h-auto p-1.5 mb-8 rounded-2xl">
                <TabsTrigger
                  value="about"
                  className="data-[state=active]:bg-linear-to-br data-[state=active]:from-fuchsia-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-fuchsia-500/30 text-zinc-400 px-6 py-3 rounded-xl transition-all duration-300"
                >
                  Tentang
                </TabsTrigger>
                <TabsTrigger
                  value="gallery"
                  className="data-[state=active]:bg-linear-to-br data-[state=active]:from-fuchsia-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-fuchsia-500/30 text-zinc-400 px-6 py-3 rounded-xl transition-all duration-300"
                >
                  Galeri Produk
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="data-[state=active]:bg-linear-to-br data-[state=active]:from-fuchsia-600 data-[state=active]:to-pink-600 data-[state=active]:text-white data-[state=active]:border data-[state=active]:border-fuchsia-500/30 text-zinc-400 px-6 py-3 rounded-xl transition-all duration-300"
                >
                  Ulasan ({reviews.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card className="bg-[#0F0F11]/80 backdrop-blur-xl border-white/10 overflow-hidden">
                    <CardContent className="p-8">
                      <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 rounded-xl bg-linear-to-br from-fuchsia-600/20 to-pink-600/20 border border-fuchsia-500/30">
                          <Store className="w-5 h-5 text-fuchsia-400" />
                        </div>
                        <h3 className="text-xl font-bold text-white">
                          Deskripsi Toko
                        </h3>
                      </div>
                      <p className="text-zinc-400 leading-relaxed whitespace-pre-line text-base">
                        {tenant.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              <TabsContent value="gallery" className="mt-0">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="grid grid-cols-2 md:grid-cols-3 gap-4"
                >
                  {galleryImages.length > 0 ? (
                    galleryImages.map((image, index) => (
                      <motion.div
                        key={image.id || index}
                        layoutId={`gallery-item-${index}`}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => setSelectedImageIndex(index)}
                        className="aspect-square rounded-2xl bg-zinc-900 overflow-hidden border border-white/10 group cursor-pointer relative shadow-lg"
                      >
                        <img
                          src={image.url || "/placeholder.svg"}
                          alt={`Product ${index + 1}`}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />

                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                          <div className="bg-white/10 p-3 rounded-full border border-white/20 backdrop-blur-md transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                            <ZoomIn className="w-6 h-6 text-white" />
                          </div>
                        </div>
                      </motion.div>
                    ))
                  ) : (
                    <div className="col-span-full text-center py-12 text-zinc-500">
                      Belum ada galeri produk untuk tenant ini.
                    </div>
                  )}
                </motion.div>

                <Dialog
                  open={selectedImageIndex !== null}
                  onOpenChange={(open) => !open && setSelectedImageIndex(null)}
                >
                  <DialogContent
                    showCloseButton={false}
                    className="max-w-4xl w-full bg-transparent border-none shadow-none p-0 text-white overflow-visible outline-none"
                  >
                    <button
                      onClick={() => setSelectedImageIndex(null)}
                      className="absolute -top-12 right-0 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors z-50 cursor-pointer"
                    >
                      <X className="w-6 h-6" />
                    </button>

                    <div className="relative flex items-center justify-center w-full h-[80vh]">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePrevImage();
                        }}
                        className="absolute left-2 md:-left-12 p-2 rounded-full bg-black/50 border border-white/10 hover:bg-white/20 hover:scale-110 transition-all z-50 text-white cursor-pointer"
                      >
                        <ChevronLeft className="w-8 h-8" />
                      </button>

                      <AnimatePresence mode="wait">
                        {selectedImageIndex !== null && galleryImages.length > 0 && (
                          <motion.img
                            key={selectedImageIndex}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                            src={galleryImages[selectedImageIndex]?.url || "/placeholder.svg"}
                            alt="Selected Product"
                            className="max-h-full max-w-full object-contain rounded-lg shadow-2xl border border-white/10 bg-black"
                          />
                        )}
                      </AnimatePresence>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleNextImage();
                        }}
                        className="absolute right-2 md:-right-12 p-2 rounded-full bg-black/50 border border-white/10 hover:bg-white/20 hover:scale-110 transition-all z-50 text-white cursor-pointer"
                      >
                        <ChevronRight className="w-8 h-8" />
                      </button>

                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-sm font-medium">
                        Produk {selectedImageIndex + 1} dari{" "}
                        {galleryImages.length}
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </TabsContent>

              <TabsContent value="reviews" className="space-y-4">
                <AnimatePresence mode="wait">
                  {reviews.length > 0 ? (
                    reviews.map((review, index) => (
                      <motion.div
                        key={review.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <Card className="bg-[#0F0F11]/80 backdrop-blur-xl border-white/10 overflow-hidden hover:border-fuchsia-500/30 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex items-start justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <Avatar className="w-12 h-12 border-2 border-white/10">
                                  <AvatarFallback className="bg-linear-to-br from-fuchsia-600/20 to-pink-600/20 text-white font-bold">
                                    {(review.name || "A").charAt(0)}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <p className="text-sm font-bold text-white">
                                    {review.name || "Anonymous"}
                                  </p>
                                  <p className="text-xs text-zinc-500">
                                    {new Date(
                                      review.createdAt
                                    ).toLocaleDateString("id-ID")}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`w-4 h-4 ${
                                      i < review.rating
                                        ? "fill-yellow-500 text-yellow-500"
                                        : "text-zinc-700"
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-zinc-400 text-sm leading-relaxed">
                              {review.comment}
                            </p>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-10 text-zinc-500">
                      Belum ada ulasan untuk tenant ini.
                    </div>
                  )}
                </AnimatePresence>
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
