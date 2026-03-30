import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";

const StatCard = ({ label, value, icon: Icon, color, subtext, index = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 20, scale: 0.95 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    transition={{
      delay: index * 0.1,
      duration: 0.5,
      type: "spring",
      stiffness: 100,
    }}
    whileHover={{
      y: -8,
      transition: { duration: 0.2 },
    }}
  >
    <Card className="group relative bg-white/10 border-zinc-700 rounded-3xl p-6 overflow-hidden transition-all duration-500 hover:border-fuchsia-500/30 hover:shadow-2xl hover:shadow-fuchsia-500/10">
      <motion.div
        className="absolute inset-0 bg-linear-to-br from-fuchsia-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100"
        initial={false}
        transition={{ duration: 0.5 }}
      />

      <motion.div
        className={`absolute -top-4 -right-4 opacity-10 ${color}`}
        whileHover={{ scale: 1.15, rotate: 5, opacity: 0.15 }}
        transition={{ duration: 0.5, type: "spring" }}
      >
        <Icon className="w-28 h-28 blur-sm" />
      </motion.div>

      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
        <motion.div
          className="absolute inset-0 bg-linear-to-r from-transparent via-white/5 to-transparent"
          initial={{ x: "-100%" }}
          whileHover={{ x: "100%" }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.span
            className="text-zinc-400 text-sm font-medium tracking-wide uppercase"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            {label}
          </motion.span>

          <motion.div
            className={`p-2.5 rounded-xl bg-linear-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 ${color}`}
            whileHover={{ scale: 1.15, rotate: 8 }}
            transition={{ type: "spring", stiffness: 300, damping: 15 }}
          >
            <Icon className="w-5 h-5" />
          </motion.div>
        </div>

        <div className="space-y-2">
          <motion.div
            className="text-4xl font-bold text-white tracking-tight group-hover:text-white/90 transition-colors"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.3, type: "spring" }}
          >
            {value}
          </motion.div>

          <div className="flex items-center gap-2">
            <motion.div
              className="h-px flex-1 bg-linear-to-r from-zinc-700 to-transparent"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ delay: index * 0.1 + 0.4, duration: 0.5 }}
              style={{ transformOrigin: "left" }}
            />
            <motion.span
              className="text-xs text-zinc-500 font-medium"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.1 + 0.5 }}
            >
              {subtext}
            </motion.span>
          </div>
        </div>
      </div>

      <motion.div
        className={`absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-current to-transparent ${color}`}
        initial={{ opacity: 0, scaleX: 0 }}
        whileHover={{ opacity: 0.5, scaleX: 1 }}
        transition={{ duration: 0.5 }}
      />

      <div className="absolute top-0 right-0 w-32 h-32 bg-linear-to-bl from-fuchsia-500/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl" />
    </Card>
  </motion.div>
);

export default StatCard;