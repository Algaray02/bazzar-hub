import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

const SidebarItem = ({ item, isActive, isCollapsed, onClick }) => {
  return (
    <Link
      href={item.url}
      onClick={onClick}
      className={`group relative flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 ${
        isActive
          ? "text-white"
          : "text-zinc-400 hover:text-white hover:bg-white/5"
      }`}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 bg-linear-to-r from-fuchsia-600 to-pink-600 rounded-xl shadow-[0_0_20px_rgba(217,70,239,0.3)]"
          initial={false}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        />
      )}

      <span className="relative z-10 flex items-center gap-3 w-full">
        <item.icon
          className={`w-5 h-5 ${
            isActive
              ? "text-white"
              : "text-zinc-400 group-hover:text-fuchsia-400"
          } transition-colors`}
        />

        {!isCollapsed && (
          <motion.span
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="font-medium truncate"
          >
            {item.title}
          </motion.span>
        )}

        {!isCollapsed && isActive && (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="ml-auto"
          >
            <ChevronRight className="w-4 h-4 text-white/70" />
          </motion.div>
        )}
      </span>
    </Link>
  );
};

export default SidebarItem;