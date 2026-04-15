import { MetadataRoute } from "next";

export const metadata = {
  title: "Leaderboard Tenant & UMKM - BazarHub",
  description:
    "Jelajahi tenant dan UMKM terbaik berdasarkan rating dan review. Support bisnis lokal Indonesia.",
  keywords: [
    "tenant UMKM",
    "leaderboard seller",
    "UMKM terbaik",
    "review bisnis",
    "rating toko",
  ],
  openGraph: {
    title: "Leaderboard Tenant & UMKM - BazarHub",
    description:
      "Jelajahi tenant dan UMKM terbaik berdasarkan rating dan review.",
    images: ["/og-image.png"],
  },
};

export default function TenantsLayout({ children }) {
  return children;
}
