import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidebarPenerima from "../components/SidebarPenerima";
import Topbar from "../components/Topbar";

export default function PenerimaLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="h-screen bg-slate-100 flex overflow-hidden">
      <SidebarPenerima 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 flex flex-col overflow-y-auto">
        <div className="sticky top-0 z-20 bg-slate-100 p-6 pt-6">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <div className="px-6 pb-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}