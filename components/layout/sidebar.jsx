import { motion } from "framer-motion";
import {
  Calendar,
  CheckSquare,
  FileText,
  LayoutDashboard,
  LogOut,
  Mail,
  QrCode,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";
import SidebarItem from "../fragments/sidebar-item";
import { signOut } from "next-auth/react";

const MENU_ITEMS = [
  { title: "Dashboard", url: "/admin", icon: LayoutDashboard },
  { title: "Kelola Event", url: "/admin/events", icon: Calendar },
  { title: "Kelola User", url: "/admin/users", icon: Users },
  { title: "Verifikasi Booking", url: "/admin/bookings", icon: CheckSquare },
  { title: "Kelola Blog", url: "/admin/blogs", icon: FileText },
  { title: "Kelola Pesan", url: "/admin/messages", icon: Mail },
];

const BOTTOM_ITEMS = [
  { title: "Pengaturan", url: "/admin/settings", icon: Settings },
];

const Sidebar = ({ isOpen, setIsOpen, isMobile }) => {
  const pathname = usePathname();

  const sidebarVariants = {
    open: { width: "280px", x: 0, transition: { type: "spring", damping: 20 } },
    closed: {
      width: "80px",
      x: 0,
      transition: { type: "spring", damping: 20 },
    },
    mobileClosed: {
      x: "-100%",
      width: "280px",
      transition: { type: "spring", damping: 20 },
    },
  };

  const currentState = isMobile
    ? isOpen
      ? "open"
      : "mobileClosed"
    : isOpen
    ? "open"
    : "closed";

  const handleLogout = async () => {
    await signOut({
      callbackUrl: "/auth/login",
    });
  };

  return (
    <>
      {isMobile && isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
        />
      )}

      <motion.aside
        initial={false}
        animate={currentState}
        variants={sidebarVariants}
        className={`fixed left-0 top-0 h-screen bg-[#0a0a0b] border-r border-white/10 z-50 flex flex-col overflow-hidden shadow-2xl`}
      >
        <div className="h-20 flex items-center px-6 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-tr from-fuchsia-600 to-pink-600 flex items-center justify-center shadow-lg shadow-fuchsia-500/20 shrink-0">
              <QrCode className="w-5 h-5 text-white" />
            </div>
            {(isOpen || isMobile) && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xl font-bold text-white tracking-tight whitespace-nowrap"
              >
                Bazar<span className="text-fuchsia-500">Hub</span>.
              </motion.span>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-8 scrollbar-hide">
          <div>
            {(isOpen || isMobile) && (
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                Main Menu
              </h3>
            )}
            <div className="space-y-2">
              {MENU_ITEMS.map((item) => (
                <SidebarItem
                  key={item.url}
                  item={item}
                  isActive={pathname === item.url}
                  isCollapsed={!isOpen && !isMobile}
                  onClick={() => isMobile && setIsOpen(false)}
                />
              ))}
            </div>
          </div>

          <div>
            {(isOpen || isMobile) && (
              <h3 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-4 px-2">
                System
              </h3>
            )}
            <div className="space-y-2">
              {BOTTOM_ITEMS.map((item) => (
                <SidebarItem
                  key={item.url}
                  item={item}
                  isActive={pathname === item.url}
                  isCollapsed={!isOpen && !isMobile}
                  onClick={() => isMobile && setIsOpen(false)}
                />
              ))}

              <button
                onClick={handleLogout}
                className={`w-full group relative flex items-center gap-3 px-3 py-3 cursor-pointer rounded-xl transition-all duration-300 text-red-400 hover:bg-red-500/10 hover:text-red-300`}
              >
                <LogOut className="w-5 h-5 shrink-0" />
                {(isOpen || isMobile) && (
                  <span className="font-medium whitespace-nowrap">Logout</span>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/5 bg-white/5">
          <div
            className={`flex items-center gap-3 ${
              !isOpen && !isMobile ? "justify-center" : ""
            }`}
          >
            <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 border border-white/10">
              <UserCircle className="w-6 h-6 text-zinc-400" />
            </div>
            {(isOpen || isMobile) && (
              <div className="overflow-hidden">
                <p className="text-sm font-semibold text-white truncate">
                  Admin Super
                </p>
                <p className="text-xs text-zinc-500 truncate">
                  super@bazarhub.com
                </p>
              </div>
            )}
          </div>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;