import { Bell, Calendar, Menu, Search } from "lucide-react";

const TopBar = ({ toggleSidebar, isCollapsed }) => {
  return (
    <header
      className={`h-20 border-b border-white/5 bg-[#0a0a0b]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30 transition-all duration-300`}
    >
      <div className="flex items-center gap-4">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="hidden md:flex items-center gap-2 bg-white/5 rounded-full px-4 py-2 border border-white/10 focus-within:border-fuchsia-500/50 transition-colors w-64">
          <Search className="w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent border-none outline-none text-sm text-white placeholder:text-zinc-600 w-full"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 rounded-full hover:bg-white/5 text-zinc-400 hover:text-white transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1.5 right-2 w-2 h-2 bg-fuchsia-500 rounded-full border-2 border-[#0a0a0b]" />
        </button>
        <div className="h-8 w-px bg-white/10 mx-2" />
        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-medium text-white">Administrator</div>
            <div className="text-xs text-zinc-500">Online</div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;