"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Layers, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Form } from "@/components/ui/form";
import { InputField } from "@/components/shared/form/input-field";

const generateSchema = z.object({
  quantity: z.coerce.number().min(1, "Minimal 1 booth"),
  price: z.coerce.number().min(1000, "Harga tidak valid"),
});

export function GenerateBoothDialog({
  open,
  onOpenChange,
  onGenerate,
  isPending,
}) {
  const form = useForm({
    resolver: zodResolver(generateSchema),
    defaultValues: {
      quantity: 10,
      price: 500000,
    },
  });

  const handleSubmit = (data) => {
    onGenerate(data);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0F0F11] border-white/10 text-white sm:max-w-[400px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-fuchsia-500" />
            Generate Booths
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form
            id="generate-form"
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4 py-4"
          >
            <InputField
              control={form.control}
              name="quantity"
              label="Jumlah Booth (Limit)"
              type="number"
              placeholder="Total kuota booth"
            />
            <InputField
              control={form.control}
              name="price"
              label="Harga per Booth"
              type="number"
              placeholder="Rp 500.000"
            />
          </form>
        </Form>

        <DialogFooter>
          <DialogClose asChild>
            <Button
              variant="ghost"
              className="text-zinc-400 hover:text-white hover:bg-white/5"
              disabled={isPending}
            >
              Batal
            </Button>
          </DialogClose>
          <Button
            type="submit"
            form="generate-form"
            disabled={isPending}
            className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
          >
            {isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Generate"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}