import { MetadataRoute } from "next";

export const metadata = {
  title: "Jadwal Event Bazar & Festival Indonesia - BazarHub",
  description:
    "Temukan dan booking booth di event bazar, festival musik, dan car free day terbaik di seluruh Indonesia.",
  keywords: ["event bazar", "festival Indonesia", "booking booth", "UMKM event"],
};

export default function EventDetailLayout({ children }) {
  return children;
}
