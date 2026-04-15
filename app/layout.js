import { Inter } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/components/providers/root-provider";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  metadataBase: new URL("https://bazzarhub.algaray.biz.id"),
  title: {
    default: "BazarHub - Platform Booking Booth Event UMKM Indonesia",
    template: "%s | BazarHub",
  },
  description:
    "BazarHub adalah platform digital terdepan untuk booking booth event bazar dan festival. Hubungkan UMKM dengan organizer event terpercaya di seluruh Indonesia.",
  keywords: [
    "booking booth",
    "event bazar",
    "UMKM Indonesia",
    "penyewaan booth",
    "festival UMKM",
    "event organizer",
    "bazar digital",
    "platform event",
  ],
  authors: [{ name: "BazarHub" }],
  creator: "BazarHub",
  publisher: "BazarHub",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: "https://bazzarhub.algaray.biz.id",
    siteName: "BazarHub",
    title: "BazarHub - Platform Booking Booth Event UMKM Indonesia",
    description:
      "Platform digital terdepan untuk booking booth event bazar dan festival. Hubungkan UMKM dengan organizer event terpercaya.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "BazarHub - Platform Event UMKM",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "BazarHub - Platform Booking Booth Event UMKM Indonesia",
    description:
      "Platform digital terdepan untuk booking booth event bazar dan festival.",
    images: ["/og-image.png"],
    creator: "@bazzarhub",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "BazarHub",
  url: "https://bazzarhub.algaray.biz.id",
  logo: "https://bazzarhub.algaray.biz.id/logo.png",
  description:
    "Platform digital terdepan untuk booking booth event bazar dan festival di Indonesia.",
  sameAs: [
    "https://instagram.com/bazzarhub",
    "https://twitter.com/bazzarhub",
    "https://linkedin.com/company/bazzarhub",
  ],
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+62-857-2814-1488",
    contactType: "customer service",
    availableLanguage: ["Indonesian", "English"],
    areaServed: "ID",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
      </head>
      <body className={`${interSans.variable} antialiased bg-black`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
