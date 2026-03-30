"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import {
  ShoppingBag,
  CreditCard,
  Upload,
  CheckCircle,
  Store,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { CATEGORY_OPTIONS } from "@/constant/category-store";
import { createBookingAction } from "@/app/actions/booking-actions";
import { generateShopDescriptionAction } from "@/app/actions/ai-actions";
import {
  uploadBookingLogoAction,
  uploadBookingBannerAction,
  uploadPaymentProofAction,
} from "@/app/actions/upload-file-actions";
import { ImageUploadField } from "../form/image-upload-field";
import { Form } from "@/components/ui/form";
import { InputField } from "../form/input-field";
import { SelectField } from "../form/select-field";
import { TextareaField } from "../form/textarea-field";
import { bookingSchema } from "@/lib/validators/booking";

const STEPS = [
  { id: 1, title: "Detail Toko", icon: Store },
  { id: 2, title: "Pembayaran QRIS", icon: CreditCard },
  { id: 3, title: "Upload Bukti", icon: Upload },
];

const DEFAULT_VALUES = {
  name: "",
  category: "FOOD_BEVERAGE",
  description: "",
  logo: undefined,
  banner: undefined,
  paymentProof: undefined,
};

export function BookingDialog({ isOpen, event, onClose, onSubmit }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const { data: session } = useSession();

  const availableBooth = event?.booths?.find((b) => !b.booking);
  const boothPrice = availableBooth?.price || event?.price || 0;

  const form = useForm({
    resolver: zodResolver(bookingSchema),
    defaultValues: DEFAULT_VALUES,
    mode: "onChange",
  });

  const {
    handleSubmit,
    trigger,
    formState: { isSubmitting },
    reset,
    getValues,
    setValue,
    control,
  } = form;

  useEffect(() => {
    if (isOpen) {
      reset(DEFAULT_VALUES);
      setCurrentStep(1);
    }
  }, [isOpen, reset]);

  const handleClose = () => {
    reset(DEFAULT_VALUES);
    setCurrentStep(1);
    onClose();
  };

  const handleNextStep = async (e) => {
    e.preventDefault();
    if (currentStep === 1) {
      const isValid = await trigger(["name", "category", "description"]);
      if (!isValid) return;
    }
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleGenerateDescription = async () => {
    const name = getValues("name");
    const category = getValues("category");

    if (!name || !category) {
      toast.warning("Mohon isi Nama Toko dan Kategori terlebih dahulu.");
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("category", category);

      const result = await generateShopDescriptionAction(formData);

      if (result.success) {
        setValue("description", result.description, { shouldValidate: true });
        toast.success("Deskripsi berhasil dibuat!");
      } else {
        toast.error(result.error || "Gagal membuat deskripsi.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsGenerating(false);
    }
  };

  const processFileUpload = async (file, action) => {
    if (!file) return "";
    if (typeof file === "string") return file;

    const formData = new FormData();
    formData.append("file", file);
    if (session?.user?.id) {
      formData.append("userId", session.user.id);
    }

    const result = await action(formData);
    if (!result.success) {
      throw new Error(result.error || "Gagal mengupload file");
    }
    return result.url;
  };

  const onFormSubmit = async (data) => {
    if (!availableBooth?.id) {
      toast.error("Sold Out", {
        description: "Maaf, tidak ada booth yang tersedia saat ini.",
      });
      return;
    }

    try {
      const [logoUrl, bannerUrl, paymentProofUrl] = await Promise.all([
        processFileUpload(data.logo, uploadBookingLogoAction),
        processFileUpload(data.banner, uploadBookingBannerAction),
        processFileUpload(data.paymentProof, uploadPaymentProofAction),
      ]);

      const formData = new FormData();
      formData.set("boothId", availableBooth.id);
      formData.set("name", data.name);
      formData.set("category", data.category);
      formData.set("description", data.description);
      formData.set("logo", logoUrl || "");
      formData.set("banner", bannerUrl || "");
      formData.set("paymentProof", paymentProofUrl || "");

      const result = await createBookingAction(formData);

      if (result.success) {
        toast.success("Booking berhasil dibuat!");
        onSubmit?.(result.data);
        handleClose();
      } else {
        toast.error(result.error || "Gagal membuat booking.");
      }
    } catch (error) {
      toast.error(error.message || "Terjadi kesalahan sistem.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold flex items-center gap-2">
            <ShoppingBag className="w-6 h-6 text-fuchsia-500" />
            Booking Booth
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Event:{" "}
            <span className="text-fuchsia-400 font-semibold">
              {event?.title}
            </span>
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center justify-center gap-2 py-4">
          {STEPS.map((step, index) => (
            <div key={step.id} className="flex items-center">
              <motion.div
                initial={false}
                animate={{
                  backgroundColor:
                    currentStep >= step.id ? "#c026d3" : "#27272a",
                  scale: currentStep === step.id ? 1.1 : 1,
                }}
                className="w-10 h-10 rounded-full flex items-center justify-center"
              >
                {currentStep > step.id ? (
                  <CheckCircle className="w-5 h-5 text-white" />
                ) : (
                  <step.icon className="w-5 h-5 text-white" />
                )}
              </motion.div>
              {index < STEPS.length - 1 && (
                <div
                  className={`w-12 h-1 mx-2 rounded ${
                    currentStep > step.id ? "bg-fuchsia-600" : "bg-zinc-800"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="text-center mb-2">
          <p className="text-sm text-zinc-400">
            Step {currentStep}: {STEPS[currentStep - 1].title}
          </p>
        </div>

        <Form {...form}>
          <form
            id="booking-form"
            onSubmit={handleSubmit(onFormSubmit)}
            className="flex-1 space-y-4"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
                className="py-2"
              >
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <InputField
                      control={control}
                      name="name"
                      label="Nama Toko *"
                      placeholder="Contoh: Kopi Kenangan Mini"
                    />

                    <SelectField
                      control={control}
                      name="category"
                      label="Kategori Toko *"
                      placeholder="Pilih Kategori"
                      options={CATEGORY_OPTIONS}
                    />

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-white">
                          Deskripsi Toko *
                        </span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={handleGenerateDescription}
                          disabled={isGenerating}
                          className="h-6 px-2 text-xs text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-500/10 border border-fuchsia-500/30"
                        >
                          {isGenerating ? (
                            <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                          ) : (
                            <Sparkles className="w-3 h-3 mr-1" />
                          )}
                          {isGenerating ? "Creating..." : "Magic Write ✨"}
                        </Button>
                      </div>
                      <TextareaField
                        control={control}
                        name="description"
                        placeholder="Deskripsi toko..."
                        className="min-h-[100px]"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <ImageUploadField
                        control={control}
                        name="logo"
                        label="Logo Toko (Opsional)"
                        placeholder="Upload logo"
                      />
                      <ImageUploadField
                        control={control}
                        name="banner"
                        label="Banner Toko (Opsional)"
                        placeholder="Upload banner"
                      />
                    </div>
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-6">
                    <div className="bg-fuchsia-950/20 border border-fuchsia-500/20 rounded-xl p-6 text-center">
                      <p className="text-sm text-fuchsia-300 mb-2">
                        Total Biaya Booking
                      </p>
                      <p className="text-4xl font-bold text-white">
                        Rp {boothPrice.toLocaleString("id-ID")}
                      </p>
                    </div>

                    <div className="bg-white rounded-2xl p-2 mx-auto max-w-xs shadow-xl">
                      <img
                        src="/qris-payment-code.jpeg"
                        alt="QRIS Payment"
                        className="w-full h-auto"
                      />
                    </div>

                    <div className="text-center space-y-2">
                      <p className="text-zinc-300 font-medium">
                        Scan QRIS di atas untuk pembayaran
                      </p>
                      <p className="text-sm text-zinc-500">
                        Setelah pembayaran berhasil, lanjutkan ke langkah
                        berikutnya.
                      </p>
                    </div>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <span className="text-zinc-400">Total Dibayar</span>
                        <span className="text-xl font-bold text-white">
                          Rp {boothPrice.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>

                    <ImageUploadField
                      control={control}
                      name="paymentProof"
                      label="Upload Bukti Pembayaran *"
                      placeholder="Klik untuk upload bukti transfer"
                    />

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4">
                      <p className="text-blue-400 text-sm text-center">
                        Bukti pembayaran akan diverifikasi oleh admin dalam 1x24
                        jam.
                      </p>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </form>
        </Form>

        <DialogFooter className="gap-3 pt-4 border-t border-zinc-800">
          {currentStep > 1 && (
            <Button
              type="button"
              variant="outline"
              onClick={handlePrevStep}
              disabled={isSubmitting}
              className="border-zinc-700 bg-zinc-900 hover:bg-zinc-800 text-zinc-300!"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali
            </Button>
          )}

          {currentStep < 3 ? (
            <Button
              type="button"
              onClick={handleNextStep}
              className="flex-1 bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white border-0"
            >
              Lanjutkan
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button
              type="submit"
              form="booking-form"
              disabled={isSubmitting}
              className="flex-1 bg-linear-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white border-0"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Konfirmasi Booking
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
