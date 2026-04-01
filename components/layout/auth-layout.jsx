import { motion } from "framer-motion";
import Link from "next/link";
import { Store, ArrowLeft } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

const AuthLayout = ({ children, title, subtitle, onBack }) => (
  <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
    <div className="absolute inset-0 bg-[#030014]">
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-900/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[0%] right-[-5%] w-[600px] h-[600px] bg-pink-900/10 rounded-full blur-[120px]" />
    </div>
    <div className="absolute inset-0 bg-[url('https://grainy-linears.vercel.app/noise.svg')] opacity-20" />

    {onBack && (
      <button
        onClick={onBack}
        className="absolute top-6 left-6 z-50 p-2 rounded-lg bg-white/15 hover:bg-fuchsia-600/40 border border-white/30 hover:border-fuchsia-500/60 transition-all duration-200 text-white flex items-center gap-2 hover:gap-3 font-medium text-sm shadow-lg hover:shadow-fuchsia-500/20"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Kembali</span>
      </button>
    )}

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`w-full max-w-md relative z-10 ${onBack ? "mt-16 md:mt-0" : ""}`}
    >
      <Card className="bg-[#0a0a0b]/80 backdrop-blur-xl border-white/10 shadow-2xl relative overflow-hidden rounded-3xl">
        <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-fuchsia-500 to-transparent opacity-50" />
        <CardHeader className="text-center pt-8 pb-2">
          <Link href="/" className="inline-flex flex-col items-center group">
            <div className="w-14 h-14 rounded-2xl bg-linear-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20 mb-4 group-hover:shadow-fuchsia-500/40 transition-all duration-300">
              <Store className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-zinc-400 text-sm mt-2">{subtitle}</p>
          </Link>
        </CardHeader>
        <CardContent className="p-8 pt-6">{children}</CardContent>
      </Card>
    </motion.div>
  </div>
);

export default AuthLayout;
