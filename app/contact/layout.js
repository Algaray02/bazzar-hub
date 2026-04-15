import { MetadataRoute } from "next";

export const metadata = {
  title: "Hubungi Kami - BazarHub",
  description:
    "Hubungi tim BazarHub untuk pertanyaan seputar event, kemitraan, atau dukungan teknis. Kami siap membantu 24/7.",
  keywords: ["kontak bazarhub", "support event", "mitra event organizer", "help desk"],
  openGraph: {
    title: "Hubungi Kami - BazarHub",
    description: "Hubungi tim BazarHub untuk pertanyaan seputar event dan kemitraan.",
    images: ["/og-image.png"],
  },
};

export default function ContactLayout({ children }) {
  return children;
}
