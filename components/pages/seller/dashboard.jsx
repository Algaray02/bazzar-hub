"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import {
  BarChart3,
  TrendingUp,
  Zap,
  Plus,
  Sparkles,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  MessageSquare,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
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
import { getTenantInsightsAction } from "@/app/actions/ai-actions";

const CHART_DATA_SCAN = [
  { day: "Sen", scans: 45, visitors: 120 },
  { day: "Sel", scans: 52, visitors: 145 },
  { day: "Rab", scans: 38, visitors: 98 },
  { day: "Kam", scans: 61, visitors: 167 },
  { day: "Jum", scans: 73, visitors: 201 },
  { day: "Sab", scans: 89, visitors: 245 },
  { day: "Min", scans: 95, visitors: 278 },
];

export function DashboardTab({
  stats,
  onExploreClick,
  monthlyExpenseData,
  weeklyScansData,
}) {
  const [chartExpenseData, setChartExpenseData] = useState([
    { month: "Jul", expense: 0.5 },
    { month: "Agu", expense: 1.2 },
    { month: "Sep", expense: 0.8 },
    { month: "Okt", expense: 2.5 },
    { month: "Nov", expense: 1.5 },
    { month: "Des", expense: 3.2 },
  ]);
  const [chartScanData, setChartScanData] = useState(CHART_DATA_SCAN);

  useEffect(() => {
    if (monthlyExpenseData && monthlyExpenseData.length > 0) {
      setChartExpenseData(monthlyExpenseData);
    }
  }, [monthlyExpenseData]);

  useEffect(() => {
    if (weeklyScansData && weeklyScansData.length > 0) {
      setChartScanData(weeklyScansData);
    }
  }, [weeklyScansData]);
  const { data: session } = useSession();
  const [insight, setInsight] = useState(null);
  const [isLoadingInsight, setIsLoadingInsight] = useState(false);

  const handleGenerateInsight = async () => {
    if (!session?.user?.id) return;

    setIsLoadingInsight(true);
    try {
      const result = await getTenantInsightsAction(session.user.id);

      if (result.success) {
        setInsight(result.data);
        toast.success("Analisis AI berhasil dimuat!");
      } else {
        toast.error("Gagal memuat analisis.");
      }
    } catch (error) {
      toast.error("Terjadi kesalahan sistem.");
    } finally {
      setIsLoadingInsight(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </div>

      <Card className="bg-zinc-900/50 border-white/10 relative overflow-hidden py-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-fuchsia-500" />
                Analisis Performa Toko (AI)
              </CardTitle>
              <CardDescription className="text-zinc-500 mt-1">
                Dapatkan wawasan mendalam dari ulasan pelanggan menggunakan AI
              </CardDescription>
            </div>
            {!insight && (
              <Button
                onClick={handleGenerateInsight}
                disabled={isLoadingInsight}
                className="bg-fuchsia-600 hover:bg-fuchsia-700 text-white"
              >
                {isLoadingInsight ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Menganalisis...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Insight
                  </>
                )}
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {insight ? (
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                <div className="p-3 rounded-full bg-fuchsia-500/10">
                  <MessageSquare className="w-6 h-6 text-fuchsia-400" />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h4 className="font-semibold text-white">
                      Ringkasan Eksekutif
                    </h4>
                    <Badge
                      variant={
                        insight.overallSentiment === "Positive"
                          ? "default"
                          : "secondary"
                      }
                      className={
                        insight.overallSentiment === "Positive"
                          ? "bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30"
                          : "bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30"
                      }
                    >
                      Sentimen: {insight.overallSentiment}
                    </Badge>
                  </div>
                  <p className="text-zinc-300 text-sm leading-relaxed">
                    {insight.summary}
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20">
                  <h5 className="text-emerald-400 font-medium mb-3 flex items-center gap-2">
                    <ThumbsUp className="w-4 h-4" /> Apa yang disukai?
                  </h5>
                  <ul className="space-y-2">
                    {insight.topPraises?.map((praise, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-zinc-300 flex items-start gap-2"
                      >
                        <span className="text-emerald-500 mt-1">•</span>{" "}
                        {praise}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-4 rounded-xl bg-red-950/20 border border-red-500/20">
                  <h5 className="text-red-400 font-medium mb-3 flex items-center gap-2">
                    <ThumbsDown className="w-4 h-4" /> Apa yang perlu
                    ditingkatkan?
                  </h5>
                  <ul className="space-y-2">
                    {insight.topComplaints?.map((complaint, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-zinc-300 flex items-start gap-2"
                      >
                        <span className="text-red-500 mt-1">•</span> {complaint}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center border-2 border-dashed border-zinc-800 rounded-xl">
              <Sparkles className="w-12 h-12 text-zinc-700 mb-3" />
              <p className="text-zinc-500 max-w-md">
                Klik tombol &quot;Generate Insight&quot; untuk meminta AI
                membaca ulasan pelanggan dan memberikan strategi perbaikan untuk
                toko Anda.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card className="bg-[#0F0F11] border-white/20 shadow-xl py-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-white flex items-center gap-2">
                  <BarChart3 className="w-5 h-5 text-fuchsia-500" />
                  Aktivitas Mingguan
                </CardTitle>
                <CardDescription className="text-zinc-500 mt-1">
                  Scan QR & Pengunjung
                </CardDescription>
              </div>
              <Select defaultValue="week">
                <SelectTrigger className="w-[140px] bg-zinc-900 border-zinc-800 text-zinc-400 h-9">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-800 text-zinc-300">
                  <SelectItem value="week">7 Hari</SelectItem>
                  <SelectItem value="month">30 Hari</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartScanData}>
                <defs>
                  <linearGradient id="colorScans" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#d946ef" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#d946ef" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="day"
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
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  }}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Area
                  type="monotone"
                  dataKey="scans"
                  stroke="#d946ef"
                  strokeWidth={3}
                  fill="url(#colorScans)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-[#0F0F11] border-white/20 shadow-xl py-6">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-fuchsia-500" />
              Pengeluaran Booth
            </CardTitle>
            <CardDescription className="text-zinc-500 mt-1">
              Investasi per bulan (dalam juta)
            </CardDescription>
          </CardHeader>
          <CardContent className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartExpenseData}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke="#27272a"
                  vertical={false}
                />
                <XAxis
                  dataKey="month"
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
                  tickFormatter={(value) => `${value}jt`}
                />
                <Tooltip
                  formatter={(value) => [`Rp ${value} Juta`, "Pengeluaran"]}
                  contentStyle={{
                    backgroundColor: "#18181b",
                    border: "1px solid #27272a",
                    borderRadius: "12px",
                    boxShadow: "0 10px 40px rgba(0,0,0,0.3)",
                  }}
                  labelStyle={{ color: "#fff", fontWeight: "bold" }}
                />
                <Line
                  type="monotone"
                  dataKey="expense"
                  stroke="#a855f7"
                  strokeWidth={3}
                  dot={{
                    fill: "#a855f7",
                    r: 5,
                    strokeWidth: 2,
                    stroke: "#000",
                  }}
                  activeDot={{ r: 7, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-linear-to-br from-fuchsia-950 to-purple-950 border-fuchsia-500 py-6">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-2 flex items-center gap-2">
                <Zap className="w-5 h-5 text-fuchsia-400" />
                Ready to expand?
              </h3>
              <p className="text-zinc-400">
                Jelajahi event baru dan tingkatkan jangkauan bisnis Anda
              </p>
            </div>
            <Button
              onClick={onExploreClick}
              size="lg"
              className="bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-fuchsia-500/20 whitespace-nowrap"
            >
              <Plus className="w-4 h-4 mr-2" />
              Book Event Baru
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  );
}
