"use client";

import { useState } from "react";
import {
  User,
  Lock,
  Bell,
  Globe,
  Shield,
  Save,
  LogOut,
  Smartphone,
  Mail,
  HardDrive,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Textarea } from "@/components/ui/textarea";

const AdminSettings = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1000);
    console.log("Save");
  };

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div>
        <h1 className="text-3xl font-bold text-white tracking-tight mb-2">
          Pengaturan Admin
        </h1>
        <p className="text-zinc-400">
          Kelola preferensi akun dan konfigurasi sistem global.
        </p>
      </div>

      <Tabs defaultValue="account" className="space-y-6">
        <TabsList className="bg-[#0F0F11] border border-white/10 p-1 h-auto w-full md:w-auto flex-wrap justify-start">
          <TabsTrigger
            value="account"
            className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white text-zinc-400"
          >
            <User className="w-4 h-4 mr-2" /> Akun
          </TabsTrigger>
          <TabsTrigger
            value="system"
            className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white text-zinc-400"
          >
            <Globe className="w-4 h-4 mr-2" /> Sistem
          </TabsTrigger>
          <TabsTrigger
            value="notifications"
            className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white text-zinc-400"
          >
            <Bell className="w-4 h-4 mr-2" /> Notifikasi
          </TabsTrigger>
          <TabsTrigger
            value="security"
            className="data-[state=active]:bg-fuchsia-600 data-[state=active]:text-white text-zinc-400"
          >
            <Shield className="w-4 h-4 mr-2" /> Keamanan
          </TabsTrigger>
        </TabsList>

        <TabsContent value="account" className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/10 py-6">
            <CardHeader>
              <CardTitle className="text-white">Profil Saya</CardTitle>
              <CardDescription className="text-zinc-500">
                Informasi publik yang akan dilihat oleh pengguna lain.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-col md:flex-row items-center gap-6">
                <Avatar className="w-24 h-24 border-2 border-white/10">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AD</AvatarFallback>
                </Avatar>
                <div className="space-y-2 text-center md:text-left">
                  <Button className="bg-white/70 hover:bg-white/80 text-neutral-900">
                    Ganti Foto
                  </Button>
                  <p className="text-xs text-zinc-500">
                    JPG, GIF or PNG. Max size of 800K
                  </p>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Nama Lengkap</Label>
                  <Input
                    defaultValue="Admin System"
                    className="bg-black/50 border-white/10 text-white focus-visible:ring-fuchsia-500"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-300">Email</Label>
                  <Input
                    defaultValue="admin@bazarhub.com"
                    disabled
                    className="bg-white/5 border-white/10 text-zinc-500 cursor-not-allowed"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label className="text-zinc-300">Bio Singkat</Label>
                  <Textarea
                    className="bg-black/50 border-white/10 text-white focus-visible:ring-fuchsia-500 min-h-[100px]"
                    defaultValue="Lead Administrator for BazarHub Platform."
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 px-6 py-4 flex justify-end">
              <Button
                onClick={handleSave}
                disabled={isLoading}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
              >
                {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="system" className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/10 py-6">
            <CardHeader>
              <CardTitle className="text-white">Konfigurasi Umum</CardTitle>
              <CardDescription className="text-zinc-500">
                Pengaturan global aplikasi BazarHub.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base text-white">
                      Maintenance Mode
                    </Label>
                    <p className="text-sm text-zinc-500">
                      Aktifkan untuk menutup akses publik sementara.
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-fuchsia-600"
                  />
                </div>
                <div className="flex items-center justify-between rounded-lg border border-white/5 bg-white/5 p-4">
                  <div className="space-y-0.5">
                    <Label className="text-base text-white">
                      Registrasi Seller Baru
                    </Label>
                    <p className="text-sm text-zinc-500">
                      Izinkan pengguna baru mendaftar sebagai seller.
                    </p>
                  </div>
                  <Switch
                    defaultChecked
                    className="data-[state=checked]:bg-fuchsia-600"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-zinc-300">Biaya Platform (Fee %)</Label>
                <div className="relative w-32">
                  <Input
                    type="number"
                    defaultValue="5"
                    className="bg-black/50 border-white/10 text-white pr-8 focus-visible:ring-fuchsia-500"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">
                    %
                  </span>
                </div>
                <p className="text-xs text-zinc-500">
                  Persentase potongan admin dari setiap transaksi booking.
                </p>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 px-6 py-4 flex justify-end">
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">
                Update Konfigurasi
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/10 py-6">
            <CardHeader>
              <CardTitle className="text-white">
                Preferensi Notifikasi
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Pilih bagaimana Anda ingin menerima pembaruan.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Mail className="w-4 h-4 text-fuchsia-500" /> Notifikasi Email
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300 font-normal">
                      Booking Baru Masuk
                    </Label>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-fuchsia-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300 font-normal">
                      Pendaftaran Seller Baru
                    </Label>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-fuchsia-600"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300 font-normal">
                      Laporan Bulanan
                    </Label>
                    <Switch className="data-[state=checked]:bg-fuchsia-600" />
                  </div>
                </div>
              </div>

              <Separator className="bg-white/5" />

              <div className="space-y-4">
                <h3 className="text-sm font-medium text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-fuchsia-500" /> Push
                  Notification
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300 font-normal">
                      Pemberitahuan Sistem Penting
                    </Label>
                    <Switch
                      defaultChecked
                      disabled
                      className="data-[state=checked]:bg-fuchsia-600 opacity-50"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label className="text-zinc-300 font-normal">
                      Komentar/Review Baru
                    </Label>
                    <Switch
                      defaultChecked
                      className="data-[state=checked]:bg-fuchsia-600"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/10 py-6">
            <CardHeader>
              <CardTitle className="text-white">Keamanan Akun</CardTitle>
              <CardDescription className="text-zinc-500">
                Update password dan amankan akun Anda.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-300">Password Saat Ini</Label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="bg-black/50 border-white/10 text-white focus-visible:ring-fuchsia-500"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Password Baru</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-fuchsia-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-zinc-300">Konfirmasi Password</Label>
                    <Input
                      type="password"
                      placeholder="••••••••"
                      className="bg-black/50 border-white/10 text-white focus-visible:ring-fuchsia-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t border-white/5 px-6 py-4 flex justify-end">
              <Button className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white">
                <Lock className="w-4 h-4 mr-2" /> Update Password
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSettings;
