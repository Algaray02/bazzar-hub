import { MetadataRoute } from "next";

export const metadata = {
  title: "Masuk - BazarHub",
  description: "Masuk ke akun BazarHub Anda untuk mengelola booth dan event.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AuthLayout({ children }) {
  return children;
}
