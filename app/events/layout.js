import { MetadataRoute } from "next";

export const metadata = {
  title: "Jadwal Event Bazar & Festival - BazarHub",
  description:
    "Temukan jadwal lengkap event bazar, festival musik, dan car free day di seluruh Indonesia. Booking booth mudah dan cepat.",
  keywords: [
    "jadwal event",
    "bazar Indonesia",
    "festival UMKM",
    "event mingguan",
    "car free day",
    "booking booth",
  ],
  openGraph: {
    title: "Jadwal Event Bazar & Festival - BazarHub",
    description:
      "Temukan jadwal lengkap event bazar, festival musik, dan car free day di seluruh Indonesia.",
    images: ["/og-image.png"],
  },
};

export default function EventsLayout({ children }) {
  return children;
}
