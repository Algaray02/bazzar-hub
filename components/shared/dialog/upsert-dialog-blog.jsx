"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { uploadPostImageAction } from "@/app/actions/upload-file-actions";

export function UpsertBlogDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
  isSubmitting = false,
}) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(defaultValues?.image || "");
  const [uploading, setUploading] = useState(false);

  const handleImageSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File terlalu besar. Maksimal 2MB");
      return;
    }

    setImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData();

    formData.append("title", form.title.value);
    formData.append("slug", form.slug.value);
    formData.append("category", form.category.value);
    formData.append("excerpt", form.excerpt.value);
    formData.append("content", form.content.value);
    formData.append("published", form.published.checked ? "true" : "false");

    let imageUrl = defaultValues?.image || "";
    if (imageFile) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", imageFile);

      const uploadResult = await uploadPostImageAction(uploadFormData);
      setUploading(false);

      if (!uploadResult.success) {
        toast.error(uploadResult.error || "Gagal upload gambar");
        return;
      }

      imageUrl = uploadResult.url;
    }

    formData.append("image", imageUrl);

    if (defaultValues?.image && imageUrl !== defaultValues.image) {
      formData.append("oldImage", defaultValues.image);
    }

    if (defaultValues?.id) {
      formData.append("id", defaultValues.id);
    }

    onSubmit(formData);
  };

  const isPending = isSubmitting || uploading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0F0F11] border-white/10 text-white sm:max-w-[800px] h-[90vh] flex flex-col px-6 py-3">
        <DialogHeader className="p-6 border-b border-white/10">
          <DialogTitle className="text-xl font-bold">
            {defaultValues ? "Edit Artikel" : "Tulis Artikel Baru"}
          </DialogTitle>
        </DialogHeader>
        <form
          id="upsert-blog-form"
          onSubmit={handleSubmit}
          className="flex-1 overflow-y-auto pr-1 space-y-5 mt-2"
        >
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="title" className="text-zinc-400">
                Judul Artikel
              </Label>
              <Input
                id="title"
                name="title"
                defaultValue={defaultValues?.title}
                placeholder="Contoh: Tips Sukses Bazar 2025"
                className="bg-white/5 border-white/10 text-white"
                required
                disabled={isPending}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug" className="text-zinc-400">
                Slug URL
              </Label>
              <Input
                id="slug"
                name="slug"
                defaultValue={defaultValues?.slug}
                placeholder="tips-sukses-bazar-2025"
                className="bg-white/5 border-white/10 text-white"
                required
                disabled={isPending}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label className="text-zinc-400">Kategori</Label>
              <Select
                name="category"
                defaultValue={defaultValues?.category || "NEWS"}
                disabled={isPending}
              >
                <SelectTrigger className="w-full bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Pilih Kategori" />
                </SelectTrigger>
                <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                  <SelectItem value="NEWS">Berita</SelectItem>
                  <SelectItem value="TIPS">Tips & Trik</SelectItem>
                  <SelectItem value="HIGHLIGHT">Highlight Event</SelectItem>
                  <SelectItem value="STORY">Story</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-zinc-400">Gambar Cover</Label>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="border-white/10 bg-white/5 hover:bg-zinc-900 text-zinc-300"
                  onClick={() =>
                    document.getElementById("image-upload").click()
                  }
                  disabled={isPending}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {uploading ? "Uploading..." : "Upload Gambar"}
                </Button>
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                    onClick={handleRemoveImage}
                    disabled={isPending}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              <input
                id="image-upload"
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                className="hidden"
                onChange={handleImageSelect}
              />
              {imagePreview && (
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="mt-2 h-24 w-auto rounded-lg border border-white/10 object-cover"
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="excerpt" className="text-zinc-400">
              Ringkasan (Excerpt)
            </Label>
            <Textarea
              id="excerpt"
              name="excerpt"
              defaultValue={defaultValues?.excerpt}
              placeholder="Penjelasan singkat tentang artikel..."
              className="bg-white/5 border-white/10 text-white h-20"
              required
              disabled={isPending}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="content" className="text-zinc-400">
              Konten Lengkap
            </Label>
            <Textarea
              id="content"
              name="content"
              defaultValue={defaultValues?.content}
              placeholder="Tulis konten artikel di sini..."
              className="bg-white/5 border-white/10 text-white min-h-[300px] font-mono text-sm"
              required
              disabled={isPending}
            />
          </div>

          <div className="flex items-center justify-between p-4 rounded-lg border border-white/10 bg-white/5">
            <div className="space-y-0.5">
              <Label className="text-base text-white">Status Publikasi</Label>
              <p className="text-sm text-zinc-500">
                Aktifkan untuk menayangkan artikel ini ke publik.
              </p>
            </div>
            <Switch
              name="published"
              defaultChecked={defaultValues?.published}
              className="data-[state=checked]:bg-fuchsia-600"
              disabled={isPending}
            />
          </div>
        </form>
        <DialogFooter className="p-6 border-t border-white/10 bg-[#0F0F11]">
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
            form="upsert-blog-form"
            className="bg-linear-to-r from-fuchsia-600 to-pink-600 text-white border-none shadow-lg shadow-fuchsia-500/20"
            disabled={isPending}
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                {uploading ? "Uploading..." : "Menyimpan..."}
              </>
            ) : defaultValues ? (
              "Simpan Perubahan"
            ) : (
              "Publikasikan"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}