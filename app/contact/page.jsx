"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      alert("Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda.");
      setIsSubmitting(false);
      e.target.reset();
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-fuchsia-900/10 blur-[120px] pointer-events-none" />
        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">
              Hubungi <span className="text-fuchsia-500">Kami.</span>
            </h1>
            <p className="text-zinc-400 text-lg md:text-xl">
              Punya pertanyaan seputar penyelenggaraan event atau kendala
              teknis? Tim support kami siap membantu Anda 24/7.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="container mx-auto px-6 pb-24">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1 space-y-6">
            <Card className="bg-[#0F0F11] border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-500">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Email</h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    support@bazarhub.id
                  </p>
                  <p className="text-zinc-400 text-sm">
                    partnership@bazarhub.id
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#0F0F11] border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">WhatsApp</h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    +62 812-3456-7890 (Support)
                  </p>
                  <p className="text-zinc-400 text-sm">
                    +62 812-9876-5432 (Sales)
                  </p>
                </div>
              </div>
            </Card>

            <Card className="bg-[#0F0F11] border-white/10 p-6">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Kantor</h3>
                  <p className="text-zinc-400 text-sm mt-1">
                    Menara Digital, Lantai 12
                    <br />
                    Jl. Jend. Sudirman Kav. 1, Jakarta Pusat
                  </p>
                </div>
              </div>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <Card className="bg-[#0F0F11] border-white/10 overflow-hidden">
              <div className="h-1 w-full bg-linear-to-r from-fuchsia-600 to-purple-600" />
              <CardContent className="p-8">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-zinc-300">
                        Nama Lengkap
                      </Label>
                      <Input
                        id="name"
                        placeholder="Masukkan nama Anda"
                        className="bg-black/50 border-white/10 text-white h-12 focus-visible:ring-fuchsia-500"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-zinc-300">
                        Alamat Email
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="nama@email.com"
                        className="bg-black/50 border-white/10 text-white h-12 focus-visible:ring-fuchsia-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject" className="text-zinc-300">
                      Subjek Pesan
                    </Label>
                    <Input
                      id="subject"
                      placeholder="Contoh: Kerjasama Event, Kendala Teknis"
                      className="bg-black/50 border-white/10 text-white h-12 focus-visible:ring-fuchsia-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-zinc-300">
                      Pesan
                    </Label>
                    <Textarea
                      id="message"
                      placeholder="Tuliskan detail pertanyaan atau kebutuhan Anda..."
                      className="bg-black/50 border-white/10 text-white min-h-[150px] resize-none focus-visible:ring-fuchsia-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full h-12 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-lg shadow-lg shadow-fuchsia-500/20"
                  >
                    {isSubmitting ? "Mengirim..." : "Kirim Pesan"}
                    <Send className="w-5 h-5 ml-2" />
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};