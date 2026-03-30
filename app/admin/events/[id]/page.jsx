"use client";

import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Clock,
  CheckCircle,
  Download,
  DollarSign,
  TrendingUp,
  Store,
  QrCode,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BoothManager } from "@/components/fragments/booth-manager";
import Link from "next/link";
import { useEvents } from "@/hooks/use-events";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { AdminDetailEventSkeleton } from "@/components/shared/skeleton/admin-detail-event";
import { getCityLabel } from "@/constant/cities";

export default function AdminEventDetail() {
  const params = useParams();
  const router = useRouter();
  const eventId = params.id;
  const { data: events, isLoading } = useEvents();

  const event = events?.find((e) => e.id === eventId);

  if (isLoading) return <AdminDetailEventSkeleton />;

  if (!event) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#050505]">
        <Card className="bg-[#0F0F11] border-white/10 max-w-md">
          <CardContent className="p-8 text-center space-y-4">
            <div className="w-16 h-16 bg-fuchsia-500/10 rounded-full flex items-center justify-center mx-auto">
              <Calendar className="w-8 h-8 text-fuchsia-500" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white mb-2">
                Event Tidak Ditemukan
              </h2>
              <p className="text-zinc-400 text-sm">
                Event yang Anda cari tidak ditemukan atau telah dihapus.
              </p>
            </div>
            <Button
              onClick={() => router.push("/admin/events")}
              className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white"
            >
              Kembali ke Daftar Event
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const bookingList =
    event.booths
      ?.filter((b) => b.booking)
      .map((b) => ({
        ...b.booking,
        boothCode: b.code,
        price: b.price,
      })) || [];

  const totalBooths = event.booths?.length || 0;
  const bookedCount = bookingList.length;
  const paidCount = bookingList.filter((b) => b.status === "PAID").length;
  const pendingCount = bookingList.filter((b) => b.status === "PENDING").length;
  const occupancyRate = totalBooths > 0 ? (bookedCount / totalBooths) * 100 : 0;
  const totalRevenue = bookingList
    .filter((b) => b.status === "PAID")
    .reduce((sum, b) => sum + b.price, 0);
  const potentialRevenue = bookingList
    .filter((b) => b.status === "PENDING")
    .reduce((sum, b) => sum + b.price, 0);

  const chartData = [
    { name: "Paid", value: paidCount, color: "#10b981" },
    { name: "Pending", value: pendingCount, color: "#f59e0b" },
    { name: "Empty", value: totalBooths - bookedCount, color: "#27272a" },
  ];

  return (
    <div className="p-6 md:p-8 space-y-8 min-h-screen bg-[#050505] text-zinc-100 font-sans">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push("/admin/events")}
            className="hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>

          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white tracking-tight">
                {event.title}
              </h1>
              <Badge
                variant="outline"
                className={
                  event.type === "SPECIAL"
                    ? "border-fuchsia-500 text-fuchsia-500 bg-fuchsia-500/10"
                    : "border-blue-500 text-blue-500 bg-blue-500/10"
                }
              >
                {event.type === "SPECIAL" ? "Special" : "Mingguan"}
              </Badge>
            </div>
          </div>
        </div>

        <Link href={`/admin/events/${eventId}/scan`}>
          <Button className="bg-fuchsia-600 hover:bg-fuchsia-500 text-white shadow-[0_0_20px_rgba(217,70,239,0.3)] border-none transition-all">
            <QrCode className="w-4 h-4 mr-2" />
            Scan Check-in
          </Button>
        </Link>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <Tabs defaultValue="booths" className="w-full">
            <TabsList className="bg-[#0F0F11] border border-white/10 p-1 w-full justify-start">
              <TabsTrigger
                value="booths"
                className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400 text-zinc-400 transition-colors"
              >
                Manajemen Booth
              </TabsTrigger>
              <TabsTrigger
                value="bookings"
                className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400 text-zinc-400 transition-colors"
              >
                Daftar Booking
              </TabsTrigger>
              <TabsTrigger
                value="stats"
                className="data-[state=active]:bg-fuchsia-500/20 data-[state=active]:text-fuchsia-400 text-zinc-400 transition-colors"
              >
                Statistik
              </TabsTrigger>
            </TabsList>

            <TabsContent value="booths" className="mt-6">
              <BoothManager
                eventId={event.id}
                initialBooths={event.booths || []}
              />
            </TabsContent>

            <TabsContent value="bookings" className="mt-6">
              <Card className="bg-[#0F0F11] border-white/10 py-6">
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle className="text-lg font-bold text-white">
                    Tenant & Booking List
                  </CardTitle>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-white/10 text-zinc-400 hover:text-white hover:bg-white/5"
                  >
                    <Download className="w-4 h-4 mr-2" /> Export CSV
                  </Button>
                </CardHeader>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader className="bg-white/5 border-b border-white/10">
                      <TableRow className="hover:bg-transparent border-white/10">
                        <TableHead className="text-zinc-400">Booth</TableHead>
                        <TableHead className="text-zinc-400">
                          Nama Toko
                        </TableHead>
                        <TableHead className="text-zinc-400">Owner</TableHead>
                        <TableHead className="text-zinc-400">Status</TableHead>
                        <TableHead className="text-zinc-400 text-right">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {bookingList.length > 0 ? (
                        bookingList.map((bk) => (
                          <TableRow
                            key={bk.id}
                            className="border-white/5 hover:bg-white/5 transition-colors"
                          >
                            <TableCell className="font-mono font-bold text-fuchsia-400">
                              {bk.boothCode}
                            </TableCell>
                            <TableCell className="text-white">
                              {bk.name}
                            </TableCell>
                            <TableCell className="text-zinc-400 text-sm">
                              {bk.user.name}
                            </TableCell>
                            <TableCell>
                              {bk.status === "PAID" ? (
                                <Badge className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 border-emerald-500/20">
                                  <CheckCircle className="w-3 h-3 mr-1" /> Paid
                                </Badge>
                              ) : (
                                <Badge className="bg-amber-500/10 text-amber-500 hover:bg-amber-500/20 border-amber-500/20">
                                  <Clock className="w-3 h-3 mr-1" /> Pending
                                </Badge>
                              )}
                            </TableCell>
                            <TableCell className="text-right text-white">
                              Rp {bk.price.toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={5}
                            className="h-24 text-center text-zinc-500"
                          >
                            Belum ada booking yang masuk.
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="stats" className="mt-6 space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <Card className="bg-[#0F0F11] border-white/10 hover:border-fuchsia-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-400">
                          Total Revenue
                        </p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          Rp {(totalRevenue / 1000000).toFixed(1)}JT
                        </h3>
                      </div>
                      <div className="p-3 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <DollarSign className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-4">
                      + Rp {(potentialRevenue / 1000000).toFixed(1)}JT (Pending)
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0F0F11] border-white/10 hover:border-fuchsia-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-400">
                          Occupancy Rate
                        </p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {occupancyRate.toFixed(0)}%
                        </h3>
                      </div>
                      <div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-500">
                        <TrendingUp className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-4">
                      {bookedCount} dari {totalBooths} booth terisi
                    </p>
                  </CardContent>
                </Card>

                <Card className="bg-[#0F0F11] border-white/10 hover:border-fuchsia-500/30 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-zinc-400">
                          Total Tenant
                        </p>
                        <h3 className="text-2xl font-bold text-white mt-1">
                          {bookedCount}
                        </h3>
                      </div>
                      <div className="p-3 bg-fuchsia-500/10 rounded-xl text-fuchsia-500">
                        <Store className="w-6 h-6" />
                      </div>
                    </div>
                    <p className="text-xs text-zinc-500 mt-4">
                      {pendingCount} tenant menunggu verifikasi
                    </p>
                  </CardContent>
                </Card>
              </div>

              <Card className="bg-[#0F0F11] border-white/10 py-6">
                <CardHeader>
                  <CardTitle className="text-lg text-white">
                    Distribusi Status Booking
                  </CardTitle>
                </CardHeader>
                <CardContent className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical">
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="#27272a"
                        horizontal={true}
                        vertical={false}
                      />
                      <XAxis type="number" stroke="#71717a" fontSize={12} />
                      <YAxis
                        dataKey="name"
                        type="category"
                        stroke="#71717a"
                        fontSize={12}
                        width={80}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "#18181b",
                          borderColor: "#27272a",
                          color: "#fff",
                        }}
                        cursor={{ fill: "transparent" }}
                      />
                      <Bar
                        dataKey="value"
                        radius={[0, 4, 4, 0]}
                        barSize={32}
                        background={{ fill: "#18181b" }}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card className="bg-[#0F0F11] border-white/10 py-6">
            <CardHeader>
              <CardTitle className="text-lg text-white">
                Informasi Event
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="aspect-video w-full rounded-lg overflow-hidden bg-zinc-800 ring-1 ring-white/10">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-3 pt-2">
                <div className="flex items-start gap-3 text-sm">
                  <Calendar className="w-4 h-4 text-fuchsia-500 mt-0.5" />
                  <div>
                    <p className="text-zinc-300 font-medium">Tanggal</p>
                    <p className="text-zinc-500">
                      {new Date(event.date).toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <Clock className="w-4 h-4 text-fuchsia-500 mt-0.5" />
                  <div>
                    <p className="text-zinc-300 font-medium">Waktu</p>
                    <p className="text-zinc-500">{event.time}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3 text-sm">
                  <MapPin className="w-4 h-4 text-fuchsia-500 mt-0.5" />
                  <div>
                    <p className="text-zinc-300 font-medium">Lokasi</p>
                    <p className="text-zinc-500">{event.location}</p>
                    <p className="text-xs text-zinc-600">
                      {getCityLabel(event.city)}
                    </p>
                  </div>
                </div>
              </div>
              <Separator className="bg-white/10" />
              <div>
                <p className="text-sm font-medium text-zinc-300 mb-2">
                  Organizer
                </p>
                <div className="flex items-center gap-3">
                  <Avatar className="size-8 border border-zinc-800">
                    <AvatarFallback className="bg-fuchsia-500/10 text-fuchsia-500">
                      {event.organizer?.name?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-sm text-zinc-400">
                    {event.organizer?.name}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
