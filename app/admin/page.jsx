"use client";

import {
  Calendar,
  CheckSquare,
  DollarSign,
  MoreHorizontal,
  Users,
  Download,
  ArrowRight,
  Activity,
  Loader2,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import StatCard from "@/components/shared/card/stat-card";
import { useState } from "react";
import { toast } from "sonner";
import {
  useDashboardStats,
  useBookingStats,
  useRevenueStats,
  useDashboardActivities,
} from "@/hooks/use-admin-dashboard";

export default function AdminPage() {
  const [revenueperiod, setRevenueperiod] = useState("month");

  const { data: dashStats, isLoading: statsLoading } = useDashboardStats();
  const { data: bookingData = [], isLoading: bookingLoading } =
    useBookingStats();
  const { data: revenueData = [], isLoading: revenueLoading } =
    useRevenueStats(revenueperiod);
  const { data: activitiesData = [], isLoading: activitiesLoading } =
    useDashboardActivities(5);

  const iconMap = {
    Users,
    Calendar,
    CheckSquare,
    DollarSign,
  };

  const mappedStats = (
    dashStats || [
      {
        label: "Total User",
        value: "0",
        subtext: "vs bulan lalu",
        icon: "Users",
        color: "text-blue-400",
      },
      {
        label: "Event Aktif",
        value: "0",
        subtext: "Sedang berjalan",
        icon: "Calendar",
        color: "text-fuchsia-400",
      },
      {
        label: "Total Booking",
        value: "0",
        subtext: "Bulan ini",
        icon: "CheckSquare",
        color: "text-emerald-400",
      },
      {
        label: "Revenue",
        value: "Rp 0",
        subtext: "Total pendapatan",
        icon: "DollarSign",
        color: "text-amber-400",
      },
    ]
  ).map((stat) => ({
    ...stat,
    icon: iconMap[stat.icon] || Users,
  }));

  const stats = mappedStats;

  const finalBookingData = bookingLoading
    ? []
    : bookingData?.data ||
      bookingData || [
        { name: "Jan", bookings: 65 },
        { name: "Feb", bookings: 78 },
        { name: "Mar", bookings: 90 },
        { name: "Apr", bookings: 81 },
        { name: "Mei", bookings: 95 },
        { name: "Jun", bookings: 112 },
      ];

  const finalRevenueData = revenueLoading
    ? []
    : revenueData?.data ||
      revenueData || [
        { name: "Jan", revenue: 12.5 },
        { name: "Feb", revenue: 15.2 },
        { name: "Mar", revenue: 18.7 },
        { name: "Apr", revenue: 16.3 },
        { name: "Mei", revenue: 22.1 },
        { name: "Jun", revenue: 25.4 },
      ];

  const finalActivities = activitiesLoading
    ? []
    : activitiesData?.data ||
      activitiesData || [
        {
          user: "Ani Susanti",
          action: "melakukan booking booth A12",
          time: "2 menit lalu",
          type: "booking",
        },
        {
          user: "Budi Hartono",
          action: "mengupload bukti transfer",
          time: "15 menit lalu",
          type: "payment",
        },
        {
          user: "Citra Dewi",
          action: "mendaftar sebagai seller",
          time: "1 jam lalu",
          type: "register",
        },
        {
          user: "Deni Prasetyo",
          action: "check-in di Event CFD Bazar",
          time: "2 jam lalu",
          type: "checkin",
        },
        {
          user: "Eka Putri",
          action: "mengupdate profil toko",
          time: "4 jam lalu",
          type: "update",
        },
      ];

  return (
    <div className="p-6 md:p-8 space-y-8 bg-[#050505] min-h-screen text-zinc-100 font-sans">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight">
            Dashboard Overview
          </h1>
          <p className="text-zinc-400 mt-1">
            Selamat datang kembali! Berikut ringkasan performa sistem hari ini.
          </p>
        </div>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className="border-white/10 bg-white/5 hover:bg-white/10 text-white!"
            onClick={() => toast.warning("Fitur Ini Belum Tersedia")}
          >
            <Download className="w-4 h-4 mr-2" /> Download Report
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statsLoading ? (
          <div className="col-span-full flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
          </div>
        ) : (
          stats.map((stat, index) => <StatCard key={index} {...stat} />)
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="bg-[#0F0F11] border-white/10 shadow-xl py-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-white">
                Statistik Booking
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Jumlah booking per bulan
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="text-zinc-500 hover:text-white hover:bg-white/5"
            >
              <MoreHorizontal className="w-5 h-5" />
            </Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {bookingLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={finalBookingData}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#27272a"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "rgba(255, 255, 255, 0.05)" }}
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#27272a",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Bar
                      dataKey="bookings"
                      fill="#c026d3"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F11] border-white/10 shadow-xl py-6">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <div>
              <CardTitle className="text-lg font-bold text-white">
                Revenue Growth
              </CardTitle>
              <CardDescription className="text-zinc-500">
                Pertumbuhan pendapatan
              </CardDescription>
            </div>
            <Select defaultValue="month" onValueChange={setRevenueperiod}>
              <SelectTrigger className="w-[120px] bg-white/5 border-white/10 text-zinc-300 h-8 text-xs">
                <SelectValue placeholder="Pilih Periode" />
              </SelectTrigger>
              <SelectContent className="bg-[#18181b] border-white/10 text-zinc-300">
                <SelectItem value="month">Bulan Ini</SelectItem>
                <SelectItem value="year">Tahun Ini</SelectItem>
              </SelectContent>
            </Select>
          </CardHeader>
          <CardContent>
            <div className="h-[300px] w-full mt-4">
              {revenueLoading ? (
                <div className="flex items-center justify-center h-full">
                  <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={finalRevenueData}>
                    <defs>
                      <linearGradient
                        id="colorRevenue"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="5%"
                          stopColor="#db2777"
                          stopOpacity={0.3}
                        />
                        <stop
                          offset="95%"
                          stopColor="#db2777"
                          stopOpacity={0}
                        />
                      </linearGradient>
                    </defs>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="#27272a"
                      vertical={false}
                    />
                    <XAxis
                      dataKey="name"
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis
                      stroke="#71717a"
                      fontSize={12}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(val) => `${val}M`}
                    />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#18181b",
                        borderColor: "#27272a",
                        borderRadius: "8px",
                        color: "#fff",
                      }}
                    />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stroke="#db2777"
                      strokeWidth={3}
                      fillOpacity={1}
                      fill="url(#colorRevenue)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-[#0F0F11] border-white/10 py-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-fuchsia-500" /> Aktivitas
              Terbaru
            </CardTitle>
            <CardDescription className="text-zinc-500">
              Log aktivitas user secara realtime
            </CardDescription>
          </div>
          <Button
            variant="ghost"
            className="text-fuchsia-400 hover:text-fuchsia-300 hover:bg-white/5 h-8"
          >
            Lihat Semua <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardHeader>
        <CardContent>
          <div className="relative space-y-6 pl-2">
            <div className="absolute top-2 bottom-2 left-[19px] w-px bg-white/10" />

            {activitiesLoading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-fuchsia-500" />
              </div>
            ) : (
              finalActivities.map((activity, index) => {
                let badgeColor = "bg-zinc-500";
                if (activity.type === "booking") badgeColor = "bg-fuchsia-500";
                if (activity.type === "payment") badgeColor = "bg-emerald-500";
                if (activity.type === "register") badgeColor = "bg-blue-500";
                if (activity.type === "checkin") badgeColor = "bg-amber-500";

                return (
                  <div
                    key={index}
                    className="relative flex items-start gap-4 group"
                  >
                    <div
                      className={`relative z-10 w-3 h-3 mt-1.5 rounded-full border-2 border-[#0F0F11] shadow-[0_0_0_2px_rgba(255,255,255,0.1)] ${badgeColor}`}
                    />

                    <div className="flex-1 bg-white/5 border border-white/5 rounded-xl p-4 hover:bg-white/10 transition-colors group-hover:border-white/10">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm text-zinc-300">
                          <span className="font-bold text-white hover:text-fuchsia-400 transition-colors cursor-pointer">
                            {activity.user}
                          </span>{" "}
                          {activity.action}
                        </p>
                        <span className="text-xs text-zinc-500 whitespace-nowrap ml-4 font-mono">
                          {activity.time}
                        </span>
                      </div>
                      <div className="mt-2">
                        <Badge
                          variant="outline"
                          className={`capitalize border-none bg-opacity-10 text-xs px-2 py-0.5 ${badgeColor
                            .replace("bg-", "bg-")
                            .replace("500", "500/10")} ${badgeColor.replace(
                            "bg-",
                            "text-"
                          )}`}
                        >
                          {activity.type}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
