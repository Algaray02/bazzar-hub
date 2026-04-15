"use client";
import { motion } from "framer-motion";
import {
  Store,
  Users,
  TrendingUp,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import HeroSection from "@/components/fragments/hero-section";
import { useEvents } from "@/hooks/use-events";
import { useBookings } from "@/hooks/use-bookings";
import { useReviews } from "@/hooks/use-reviews";
import { StatTenantCard } from "@/components/shared/card/tenant-card";
import { GuestEventCard } from "@/components/shared/card/event-card";
import { PageLoader } from "@/components/ui/page-loader";
import { PageError } from "@/components/ui/page-error";

const HomePage = () => {
  const { data: eventsData, isLoading: eventsLoading, error: eventsError } = useEvents({
    limit: 6,
  });
  const { data: bookingsData, isLoading: bookingsLoading, error: bookingsError } = useBookings({
    status: "PAID",
    limit: 50,
  });
  const { data: reviewsData, error: reviewsError } = useReviews({ limit: 100 });

  const events = eventsData || [];
  const bookings = bookingsData?.data || [];
  // Use reviews if available, otherwise use empty array (don't let review error break tenant display)
  const reviews = reviewsData?.data || [];

  // Determine loading states (don't consider reviews loading since it's not critical)
  const isLoading = eventsLoading || bookingsLoading;

  // Only consider critical errors (events and bookings), not reviews
  const hasCriticalError = eventsError || bookingsError;

  const topTenants = bookings
    .map((booking) => {
      const bookingReviews = reviews.filter((r) => r.bookingId === booking.id);

      const avgRating =
        bookingReviews.length > 0
          ? bookingReviews.reduce((sum, r) => sum + r.rating, 0) /
            bookingReviews.length
          : null;

      return {
        id: booking.id,
        name: booking.name,
        category: booking.category,
        rating: avgRating,
        image: booking.banner || booking.logo,
        location: booking.booth?.event?.city || "Jakarta",
      };
    })
    .filter((t) => t.rating !== null)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 8);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-fuchsia-500/30">
      <main>
        <HeroSection />

        <section className="py-24 bg-[#050505]">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: TrendingUp,
                  title: "Analitik Real-time",
                  desc: "Pantau performa penjualan booth Anda secara langsung melalui dashboard interaktif.",
                },
                {
                  icon: Users,
                  title: "Jaringan Luas",
                  desc: "Terhubung dengan ribuan organizer event terpercaya di seluruh Indonesia.",
                },
                {
                  icon: ShoppingBag,
                  title: "Sistem Booking Mudah",
                  desc: "Booking booth strategis hanya dengan 3 langkah mudah tanpa ribet.",
                },
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="p-8 rounded-2xl bg-white/5 border border-white/5 hover:border-fuchsia-500/30 hover:bg-white/10 transition-all group"
                >
                  <div className="w-12 h-12 rounded-lg bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="w-6 h-6 text-fuchsia-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-zinc-400 leading-relaxed">
                    {feature.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-linear-to-l from-fuchsia-900/10 to-transparent pointer-events-none" />
          <div className="container mx-auto px-6 relative">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  Event Terkurasi
                </h2>
                <p className="text-zinc-400 max-w-lg">
                  Temukan peluang bisnis terbaik di event-event pilihan minggu
                  ini.
                </p>
              </div>
              <Link
                href="/events"
                className="text-fuchsia-400 hover:text-fuchsia-300 font-medium flex items-center gap-2 group"
              >
                Lihat Semua Event{" "}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {eventsLoading ? (
              <div className="text-center py-10 text-zinc-400">
                <PageLoader message="Memuat event..." />
              </div>
            ) : eventsError ? (
              <div className="text-center py-10 text-red-400">
                Gagal memuat event: {eventsError.message}
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-10 text-zinc-500">
                Belum ada event tersedia
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {events.map((event, index) => (
                  <GuestEventCard key={event.id} event={event} index={index} />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-24 bg-[#0a0a0b] border-t border-white/5">
          <div className="container mx-auto px-6">
            <h2 className="text-2xl font-bold text-white mb-8 text-center">
              Top Tenant Bulan Ini
            </h2>
            {bookingsLoading ? (
              <div className="text-center py-10 text-zinc-400">
                <PageLoader message="Memuat tenant..." />
              </div>
            ) : bookingsError ? (
              <div className="text-center py-10 text-red-400">
                Gagal memuat tenant: {bookingsError.message}
              </div>
            ) : topTenants.length === 0 ? (
              <div className="text-center py-10 text-zinc-500">
                Belum ada tenant tersedia
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                {topTenants.map((tenant, index) => (
                  <StatTenantCard
                    key={tenant.id}
                    tenant={tenant}
                    index={index}
                  />
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-32 px-6 relative">
          <div className="container mx-auto relative">
            <div className="absolute inset-0 bg-linear-to-r from-fuchsia-600 to-pink-600 rounded-3xl blur-2xl opacity-20 transform rotate-1" />
            <div className="relative rounded-3xl bg-[#0F0F11] border border-white/10 p-12 md:p-20 text-center overflow-hidden">
              <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                Siap untuk Go Digital?
              </h2>
              <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                Bergabunglah dengan ekosistem BazarHub dan rasakan kemudahan
                mengelola event bisnis Anda hari ini.
              </p>
              <Link
                href="/auth/register"
                className="px-8 py-4 rounded-full bg-white text-black font-bold hover:bg-fuchsia-50 transition-all shadow-lg shadow-white/10"
              >
                Daftar Sebagai Seller
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t border-white/10 bg-[#050505] pt-16 pb-8">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div className="md:col-span-1">
              <Link href="/" className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 rounded-lg bg-linear-to-br from-fuchsia-600 to-pink-600 flex items-center justify-center">
                  <Store className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-bold text-white">BazarHub.</span>
              </Link>
              <p className="text-zinc-500 text-sm leading-relaxed">
                Platform ekosistem digital terdepan untuk menghubungkan UMKM
                dengan Event Organizer di seluruh Indonesia.
              </p>
            </div>

            {[
              {
                title: "Platform",
                links: [
                  { label: "Cari Event", href: "/events" },
                  { label: "Daftar Tenant", href: "/tenants" },
                  { label: "Blog", href: "/blog" },
                  { label: "Fitur", href: "/#features" },
                ],
              },
              {
                title: "Perusahaan",
                links: [
                  { label: "Tentang Kami", href: "/about" },
                  { label: "Karir", href: "/careers" },
                  { label: "Blog", href: "/blog" },
                  { label: "Hubungi Kami", href: "/contact" },
                ],
              },
              {
                title: "Legal",
                links: [
                  { label: "Syarat & Ketentuan", href: "/terms" },
                  { label: "Kebijakan Privasi", href: "/privacy" },
                  { label: "Guidelines", href: "/guidelines" },
                  { label: "Lisensi", href: "/license" },
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold text-white mb-4">{col.title}</h4>
                <ul className="space-y-2">
                  {col.links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className="text-zinc-500 hover:text-fuchsia-400 text-sm transition-colors"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-zinc-600">
            <p>&copy; 2025 BazarHub Inc. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="https://instagram.com/bazzarhub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Instagram BazarHub">
                Instagram
              </Link>
              <Link href="https://twitter.com/bazzarhub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="Twitter BazarHub">
                Twitter
              </Link>
              <Link href="https://linkedin.com/company/bazzarhub" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors" aria-label="LinkedIn BazarHub">
                LinkedIn
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;