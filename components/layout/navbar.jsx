"use client";
import { motion } from "framer-motion";
import { Menu, Store, X } from "lucide-react";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const nav = [
    { name: "Beranda", url: "/" },
    { name: "Event", url: "/events" },
    { name: "Penyewa", url: "/tenants" },
    { name: "Blog", url: "/blogs" },
    { name: "Kontak", url: "/contact" },
  ];

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-black/40 backdrop-blur-xl border-b border-white/10 shadow-2xl shadow-fuchsia-900/10"
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <motion.a
            href="/"
            className="flex items-center gap-3 group relative z-10"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-2xl bg-linear-to-tr from-fuchsia-600 via-pink-600 to-rose-500 blur-lg opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />
              <div className="relative w-12 h-12 flex items-center justify-center rounded-2xl bg-linear-to-tr from-fuchsia-600 via-pink-600 to-rose-500 shadow-lg group-hover:shadow-fuchsia-500/50 transition-all duration-300">
                <Store className="w-6 h-6 text-white" strokeWidth={2.5} />
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-white tracking-tight leading-none">
                Bazar
                <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 to-pink-400">
                  Hub
                </span>
              </span>
              <span className="text-[10px] text-zinc-400 font-medium tracking-wider">
                PREMIUM MARKETPLACE
              </span>
            </div>
          </motion.a>

          <div className="hidden lg:flex items-center gap-2">
            {nav.map((item, index) => {
              const isActive =
                item.url === "/"
                  ? pathname === "/"
                  : pathname.startsWith(item.url);

              return (
                <motion.a
                  key={item.url}
                  href={item.url}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative px-4 py-2 group"
                >
                  <span
                    className={`text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? "text-white"
                        : "text-zinc-400 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>

                  <motion.span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-fuchsia-500 via-pink-500 to-rose-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: isActive ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                  />

                  <motion.span
                    className="absolute inset-0 rounded-lg bg-linear-to-r from-fuchsia-500/10 via-pink-500/10 to-rose-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    whileHover={{ scale: 1.05 }}
                  />
                </motion.a>
              );
            })}
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="hidden lg:block"
          >
            <Link
              href="/auth/register"
              className="relative overflow-hidden text-sm px-6 py-2 rounded-full border-0 font-semibold text-white bg-linear-to-r from-fuchsia-600 via-pink-600 to-rose-600 hover:from-fuchsia-500 hover:via-pink-500 hover:to-rose-500 shadow-lg shadow-fuchsia-500/30 hover:shadow-fuchsia-500/50 duration-300 inline-flex items-center gap-2"
            >
              Join Us
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </Link>
          </motion.div>

          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="lg:hidden">
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-fuchsia-800 hover:text-white rounded-xl"
              >
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent
              side="right"
              className="w-[300px] sm:w-[400px] bg-black/95 backdrop-blur-2xl border-l border-white/10"
            >
              <SheetHeader className="mb-8">
                <SheetTitle className="text-left text-2xl font-bold text-white">
                  Menu
                </SheetTitle>
              </SheetHeader>
              <div className="flex flex-col gap-3">
                {nav.map((item, index) => {
                  const isActive =
                    item.url === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.url);

                  return (
                    <motion.a
                      key={item.url}
                      href={item.url}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                      onClick={() => setIsOpen(false)}
                      className={`relative px-6 py-4 rounded-xl font-semibold transition-all duration-300 ${
                        isActive
                          ? "bg-linear-to-r from-fuchsia-600/20 via-pink-600/20 to-rose-600/20 text-white border border-fuchsia-500/30"
                          : "text-zinc-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {item.name}
                      {isActive && (
                        <motion.span
                          layoutId="activeMobile"
                          className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-fuchsia-500 via-pink-500 to-rose-500 rounded-r-full"
                        />
                      )}
                    </motion.a>
                  );
                })}
                <Link
                  href="/auth/register"
                  className="mt-6 p-4 w-full bg-linear-to-r from-fuchsia-600 via-pink-600 to-rose-600 text-white font-semibold rounded-xl"
                >
                  Join Us
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    →
                  </motion.span>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <motion.div
        className="absolute bottom-0 left-0 h-0.5 bg-linear-to-r from-fuchsia-500 via-pink-500 to-rose-500"
        style={{
          width: isScrolled ? "100%" : "0%",
          transition: "width 0.3s ease",
        }}
      />
    </motion.nav>
  );
};

export default Navbar;
