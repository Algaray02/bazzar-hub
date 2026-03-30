"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Star, Send, Loader2, Store } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { TextareaField } from "../form/textarea-field";
import { reviewSchema } from "@/lib/validators/review";

export function ReviewDialog({ isOpen, onOpenChange, booking, onSubmit }) {
  const [hoverRating, setHoverRating] = useState(0);

  const form = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      rating: 0,
      comment: "",
    },
  });

  const {
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { isSubmitting, errors },
  } = form;

  const currentRating = watch("rating");

  // Reset form ketika dialog dibuka/ditutup
  useEffect(() => {
    if (isOpen) {
      reset({ rating: 0, comment: "" });
      setHoverRating(0);
    }
  }, [isOpen, reset]);

  const onFormSubmit = async (data) => {
    try {
      await onSubmit({ ...data, bookingId: booking.id });
      onOpenChange(false);
    } catch (error) {
      toast.error("Gagal mengirim ulasan");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0F0F11] border-white/10 text-white sm:max-w-[500px]">
        <DialogHeader className="text-center sm:text-center items-center">
          <div className="w-16 h-16 rounded-2xl bg-zinc-800 overflow-hidden border border-white/10 mb-4 shadow-lg shadow-fuchsia-500/10">
            {booking?.logo ? (
              <img
                src={booking.logo}
                alt={booking.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-zinc-600">
                <Store className="w-8 h-8" />
              </div>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold">
            Bagaimana pengalamanmu?
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Berikan rating dan ulasan untuk <br />
            <span className="text-fuchsia-400 font-semibold text-lg">
              {booking?.name || "Tenant ini"}
            </span>
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={handleSubmit(onFormSubmit)}
            className="space-y-6 py-2"
          >
            {/* --- STAR RATING INPUT --- */}
            <div className="space-y-2">
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <motion.button
                    key={star}
                    type="button"
                    whileHover={{ scale: 1.2 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() =>
                      setValue("rating", star, { shouldValidate: true })
                    }
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="focus:outline-none transition-colors duration-200"
                  >
                    <Star
                      className={`w-10 h-10 ${
                        star <= (hoverRating || currentRating)
                          ? "fill-yellow-400 text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]"
                          : "text-zinc-700 fill-zinc-900"
                      }`}
                    />
                  </motion.button>
                ))}
              </div>
              {errors.rating && (
                <p className="text-center text-sm text-red-500 animate-pulse">
                  {errors.rating.message}
                </p>
              )}
            </div>

            {/* --- COMMENT TEXTAREA (Using your component) --- */}
            <div className="space-y-2 px-2">
              <TextareaField
                control={form.control}
                name="comment"
                label="Ulasan Anda"
                placeholder="Ceritakan pengalaman anda jajan disini, rasa makanan, pelayanan, dll..."
                rows={4}
              />
            </div>

            <DialogFooter className="sm:justify-center">
              <Button
                type="submit"
                disabled={isSubmitting || currentRating === 0}
                className="w-full bg-linear-to-r from-fuchsia-600 to-pink-600 hover:shadow-[0_0_20px_rgba(217,70,239,0.3)] text-white border-0 h-12 rounded-xl text-base font-semibold"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Mengirim...
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 mr-2" />
                    Kirim Ulasan
                  </>
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
