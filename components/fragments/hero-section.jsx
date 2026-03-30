import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      <div className="absolute inset-0 bg-[#030014]">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[20%] right-[20%] w-[300px] h-[300px] bg-rose-600/20 rounded-full blur-[100px]" />
      </div>

      <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-20"></div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-fuchsia-300 mb-6 backdrop-blur-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
              </span>
              Platform Event UMKM #1 di Indonesia
            </span>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-[1.1] tracking-tight">
              Eskalasi Bisnis dengan <br />
              <span className="text-transparent bg-clip-text bg-linear-to-r from-fuchsia-400 via-pink-400 to-rose-400">
                Ekosistem Digital
              </span>
            </h1>

            <p className="text-lg md:text-xl text-zinc-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Solusi all-in-one untuk manajemen booking booth, promosi event,
              dan analitik bisnis bazaar Anda dalam satu genggaman modern.
            </p>

            <Link
              href="/events"
              className="w-full sm:w-auto px-8 py-4 rounded-full bg-white/5 border border-white/10 text-white font-semibold hover:bg-white/10 transition-all backdrop-blur-sm"
            >
              Jelajahi Event
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="mt-16 md:mt-24"
          >
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 border-t border-white/10 pt-12">
              {[
                { label: "Total Event", value: "2.5K+" },
                { label: "Komunitas Seller", value: "15K+" },
                { label: "Kota Terjangkau", value: "34" },
                { label: "Transaksi Sukses", value: "99%" },
              ].map((stat, i) => (
                <div key={i} className="text-center">
                  <h3 className="text-3xl font-bold text-white mb-1">
                    {stat.value}
                  </h3>
                  <p className="text-sm text-zinc-500 uppercase tracking-wider">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
