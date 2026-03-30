"use client";

import { useState, useRef, useEffect } from "react";
import { Settings, LogOut, CheckCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { uploadAvatarAction } from "@/app/actions/upload-file-actions";
import { updateProfileAction } from "@/app/actions/user-actions";
import { toast } from "sonner";

export function SettingsDialog({
  isOpen,
  onClose,
  handleLogout,
  currentUser,
  onUpdateSuccess,
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const avatarInputRef = useRef(null);

  const [form, setForm] = useState({
    name: "",
    phone: "",
    avatar: "",
    avatarPreview: "",
    oldAvatar: "",
    email: "",
  });

  useEffect(() => {
    if (currentUser) {
      setForm({
        name: currentUser.name || "",
        phone: currentUser.phone || "",
        avatar: currentUser.avatar || "",
        avatarPreview: currentUser.avatar || "",
        oldAvatar: currentUser.avatar || "",
        email: currentUser.email || "",
      });
    }
  }, [currentUser]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const reader = new FileReader();
      reader.onload = (ev) => handleChange("avatarPreview", ev.target?.result);
      reader.readAsDataURL(file);

      const formData = new FormData();
      formData.set("file", file);
      formData.set("userId", currentUser?.id || "");

      const result = await uploadAvatarAction(formData);
      if (result.success) {
        handleChange("avatar", result.url);
        toast.success("Avatar berhasil diupload");
      } else {
        toast.error(result.error || "Gagal upload avatar");
      }
    } catch (err) {
      toast.error("Gagal upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.set("name", form.name);
      formData.set("phone", form.phone);
      formData.set("avatar", form.avatar);
      formData.set("oldAvatar", form.oldAvatar);

      const result = await updateProfileAction(formData);

      if (result.success) {
        toast.success(result.message || "Profile berhasil diupdate");
        if (onUpdateSuccess) {
          onUpdateSuccess();
        }
        onClose();
      } else {
        toast.error(result.error || "Gagal update profile");
      }
    } catch {
      toast.error("Terjadi kesalahan saat update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="bg-zinc-950 border-zinc-800 text-white max-w-xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-2xl">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-fuchsia-600 to-purple-600 flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            Pengaturan Profil
          </DialogTitle>
          <DialogDescription className="text-zinc-400">
            Kelola informasi profil akun Anda
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-8 py-6">
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-fuchsia-400 uppercase tracking-wider">
              Foto Profil
            </h3>

            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-full overflow-hidden bg-zinc-900 border border-zinc-800">
                {form.avatarPreview ? (
                  <img
                    src={form.avatarPreview}
                    alt="Avatar"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-500 bg-zinc-800">
                    {form.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                className="border-white text-zinc-900 hover:bg-white/90 hover:text-black"
                onClick={() => avatarInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Mengupload...
                  </>
                ) : (
                  "Upload Foto"
                )}
              </Button>

              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-fuchsia-400 uppercase tracking-wider">
              Informasi Dasar
            </h3>

            <div className="grid gap-4">
              <div className="space-y-2">
                <Label className="text-zinc-300">Nama Lengkap</Label>
                <Input
                  value={form.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                  className="bg-zinc-900/50 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Email</Label>
                <Input
                  value={form.email}
                  disabled
                  className="bg-zinc-900/50 border-zinc-800 text-zinc-500 cursor-not-allowed"
                />
                <p className="text-xs text-zinc-500">
                  Email tidak dapat diubah
                </p>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Nomor Telepon</Label>
                <Input
                  value={form.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="bg-zinc-900/50 border-zinc-800 text-white"
                />
              </div>
            </div>
          </div>

          <Separator className="bg-zinc-800" />

          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-red-400 uppercase tracking-wider">
              Danger Zone
            </h3>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-red-400 hover:text-red-300 hover:bg-red-500/10 w-full justify-start"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Keluar dari Akun
            </Button>
          </div>
        </div>

        <DialogFooter className="gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-white text-zinc-900 hover:bg-white/90 hover:text-black"
          >
            Batal
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || isUploading}
            className="bg-linear-to-r from-fuchsia-600 to-purple-600"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Menyimpan...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
