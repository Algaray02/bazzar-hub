"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle, Eye, Plus, Star, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { useSellerBookings } from "@/hooks/use-seller-bookings";
import { useReviewsByBooking } from "@/hooks/use-reviews";
import { useGallery } from "@/hooks/use-galleries";
import { getCategoryLabel } from "@/constant/category-store";
import { uploadGalleryImageAction } from "@/app/actions/upload-file-actions";
import {
  createGalleryAction,
  deleteGalleryAction,
} from "@/app/actions/gallery-actions";
import { useQueryClient } from "@tanstack/react-query";

function PreviewTokoDialog({ isOpen, onClose, booking, reviews, gallery }) {
  if (!booking) return null;

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent
        showCloseButton={false}
        className="bg-zinc-950 border-zinc-800 text-white max-w-4xl max-h-[90vh] overflow-y-auto p-0"
      >
        <DialogTitle />
        <div className="relative h-48 w-full overflow-hidden">
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/60 to-transparent z-10" />
          {booking.banner ? (
            <img
              src={booking.banner || "/placeholder.svg"}
              alt="Banner"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-fuchsia-900/30 to-purple-900/30" />
          )}
        </div>

        <div className="px-6 pb-6 -mt-16 relative z-20">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <div className="w-28 h-28 rounded-full border-4 border-zinc-950 bg-zinc-800 overflow-hidden shadow-xl">
                {booking.logo ? (
                  <img
                    src={booking.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-3xl font-bold text-zinc-500">
                    {booking.name?.charAt(0) || "T"}
                  </div>
                )}
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white p-1.5 rounded-full border-4 border-zinc-950">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1">
              <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                {booking.name}
                <CheckCircle className="w-5 h-5 text-emerald-500" />
              </h2>
              <p className="text-zinc-400 text-sm mt-1">
                {getCategoryLabel(booking.category)}
              </p>
              <div className="flex items-center gap-4 mt-3">
                <div className="flex items-center gap-1 text-yellow-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="font-bold">{avgRating}</span>
                </div>
                <span className="text-zinc-500">|</span>
                <span className="text-zinc-400 text-sm">
                  {reviews.length} ulasan
                </span>
              </div>
              {booking.booth?.event && (
                <Badge className="mt-3 bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50">
                  {booking.booth.event.title}
                </Badge>
              )}
            </div>
          </div>

          <Card className="mt-6 bg-zinc-900/50 border-zinc-800">
            <CardContent className="p-4">
              <h3 className="text-sm font-semibold text-zinc-400 mb-2">
                Deskripsi
              </h3>
              <p className="text-zinc-300">{booking.description}</p>
            </CardContent>
          </Card>

          {gallery && gallery.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-4">Galeri</h3>
              <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                {gallery.map((img, i) => (
                  <div
                    key={i}
                    className="aspect-square rounded-lg overflow-hidden bg-zinc-900"
                  >
                    <img
                      src={img.url}
                      alt="Gallery"
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {reviews.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-bold text-white mb-4">
                Ulasan Terbaru
              </h3>
              <div className="space-y-3">
                {reviews.slice(0, 5).map((review) => (
                  <Card
                    key={review.id}
                    className="bg-zinc-900/50 border-zinc-800"
                  >
                    <CardContent className="p-4">
                      <div className="flex gap-1 text-amber-500 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`w-4 h-4 ${
                              i < review.rating
                                ? "fill-current"
                                : "text-zinc-700"
                            }`}
                          />
                        ))}
                      </div>
                      <p className="text-zinc-300 text-sm">{review.comment}</p>
                      <p className="text-zinc-500 text-xs mt-2">
                        - {review.name || "Anonymous"}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function ProfileTabs() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const { bookings, isLoading } = useSellerBookings();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const galleryInputRef = useRef(null);

  const activeBooking = bookings?.find((b) => b.status === "PAID");

  const { data: galleryImages = [] } = useGallery(activeBooking?.id);

  const { data: reviewsData } = useReviewsByBooking(activeBooking?.id);
  const reviews = reviewsData?.data || [];

  const avgRating =
    reviews.length > 0
      ? (
          reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const handlePreviewToko = () => {
    setSelectedBooking(activeBooking);
    setPreviewOpen(true);
  };

  const processFileUpload = async (file) => {
    if (!file) return "";

    const formData = new FormData();
    formData.append("file", file);
    if (session?.user?.id) {
      formData.append("userId", session.user.id);
    }

    const result = await uploadGalleryImageAction(formData);

    if (!result.success) {
      throw new Error(result.error || `Gagal upload ${file.name}`);
    }
    return result.url;
  };

  const handleGalleryUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!activeBooking?.id) {
      toast.error("Booking tidak ditemukan.");
      return;
    }

    setIsUploading(true);

    try {
      const uploadedUrl = await processFileUpload(file);

      const result = await createGalleryAction({
        bookingId: activeBooking.id,
        url: uploadedUrl,
      });

      if (result.success) {
        toast.success("Foto berhasil ditambahkan!");
        queryClient.invalidateQueries({
          queryKey: ["gallery", activeBooking.id],
        });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error(error.message || "Terjadi kesalahan sistem saat upload.");
    } finally {
      setIsUploading(false);
      if (galleryInputRef.current) {
        galleryInputRef.current.value = "";
      }
    }
  };

  const handleDeleteGallery = async (imageId) => {
    try {
      const result = await deleteGalleryAction(imageId);
      if (result.success) {
        toast.success("Gambar dihapus.");
        queryClient.invalidateQueries({
          queryKey: ["gallery", activeBooking.id],
        });
      } else {
        toast.error(result.error);
      }
    } catch (error) {
      toast.error("Gagal menghapus gambar.");
    }
  };

  if (isLoading) {
    return (
      <div className="text-center py-10 text-zinc-400">Loading profile...</div>
    );
  }

  if (!activeBooking) {
    return (
      <div className="text-center py-20 text-zinc-500">
        <p className="mb-4">Anda belum memiliki booking yang aktif.</p>
        <p className="text-sm">
          Booking event terlebih dahulu untuk menampilkan profil toko Anda.
        </p>
      </div>
    );
  }

  return (
    <>
      <Card className="bg-linear-to-br from-zinc-900/90 to-zinc-950/90 border-zinc-800/50 gap-0 overflow-hidden">
        <div className="h-64 w-full relative">
          {activeBooking.banner ? (
            <img
              src={activeBooking.banner || "/placeholder.svg"}
              alt="Banner"
              className="w-full h-full object-cover opacity-40"
            />
          ) : (
            <div className="w-full h-full bg-linear-to-br from-fuchsia-900/20 to-purple-900/20" />
          )}
          <div className="absolute inset-0 bg-linear-to-t from-zinc-950 via-zinc-950/50 to-transparent" />
        </div>
        <CardContent className="relative pt-0 px-8 pb-4 bg-zinc-950">
          <div className="mb-6 flex flex-col md:flex-row items-start md:items-end gap-6">
            <div className="w-40 h-40 rounded-full bg-linear-to-br from-fuchsia-500 to-purple-600 p-1 shadow-2xl -mt-20">
              <div className="w-full h-full rounded-full overflow-hidden bg-black">
                {activeBooking.logo ? (
                  <img
                    src={activeBooking.logo || "/placeholder.svg"}
                    alt="Logo"
                    className="w-full h-full object-cover"
                  />
                ) : session?.user?.avatar ? (
                  <img
                    src={session.user.avatar || "/placeholder.svg"}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-500 bg-zinc-800">
                    {activeBooking.name?.charAt(0) || "T"}
                  </div>
                )}
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-4xl font-bold text-white flex items-center gap-3 mb-3">
                {activeBooking.name}
                <CheckCircle className="w-6 h-6 text-emerald-500" />
              </h2>
              <p className="text-zinc-400 text-lg mb-4">
                {activeBooking.description?.slice(0, 100)}...
              </p>
              <div className="flex flex-wrap gap-2">
                <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50">
                  {getCategoryLabel(activeBooking.category)}
                </Badge>
                {activeBooking.booth?.event && (
                  <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                    {activeBooking.booth.event.location}
                  </Badge>
                )}
                <Badge className="bg-zinc-800 text-zinc-400">
                  {avgRating} Rating
                </Badge>
              </div>
            </div>
            <Button
              size="lg"
              onClick={handlePreviewToko}
              className="bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500"
            >
              <Eye className="w-4 h-4 mr-2" />
              Preview Toko
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-2xl font-bold text-white">Galeri Produk</h3>

            {/* Input dihapus attribut 'multiple' */}
            <input
              ref={galleryInputRef}
              type="file"
              accept="image/*"
              onChange={handleGalleryUpload}
              className="hidden"
            />

            <Button
              variant="outline"
              size="sm"
              onClick={() => galleryInputRef.current?.click()}
              disabled={isUploading}
              className="border-fuchsia-500/30 text-fuchsia-100 bg-fuchsia-600 hover:bg-fuchsia-500 hover:text-white whitespace-nowrap"
            >
              {isUploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Plus className="w-4 h-4 mr-2" />
              )}
              Tambah Foto
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {galleryImages.map((img, i) => (
              <motion.div
                key={img.id || i}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="aspect-square rounded-2xl bg-zinc-900 border border-zinc-800 overflow-hidden group cursor-pointer relative"
              >
                <img
                  src={img.url}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  alt="Product"
                />
                <Button
                  size="icon"
                  variant="destructive"
                  className="absolute top-2 right-2 w-6 h-6 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteGallery(img.id)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </motion.div>
            ))}
            {galleryImages.length === 0 && (
              <div className="col-span-4 py-10 text-center text-zinc-500">
                Belum ada foto produk. Klik &quot;Tambah Foto&quot; untuk
                menambahkan.
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white">Ulasan Terbaru</h3>
          <div className="space-y-4">
            {reviews.length > 0 ? (
              reviews.slice(0, 3).map((review) => (
                <Card
                  key={review.id}
                  className="bg-zinc-900/50 border-zinc-800 p-4"
                >
                  <div className="flex gap-1 text-amber-500 mb-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < review.rating ? "fill-current" : "text-zinc-700"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-zinc-300 text-sm mb-2">
                    &quot;{review.comment}&quot;
                  </p>
                  <p className="text-zinc-500 text-xs">
                    - {review.name || "Anonymous"}
                  </p>
                </Card>
              ))
            ) : (
              <p className="text-zinc-500 text-sm">Belum ada ulasan.</p>
            )}
          </div>
        </div>
      </div>

      <PreviewTokoDialog
        isOpen={previewOpen}
        onClose={() => setPreviewOpen(false)}
        booking={selectedBooking}
        reviews={reviews}
        gallery={galleryImages}
      />
    </>
  );
}
