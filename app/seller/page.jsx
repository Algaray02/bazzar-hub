"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  QrCode,
  ShoppingBag,
  Settings,
  CheckCircle,
  Star,
  Users,
  Award,
} from "lucide-react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { DashboardTab } from "@/components/pages/seller/dashboard";
import { BookingTab } from "@/components/pages/seller/bookings";
import { EventTab } from "@/components/pages/seller/events";
import ProfileTabs from "@/components/pages/seller/profile";
import { BookingDialog } from "@/components/shared/dialog/create-dialog-booking";
import { QrDialog } from "@/components/shared/dialog/show-dialog-qr";
import { SettingsDialog } from "@/components/shared/dialog/settings-dialog";
import { useSellerBookings } from "@/hooks/use-seller-bookings";
import { useQrCode } from "@/hooks/use-qr-code";
import { signOut } from "next-auth/react";
import { useUser } from "@/hooks/use-users";
import { useSellerRating } from "@/hooks/use-seller-rating";
import { useMonthlyExpense } from "@/hooks/use-monthly-expense";
import { useWeeklyScans } from "@/hooks/use-weekly-scans";

export default function SellerDashboardPage() {
  const { data: session } = useSession();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  const { bookings } = useSellerBookings();
  const { data: user, isLoading, error, refetch } = useUser(session?.user?.id);
  const { qrState, generateQr, closeQr } = useQrCode();
  const { rating, reviewCount } = useSellerRating(session?.user?.id);
  const { chartData: monthlyExpenseData } = useMonthlyExpense(
    session?.user?.id
  );
  const { chartData: weeklyScansData, totalScans } = useWeeklyScans(
    session?.user?.id
  );

  const [bookingDialog, setBookingDialog] = useState({
    isOpen: false,
    event: null,
  });

  const activeBookings =
    bookings?.filter((b) => b.status === "PAID")?.length || 0;
  const pendingBookings =
    bookings?.filter((b) => b.status === "PENDING")?.length || 0;

  const STATS_DATA = [
    {
      label: "Total Scan QR",
      value: totalScans.toString(),
      subtext: "Total pengunjung melakukan scan",
      icon: QrCode,
      color: "text-white",
    },
    {
      label: "Booking Aktif",
      value: activeBookings.toString(),
      subtext: `${pendingBookings} menunggu verifikasi`,
      icon: ShoppingBag,
      color: "text-green-400",
    },
    {
      label: "Rating Toko",
      value: rating !== null ? `${rating}` : "-",
      subtext: `${reviewCount} ulasan pelanggan`,
      icon: Star,
      color: "text-yellow-400",
    },
    {
      label: "Total Pengunjung",
      value: totalScans.toString(),
      subtext: "Total pengunjung toko Anda",
      icon: Users,
      color: "text-sky-400",
    },
  ];

  const handleOpenBooking = (event) => {
    setBookingDialog({ isOpen: true, event });
  };

  const handleCloseBooking = () => {
    setBookingDialog({ isOpen: false, event: null });
  };

  const handleSubmitBooking = () => {
    handleCloseBooking();
    setActiveTab("booking");
  };

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-[#050505] text-zinc-100 flex items-center justify-center">
        <div className="text-zinc-400">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-[#050505] text-zinc-100">
        <div className="max-w-md mx-auto bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <h2 className="font-bold text-red-400 mb-2">Error Loading Seller</h2>
          <p className="text-sm text-red-300">{error.message}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,var(--tw-linear-stops))] from-fuchsia-900/20 via-black to-black pointer-events-none" />
      <div className="fixed inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMDMpIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40 pointer-events-none" />

      <div className="relative pt-32 pb-12 px-6 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-b from-fuchsia-950/20 to-transparent" />
        <div className="container mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center gap-8"
          >
            <div className="relative">
              <div className="w-32 h-32 rounded-3xl bg-linear-to-br from-fuchsia-500 to-purple-600 p-1">
                <div className="w-full h-full rounded-3xl bg-black overflow-hidden">
                  {user?.avatar ? (
                    <img
                      src={user?.avatar || "/placeholder.svg"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-zinc-500 bg-zinc-800">
                      {user?.name?.charAt(0) || "S"}
                    </div>
                  )}
                </div>
              </div>
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-xl bg-linear-to-br from-emerald-500 to-teal-600 flex items-center justify-center border-4 border-black">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
            </div>
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-bold text-white mb-2">
                {user?.name || "Seller"}
              </h1>
              <p className="text-zinc-400 mb-4">
                Seller ID:{" "}
                <span className="text-fuchsia-400">
                  #{user?.id?.slice(-8).toUpperCase()}
                </span>{" "}
                • Member sejak 2024
              </p>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {activeBookings > 0 && (
                  <Badge className="bg-fuchsia-500/20 text-fuchsia-400 border-fuchsia-500/50">
                    <Award className="w-3 h-3 mr-1" />
                    {activeBookings} Booking Aktif
                  </Badge>
                )}
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">
                  Verified
                </Badge>
              </div>
            </div>
            <Button
              onClick={() => setIsSettingsOpen(true)}
              size="lg"
              className="bg-linear-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-fuchsia-500/20"
            >
              <Settings className="w-4 h-4 mr-2" />
              Pengaturan
            </Button>
          </motion.div>
        </div>
      </div>

      <main className="container mx-auto px-6 pb-16 relative z-10">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full space-y-8"
        >
          <div className="bg-black/80 backdrop-blur-xl py-4">
            <TabsList className="bg-zinc-900/50 border border-zinc-800/50 p-1 space-x-1">
              {["dashboard", "booking", "explore", "profile"].map((tab) => (
                <TabsTrigger
                  key={tab}
                  value={tab}
                  className="rounded-lg data-[state=active]:bg-linear-to-r data-[state=active]:from-fuchsia-600 data-[state=active]:to-purple-600 data-[state=active]:text-white data-[state=active]:shadow-lg data-[state=active]:shadow-fuchsia-500/20 px-6 py-2.5 text-zinc-400 hover:text-zinc-300 transition-all capitalize font-medium"
                >
                  {tab === "explore" ? "Cari Event" : tab}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <TabsContent value="dashboard" className="space-y-8">
            <DashboardTab
              stats={STATS_DATA}
              onExploreClick={() => setActiveTab("explore")}
              monthlyExpenseData={monthlyExpenseData}
              weeklyScansData={weeklyScansData}
            />
          </TabsContent>

          <TabsContent value="booking" className="space-y-6">
            <BookingTab onShowQR={generateQr} />
          </TabsContent>

          <TabsContent value="explore" className="space-y-8">
            <EventTab onBook={handleOpenBooking} />
          </TabsContent>

          <TabsContent value="profile" className="space-y-8">
            <ProfileTabs />
          </TabsContent>
        </Tabs>
      </main>

      <QrDialog
        isOpen={qrState.isOpen}
        type={qrState.type}
        code={qrState.code}
        dataUrl={qrState.dataUrl}
        onClose={closeQr}
      />

      <BookingDialog
        isOpen={bookingDialog.isOpen}
        event={bookingDialog.event}
        onClose={handleCloseBooking}
        onSubmit={handleSubmitBooking}
      />

      <SettingsDialog
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        handleLogout={handleLogout}
        currentUser={user}
        onUpdateSuccess={refetch}
      />
    </div>
  );
}
