import { MetadataRoute } from "next";

export const metadata = {
  title: "Profil Tenant & UMKM - BazarHub",
  description: "Lihat profil dan produk tenant UMKM terbaik di BazarHub.",
  keywords: ["profil tenant", "UMKM", "produk lokal", "review toko"],
};

export default function TenantDetailLayout({ children }) {
  return children;
}
