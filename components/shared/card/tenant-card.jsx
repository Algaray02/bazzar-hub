import { MapPin, Star, Store } from "lucide-react";
import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { getCategoryLabel } from "@/constant/category-store";

export const StatTenantCard = ({ tenant, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{
      delay: index * 0.1,
      type: "spring",
      stiffness: 100,
    }}
    whileHover={{
      y: -4,
      transition: { duration: 0.2 },
    }}
  >
    <Card className="bg-white/10 backdrop-blur-sm border-zinc-800/50 p-5 hover:bg-linear-to-br hover:from-zinc-900/80 hover:to-zinc-950/80 hover:border-fuchsia-500/30 transition-all duration-500 cursor-pointer group hover:shadow-xl hover:shadow-fuchsia-500/5">
      <div className="flex items-center gap-4">
        <motion.div
          className="w-16 h-16 rounded-full overflow-hidden border-2 border-zinc-700/50 group-hover:border-fuchsia-500 transition-all duration-300 shrink-0"
          whileHover={{ scale: 1.1, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <img
            src={tenant.image}
            alt={tenant.name}
            className="w-full h-full object-cover"
          />
        </motion.div>

        <div className="flex-1 min-w-0">
          <motion.h4
            className="font-semibold text-white truncate group-hover:text-fuchsia-400 transition-colors duration-300 text-base"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {tenant.name}
          </motion.h4>

          <motion.p
            className="text-sm text-zinc-400 truncate group-hover:text-zinc-300 transition-colors"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.3 }}
          >
            {getCategoryLabel(tenant.category)}
          </motion.p>

          <motion.div
            className="flex items-center gap-1 mt-1.5"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.1 + 0.4 }}
          >
            <Star className="w-3.5 h-3.5 text-yellow-500 fill-yellow-500" />
            <span className="text-sm font-medium text-zinc-300">
              {tenant.rating}
            </span>
            <span className="text-xs text-zinc-500 ml-1">rating</span>
          </motion.div>
        </div>
      </div>
    </Card>
  </motion.div>
);

export const TenantCard = ({ tenant, index }) => (
  <motion.div
    key={tenant.id}
    initial={{ opacity: 0, scale: 0.95 }}
    whileInView={{ opacity: 1, scale: 1 }}
    transition={{ delay: index * 0.05 }}
    viewport={{ once: true }}
  >
    <div className="group relative bg-[#0F0F11] border border-white/10 rounded-2xl overflow-hidden hover:border-fuchsia-500/50 transition-all hover:shadow-lg hover:shadow-fuchsia-500/10">
      <div className="h-48 overflow-hidden relative">
        {tenant.banner ? (
          <img
            src={tenant.banner}
            alt={tenant.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full bg-zinc-900 flex items-center justify-center text-zinc-700">
            <Store className="w-12 h-12" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors" />
        <div className="absolute top-3 left-3">
          <Badge
            variant="secondary"
            className="bg-black/50 backdrop-blur-md text-white border border-white/10"
          >
            {tenant.category.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="p-6">
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-fuchsia-400 transition-colors">
              {tenant.name}
            </h3>
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <Star className="w-4 h-4 fill-current" />
              <span className="font-bold">4.8</span>{" "}
              <span className="text-zinc-500 font-normal">(24 ulasan)</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center overflow-hidden shrink-0">
            {tenant.logo ? (
              <img
                src={tenant.logo}
                alt="Logo"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-xs font-bold text-zinc-400">Logo</span>
            )}
          </div>
        </div>

        <p className="text-zinc-400 text-sm line-clamp-2 mb-4 h-10">
          {tenant.description}
        </p>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2 text-zinc-300 text-xs font-medium">
              <MapPin className="w-3 h-3 text-fuchsia-500" />
              Sedang di:
            </div>
            <span className="text-zinc-500 text-xs truncate max-w-[150px]">
              {tenant.booth?.event?.location || "Belum ada event"}
            </span>
          </div>
          <Link
            href={`/tenants/${tenant.id}`}
            className="text-sm text-fuchsia-400 hover:text-fuchsia-300 hover:bg-fuchsia-500/10 px-4 py-3 rounded-md h-auto font-medium"
          >
            Lihat Profil
          </Link>
        </div>
      </div>
    </div>
  </motion.div>
);