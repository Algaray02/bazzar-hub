"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send, Mail, MapPin, Phone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useSendMessage } from "@/hooks/use-messages";

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": "https://bazzarhub.algaray.biz.id/contact",
  name: "BazarHub",
  description: "Platform digital booking booth event dan festival untuk UMKM Indonesia",
  url: "https://bazzarhub.algaray.biz.id",
  logo: "https://bazzarhub.algaray.biz.id/logo.png",
  image: "https://bazzarhub.algaray.biz.id/og-image.png",
  telephone: "+62-857-2814-1488",
  email: "support@bazzarhub.algaray.biz.id",
  address: {
    "@type": "PostalAddress",
    streetAddress: "Jl. Jend. Sudirman Kav. 1, Menara Digital Lantai 12",
    addressLocality: "Jakarta Pusat",
    addressRegion: "DKI Jakarta",
    postalCode: "10220",
    addressCountry: "ID",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: "-6.2088",
    longitude: "106.8456",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "09:00",
      closes: "18:00",
    },
  ],
  sameAs: [
    "https://instagram.com/bazzarhub",
    "https://twitter.com/bazzarhub",
    "https://linkedin.com/company/bazzarhub",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      telephone: "+62-857-2814-1488",
      contactType: "customer service",
      availableLanguage: ["Indonesian", "English"],
      areaServed: "ID",
    },
    {
      "@type": "ContactPoint",
      telephone: "+62-857-2814-1488",
      contactType: "sales",
      availableLanguage: ["Indonesian"],
      areaServed: "ID",
    },
  ],
  priceRange: "$$",
};

export default function ContactPage() {
  const { mutate: sendMessage, isPending } = useSendMessage();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    sendMessage(formData, {
      onSuccess: () => {
        toast.success("Pesan berhasil dikirim! Tim kami akan segera menghubungi Anda.");
        setFormData({ name: "", email: "", subject: "", message: "" });
      },
    });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
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
                  <div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-500" aria-hidden="true">
                    <Mail className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">Email</h2>
                    <p className="text-zinc-400 text-sm mt-1">
                      support@bazzarhub.algaray.biz.id
                    </p>
                    <p className="text-zinc-400 text-sm">
                      partnership@bazzarhub.algaray.biz.id
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#0F0F11] border-white/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-blue-500/10 rounded-xl text-blue-500" aria-hidden="true">
                    <Phone className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">WhatsApp</h2>
                    <p className="text-zinc-400 text-sm mt-1">
                      +62 857-2814-1488 (Support)
                    </p>
                    <p className="text-zinc-400 text-sm">
                      +62 857-2814-1488 (Sales)
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="bg-[#0F0F11] border-white/10 p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500" aria-hidden="true">
                    <MapPin className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-bold text-white text-lg">Kantor</h2>
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
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
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
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
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
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
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
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        placeholder="Tuliskan detail pertanyaan atau kebutuhan Anda..."
                        className="bg-black/50 border-white/10 text-white min-h-[150px] resize-none focus-visible:ring-fuchsia-500"
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      disabled={isPending}
                      className="w-full h-12 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold text-lg shadow-lg shadow-fuchsia-500/20"
                    >
                      {isPending ? "Mengirim..." : "Kirim Pesan"}
                      <Send className="w-5 h-5 ml-2" />
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
