import { Inter } from "next/font/google";
import "./globals.css";
import { RootProvider } from "@/components/providers/root-provider";

const interSans = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "Event Bazzar Hub",
  description: "Created by @bazzarhub",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${interSans.variable} antialiased bg-black`}>
        <RootProvider>{children}</RootProvider>
      </body>
    </html>
  );
}
