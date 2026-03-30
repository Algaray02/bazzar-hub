"use client";

import Link from "next/link";
import { ArrowLeft, FileQuestion, Home } from "lucide-react";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-zinc-100">
      <div className="absolute inset-0 bg-[#030014]">
        <div className="absolute top-[20%] left-[20%] w-[500px] h-[500px] bg-fuchsia-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[20%] right-[20%] w-[600px] h-[600px] bg-pink-900/10 rounded-full blur-[120px]" />
      </div>
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

      <div className="relative z-10 container mx-auto px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-2xl mx-auto"
        >
          <div className="relative mb-8 inline-block">
            <h1 className="text-[10rem] md:text-[14rem] font-bold leading-none tracking-tighter text-transparent bg-clip-text bg-linear-to-b from-white/10 to-transparent select-none">
              404
            </h1>
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="bg-linear-to-r from-fuchsia-600 to-pink-600 p-6 rounded-3xl shadow-[0_0_50px_rgba(217,70,239,0.4)] rotate-12">
                <FileQuestion className="w-16 h-16 text-white" />
              </div>
            </motion.div>
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Halaman Tidak Ditemukan
          </h2>
          <p className="text-zinc-400 text-lg mb-10 max-w-lg mx-auto">
            Maaf, halaman yang Anda cari mungkin telah dipindahkan, dihapus,
            atau mungkin tidak pernah ada di dimensi ini.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              onClick={() => window.history.back()}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full cursor-pointer bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all flex items-center justify-center gap-2 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Kembali
            </button>

            <Link
              href="/"
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-linear-to-r from-fuchsia-600 to-pink-600 text-white font-bold hover:shadow-[0_0_20px_rgba(217,70,239,0.4)] hover:scale-105 transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-4 h-4" />
              Ke Beranda
            </Link>
          </div>
        </motion.div>
      </div>

      <div className="absolute bottom-8 text-zinc-600 text-xs uppercase tracking-widest">
        BazarHub System Error
      </div>
    </div>
  );
};
