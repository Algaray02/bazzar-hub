"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Upload, X, Loader2, User, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { uploadAvatarAction } from "@/app/actions/upload-file-actions";
import { InputField } from "../form/input-field";
import { SelectField } from "../form/select-field";

const createUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "SELLER"]),
  avatar: z.string().optional(),
});

const editUserSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  password: z.string().optional(),
  phone: z.string().optional(),
  role: z.enum(["ADMIN", "SELLER"]),
  avatar: z.string().optional(),
});

const roleOptions = [
  { value: "ADMIN", label: "Admin" },
  { value: "SELLER", label: "Seller" },
];

function UpsertUserForm({ defaultValues, onSubmit, onCancel }) {
  const isEdit = !!defaultValues;

  const form = useForm({
    resolver: zodResolver(isEdit ? editUserSchema : createUserSchema),
    defaultValues: {
      name: defaultValues?.name || "",
      email: defaultValues?.email || "",
      password: "",
      phone: defaultValues?.phone || "",
      role: defaultValues?.role || "SELLER",
      avatar: defaultValues?.avatar || "",
    },
  });

  const [avatarFile, setAvatarFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(
    defaultValues?.avatar || ""
  );
  const [uploading, setUploading] = useState(false);
  const [originalAvatar] = useState(defaultValues?.avatar || "");

  const watchName = useWatch({
    control: form.control,
    name: "name",
  });

  const handleAvatarSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const maxSize = 2 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error("File terlalu besar. Maksimal 2MB");
      return;
    }

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format file tidak didukung");
      return;
    }

    setAvatarFile(file);

    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview("");
    form.setValue("avatar", "");
  };

  const handleFormSubmit = async (values) => {
    let avatarUrl = values.avatar;
    if (avatarFile) {
      setUploading(true);
      const uploadFormData = new FormData();
      uploadFormData.append("file", avatarFile);

      const uploadResult = await uploadAvatarAction(uploadFormData);
      setUploading(false);

      if (!uploadResult.success) {
        toast.error(uploadResult.error || "Gagal upload avatar");
        return;
      }

      avatarUrl = uploadResult.url;
    }

    const submitData = {
      name: values.name,
      email: values.email,
      phone: values.phone,
      role: values.role,
      avatar: avatarUrl,
    };

    if (values.password?.trim()) {
      submitData.password = values.password;
    }

    const finalFormData = new FormData();
    Object.entries(submitData).forEach(([key, value]) => {
      if (value) {
        finalFormData.append(key, value);
      }
    });

    if (originalAvatar && avatarUrl !== originalAvatar) {
      finalFormData.append("oldAvatar", originalAvatar);
    }

    onSubmit(finalFormData);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleFormSubmit)}
        className="space-y-4"
      >
        <div className="flex flex-col items-center gap-4 pb-2">
          <Avatar className="h-24 w-24 border-2 border-white/10 ring-2 ring-fuchsia-500/20">
            <AvatarImage src={avatarPreview || "/placeholder.svg"} />
            <AvatarFallback className="bg-linear-to-br from-fuchsia-500/20 to-pink-500/20 text-2xl text-fuchsia-300">
              {watchName?.charAt(0)?.toUpperCase() || "U"}
            </AvatarFallback>
          </Avatar>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-white/10 bg-white/5 hover:bg-zinc-900 text-zinc-300 hover:text-zinc-100"
              onClick={() => document.getElementById("avatar-upload").click()}
              disabled={uploading}
            >
              <Upload className="w-4 h-4 mr-2" />
              {uploading ? "Uploading..." : "Upload Avatar"}
            </Button>

            {avatarPreview && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="border-red-500/50 bg-red-500/10 hover:bg-red-500/20 text-red-400"
                onClick={handleRemoveAvatar}
                disabled={uploading}
              >
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>

          <input
            id="avatar-upload"
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            className="hidden"
            onChange={handleAvatarSelect}
          />
        </div>

        <InputField
          control={form.control}
          name="name"
          label="Nama Lengkap"
          placeholder="Masukkan nama lengkap"
          icon={User}
          disabled={uploading}
        />

        <InputField
          control={form.control}
          name="email"
          label="Email"
          type="email"
          placeholder="user@example.com"
          icon={Mail}
          disabled={isEdit || uploading}
        />

        <InputField
          control={form.control}
          name="phone"
          label="No. Telepon (Opsional)"
          type="tel"
          placeholder="+62 812 3456 7890"
          icon={Phone}
          disabled={uploading}
        />

        <SelectField
          control={form.control}
          name="role"
          label="Role"
          placeholder="Pilih role"
          options={roleOptions}
          disabled={uploading}
        />

        <div className="flex gap-3 pt-6">
          <Button
            type="button"
            variant="outline"
            onClick={onCancel}
            className="flex-1 border-white/10 bg-white/5 hover:bg-zinc-900 text-zinc-300 hover:text-zinc-100"
            disabled={uploading}
          >
            Batal
          </Button>
          <Button
            type="submit"
            className="flex-1 bg-linear-to-r from-fuchsia-600 to-pink-600 hover:from-fuchsia-500 hover:to-pink-500 hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] text-white transition-all duration-300"
            disabled={uploading || form.formState.isSubmitting}
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading Avatar...
              </>
            ) : form.formState.isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>{isEdit ? "Update User" : "Buat User"}</>
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export function UpsertUserDialog({
  open,
  onOpenChange,
  onSubmit,
  defaultValues,
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-[#0F0F11] border-white/10 text-white sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-linear-to-r from-fuchsia-400 to-pink-400 bg-clip-text text-transparent">
            {defaultValues ? "Edit User" : "Buat User Baru"}
          </DialogTitle>
        </DialogHeader>

        <UpsertUserForm
          key={defaultValues?.id || "new"}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
}