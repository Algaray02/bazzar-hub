"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Plus,
  Trash2,
  Clock,
  HelpCircle,
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import { InputField } from "../form/input-field";
import { SelectField } from "../form/select-field";
import { DateField } from "../form/date-field";
import { TextareaField } from "../form/textarea-field";
import { ImageUploadField } from "../form/image-upload-field";
import { HIGHLIGHT_OPTIONS } from "@/constant/highlights";
import { CITIES_OPTIONS, getCityValue } from "@/constant/cities";
import { eventSchema } from "@/lib/validators/event";
import { generateEventDescriptionAction } from "@/app/actions/ai-actions";

const DEFAULT_VALUES = {
  title: "",
  type: "WEEKLY",
  location: "",
  city: "JAKARTA",
  time: "",
  organizer: "",
  image: "",
  description: "",
  highlights: [],
  rundown: [],
  faq: [],
};

export function UpsertEventDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isSubmitting,
}) {
  const [isGenerating, setIsGenerating] = useState(false);
  const form = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: DEFAULT_VALUES,
  });

  const {
    fields: rundownFields,
    append: appendRundown,
    remove: removeRundown,
  } = useFieldArray({
    control: form.control,
    name: "rundown",
  });

  const {
    fields: faqFields,
    append: appendFaq,
    remove: removeFaq,
  } = useFieldArray({
    control: form.control,
    name: "faq",
  });

  useEffect(() => {
    if (!open) return;

    if (defaultValues) {
      form.reset({
        ...defaultValues,
        city: getCityValue(defaultValues.city),
        organizer: defaultValues.organizer?.name ?? "",
        date: new Date(defaultValues.date),
        highlights: defaultValues.highlights || [],
        rundown: defaultValues.rundown || [],
        faq: defaultValues.faq || [],
      });
    } else {
      form.reset(DEFAULT_VALUES);
    }
  }, [open, defaultValues, form]);

  const handleGenerateDescription = async () => {
    const title = form.getValues("title");
    const city = form.getValues("city");
    const type = form.getValues("type");

    if (!title) {
      toast.error("Mohon isi Judul Event terlebih dahulu");
      return;
    }

    setIsGenerating(true);
    try {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("city", city);
      formData.append("type", type);

      const result = await generateEventDescriptionAction(formData);

      if (result.success) {
        form.setValue("description", result.description, {
          shouldValidate: true,
        });
        toast.success("Deskripsi event berhasil dibuat!");
      } else {
        toast.error("Gagal generate deskripsi event");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan saat generate AI");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0F0F11] border-white/10 text-white sm:max-w-[700px] h-[90vh] flex flex-col px-6 py-3">
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle>
            {defaultValues ? "Edit Event" : "Buat Event Baru"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="event-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex-1 overflow-y-auto pr-1 space-y-5 mt-2 scrollbar-thin scrollbar-thumb-zinc-800"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <InputField
                  control={form.control}
                  name="title"
                  label="Judul Event"
                  placeholder="Jakarta Creative Week"
                />
              </div>

              <SelectField
                control={form.control}
                name="type"
                label="Tipe Event"
                options={[
                  { label: "Mingguan", value: "WEEKLY" },
                  { label: "Special", value: "SPECIAL" },
                ]}
              />

              <SelectField
                control={form.control}
                name="city"
                label="Kota"
                options={CITIES_OPTIONS}
              />

              <InputField
                control={form.control}
                name="time"
                label="Waktu"
                placeholder="10:00 - 22:00 WIB"
              />

              <DateField control={form.control} name="date" label="Tanggal" />

              <div className="col-span-2">
                <InputField
                  control={form.control}
                  name="location"
                  label="Lokasi"
                  placeholder="Senayan City"
                />
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-4">
              <InputField
                control={form.control}
                name="organizer"
                label="Penyelenggara"
                placeholder="Nama Organizer"
              />
              <ImageUploadField
                control={form.control}
                name="image"
                label="URL Banner"
                placeholder="Upload banner event"
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <FormLabel className="text-sm font-medium text-white">
                    Deskripsi Event
                  </FormLabel>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleGenerateDescription}
                    disabled={isGenerating}
                    className="h-6 px-2 text-xs text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-500/10"
                  >
                    {isGenerating ? (
                      <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    ) : (
                      <Sparkles className="w-3 h-3 mr-1" />
                    )}
                    Generate AI
                  </Button>
                </div>
                <TextareaField
                  control={form.control}
                  name="description"
                  placeholder="Deskripsi singkat tentang event ini (Manual atau AI)"
                />
              </div>

              <div className="space-y-3">
                <FormLabel className="text-xs font-medium text-zinc-500 uppercase tracking-wider ml-1">
                  Highlights
                </FormLabel>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 border border-white/20 rounded-xl bg-black">
                  {HIGHLIGHT_OPTIONS.map((item) => (
                    <FormField
                      key={item.value}
                      control={form.control}
                      name="highlights"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value?.includes(item.value)}
                              onCheckedChange={(checked) => {
                                return checked
                                  ? field.onChange([...field.value, item.value])
                                  : field.onChange(
                                      field.value?.filter(
                                        (v) => v !== item.value
                                      )
                                    );
                              }}
                              className="border-white/20 data-[state=checked]:bg-fuchsia-600 data-[state=checked]:border-fuchsia-600"
                            />
                          </FormControl>
                          <FormLabel className="font-normal text-sm cursor-pointer text-zinc-300 hover:text-white">
                            {item.label}
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-fuchsia-400">
                  <Clock className="w-4 h-4" /> Rundown
                </h4>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendRundown({ time: "", activity: "" })}
                  className="h-8 bg-black hover:bg-zinc-900 hover:text-zinc-400 border-zinc-700"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah
                </Button>
              </div>

              {rundownFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex gap-2 items-end animate-in fade-in"
                >
                  <div className="w-24">
                    <InputField
                      control={form.control}
                      name={`rundown.${index}.time`}
                      placeholder="08:00"
                    />
                  </div>
                  <div className="flex-1">
                    <InputField
                      control={form.control}
                      name={`rundown.${index}.activity`}
                      placeholder="Kegiatan..."
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeRundown(index)}
                    className="border border-red-900/50 hover:bg-red-950/50 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>

            <Separator className="bg-white/10" />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-semibold flex items-center gap-2 text-fuchsia-400">
                  <HelpCircle className="w-4 h-4" /> FAQ
                </h4>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => appendFaq({ q: "", a: "" })}
                  className="h-8 bg-black hover:bg-zinc-900 hover:text-zinc-400 border-zinc-700"
                >
                  <Plus className="w-3 h-3 mr-1" /> Tambah
                </Button>
              </div>

              {faqFields.map((field, index) => (
                <div
                  key={field.id}
                  className="flex items-start gap-3 p-4 border border-white/10 rounded-lg bg-white/5 animate-in fade-in"
                >
                  <div className="flex flex-col gap-3 flex-1">
                    <InputField
                      control={form.control}
                      name={`faq.${index}.q`}
                      placeholder="Pertanyaan (Q)"
                    />
                    <InputField
                      control={form.control}
                      name={`faq.${index}.a`}
                      placeholder="Jawaban (A)"
                    />
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={() => removeFaq(index)}
                    className="mt-1 border border-red-900/50 hover:bg-red-950/50 text-red-500"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </form>
        </Form>

        <DialogFooter className="p-6 border-t border-white/10 bg-[#0F0F11]">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Batal
          </Button>
          <Button
            type="submit"
            form="event-form"
            disabled={isSubmitting}
            className="bg-linear-to-r from-fuchsia-600 to-pink-600 border-0"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : defaultValues ? (
              "Simpan Perubahan"
            ) : (
              "Buat Event"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
