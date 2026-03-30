"use client";

import { useEffect } from "react";
import Sidebar from "@/components/layout/sidebar";
import TopBar from "@/components/layout/top-bar";
import { useState } from "react";

export default function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
      else setIsSidebarOpen(true);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <div className="min-h-screen bg-black text-zinc-100 font-sans selection:bg-fuchsia-500/30 flex">
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-fuchsia-900/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[0%] right-[-5%] w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[120px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
      </div>

      <Sidebar
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
        isMobile={isMobile}
      />

      <div
        className={`flex-1 flex flex-col min-h-screen transition-all duration-300 relative z-10`}
        style={{
          marginLeft: !isMobile ? (isSidebarOpen ? "280px" : "80px") : "0px",
        }}
      >
        <TopBar
          toggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
          isCollapsed={!isSidebarOpen}
        />

        <main className="flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
