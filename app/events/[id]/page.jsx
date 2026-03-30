"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Store,
  ArrowLeft,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getHighlightLabel } from "@/constant/highlights";
import { getCategoryLabel } from "@/constant/category-store";
import { useEvent } from "@/hooks/use-events";
import { getCityLabel } from "@/constant/cities";
import { PageLoader } from "@/components/ui/page-loader";
import { PageError } from "@/components/ui/page-error";

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();

  const { data: event, isLoading, error } = useEvent(params.id);

  if (isLoading) {
    return <PageLoader message="Loading event..." />;
  }

  if (error || !event) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center">
        <PageError message="Event tidak ditemukan" />
        <Button
          className="mt-4 text-black hover:bg-zinc-200"
          variant="outline"
          onClick={() => router.push("/events")}
        >
          Kembali ke Events
        </Button>
      </div>
    );
  }

  const tenants =
    event.booths
      ?.filter((b) => b.booking && b.booking.status === "PAID")
      .map((b) => ({
        ...b.booking,
        boothCode: b.code,
      })) || [];

  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <div className="relative h-[60vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-t from-[#050505] via-[#050505]/50 to-transparent z-10" />
        <motion.img
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          src={
            event.image || "/placeholder.svg?height=600&width=1200&query=event"
          }
          alt={event.title}
          className="w-full h-full object-cover"
        />

        <div className="absolute top-28 left-6 z-20">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full bg-black/50 border-white/10 text-white hover:bg-black hover:text-white backdrop-blur-md"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 w-full p-6 pb-12 z-20 container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl"
          >
            <div className="flex gap-2 mb-4">
              <Badge className="bg-fuchsia-600 hover:bg-fuchsia-700 border-none px-3 py-1 text-sm">
                {event.type === "SPECIAL" ? "Special" : "Mingguan"}
              </Badge>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 leading-tight">
              {event.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-zinc-300">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-fuchsia-500" />
                <span>
                  {new Date(event.date).toLocaleDateString("id-ID", {
                    dateStyle: "long",
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-fuchsia-500" />
                <span>
                  {event.location}, {getCityLabel(event.city)}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-6 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2 space-y-10">
            <div className="flex items-center p-4 rounded-xl bg-white/5 border border-white/10">
              <div className="flex items-center gap-4">
                <Avatar className="size-10 border border-zinc-800">
                  <AvatarFallback className="bg-fuchsia-500/10 text-fuchsia-500">
                    {event.organizer?.name?.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-xs text-zinc-500">Diselenggarakan oleh</p>
                  <h3 className="font-bold text-white flex items-center gap-2">
                    {event.organizer?.name || "Event Organizer"}
                    {event.organizer?.verified && (
                      <CheckCircle className="w-4 h-4 text-blue-500 fill-blue-500/20" />
                    )}
                  </h3>
                </div>
              </div>
            </div>

            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="w-full justify-start bg-transparent border-b border-white/10 h-auto p-0 mb-6 gap-6">
                {["overview", "rundown", "tenants"].map((tab) => (
                  <TabsTrigger
                    key={tab}
                    value={tab}
                    className="rounded-xl border-b-2 border-transparent data-[state=active]:border-fuchsia-500 data-[state=active]:bg-transparent data-[state=active]:text-fuchsia-400 px-0 py-3 text-base text-zinc-500 capitalize"
                  >
                    {tab === "tenants" ? "Daftar Tenant" : tab}
                  </TabsTrigger>
                ))}
              </TabsList>

              <TabsContent
                value="overview"
                className="space-y-8 animate-in fade-in slide-in-from-bottom-4"
              >
                <div className="prose prose-invert max-w-none text-zinc-400 leading-relaxed whitespace-pre-line">
                  {event.description}
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-white text-lg">
                    Highlight Acara
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {event.highlights?.map((tag, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-2 px-4 py-3 rounded-xl bg-[#0F0F11] border border-white/10 text-sm text-zinc-300"
                      >
                        <CheckCircle className="w-4 h-4 text-fuchsia-500" />
                        {getHighlightLabel(tag)}
                      </div>
                    ))}
                  </div>
                </div>

                {event.faq && event.faq.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="font-bold text-white text-lg">FAQ</h3>
                    <Accordion type="single" collapsible className="w-full">
                      {event.faq.map((item, i) => (
                        <AccordionItem
                          key={i}
                          value={`item-${i}`}
                          className="border-white/10"
                        >
                          <AccordionTrigger className="text-zinc-300 hover:text-white">
                            {item.q}
                          </AccordionTrigger>
                          <AccordionContent className="text-zinc-400">
                            {item.a}
                          </AccordionContent>
                        </AccordionItem>
                      ))}
                    </Accordion>
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="rundown"
                className="space-y-6 animate-in fade-in slide-in-from-bottom-4"
              >
                {event.rundown && event.rundown.length > 0 ? (
                  <div className="relative border-l border-white/10 ml-3 space-y-8 py-2">
                    {event.rundown.map((item, i) => (
                      <div key={i} className="relative pl-8 group">
                        <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-zinc-700 group-hover:bg-fuchsia-500 transition-colors shadow-[0_0_10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_0_10px_rgba(217,70,239,0.5)]" />
                        <p className="text-sm font-mono text-fuchsia-400 mb-1">
                          {item.time}
                        </p>
                        <p className="text-white font-medium">
                          {item.activity}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-zinc-500">
                    Rundown belum tersedia untuk event ini.
                  </div>
                )}
              </TabsContent>

              <TabsContent
                value="tenants"
                className="animate-in fade-in slide-in-from-bottom-4"
              >
                <Card className="bg-[#0F0F11] border-white/10">
                  <CardContent className="p-0">
                    <Table>
                      <TableHeader className="bg-white/5 border-b border-white/10">
                        <TableRow className="hover:bg-transparent border-white/10">
                          <TableHead className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Booth
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Tenant
                          </TableHead>
                          <TableHead className="px-6 py-4 text-center text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Kategori
                          </TableHead>
                          <TableHead className="px-6 py-4 text-left text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Owner
                          </TableHead>
                          <TableHead className="px-6 py-4 text-right text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                            Action
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {tenants.length > 0 ? (
                          tenants.map((tenant) => (
                            <TableRow
                              key={tenant.id}
                              className="border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <TableCell className="p-2 whitespace-nowrap">
                                <span className="inline-flex items-center px-3 py-1 rounded-lg bg-fuchsia-500/10 border border-fuchsia-500/30 font-mono font-bold text-fuchsia-400 text-sm">
                                  {tenant.boothCode}
                                </span>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center overflow-hidden border border-white/10">
                                    {tenant.logo ? (
                                      <img
                                        src={tenant.logo || "/placeholder.svg"}
                                        alt={tenant.name}
                                        className="w-full h-full object-cover"
                                      />
                                    ) : (
                                      <Store className="w-4 h-4 text-zinc-400" />
                                    )}
                                  </div>
                                  <span className="font-medium text-white">
                                    {tenant.name}
                                  </span>
                                </div>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-center">
                                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-500/50">
                                  {getCategoryLabel(tenant.category)}
                                </span>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap">
                                <span className="text-zinc-400 text-sm">
                                  {tenant.user?.name || "Anonymous"}
                                </span>
                              </TableCell>
                              <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                                <Link
                                  href={`/tenants/${tenant.id}`}
                                  className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-white/10 text-zinc-400 hover:bg-fuchsia-500 hover:text-white hover:border-fuchsia-500 transition-all duration-200 group-hover:scale-110"
                                >
                                  <ArrowRight className="w-4 h-4" />
                                </Link>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell
                              colSpan={5}
                              className="h-32 text-center text-zinc-500"
                            >
                              Belum ada tenant yang terdaftar di event ini.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </CardContent>
                </Card>

                <div className="mt-4 text-xs text-zinc-500 px-1 text-center">
                  Menampilkan {tenants.length} tenant resmi yang berpartisipasi.
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-28 space-y-6">
              <Card className="bg-[#0F0F11] border-white/10 overflow-hidden">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <Calendar className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">Tanggal</p>
                        <p className="text-white font-medium">
                          {new Date(event.date).toLocaleDateString("id-ID", {
                            dateStyle: "medium",
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <Clock className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">Waktu</p>
                        <p className="text-white font-medium">{event.time}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-4">
                      <div className="p-2 bg-white/5 rounded-lg border border-white/5">
                        <MapPin className="w-5 h-5 text-zinc-300" />
                      </div>
                      <div>
                        <p className="text-sm text-zinc-500">Lokasi</p>
                        <p className="text-white font-medium">
                          {event.location}
                        </p>
                        <Link
                          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                            event.location
                          )}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-fuchsia-400 hover:underline mt-1 block"
                        >
                          Lihat di Google Maps
                        </Link>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
