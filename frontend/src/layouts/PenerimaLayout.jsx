import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidebarPenerima from "../components/SidebarPenerima";
import Topbar from "../components/Topbar";

export default function PenerimaLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex pt-16 md:pt-20">
      <SidebarPenerima 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 p-4 md:p-6 lg:ml-72">
        <div className="sticky top-0 z-20 bg-slate-100 p-4 md:p-6 pt-6">
          <Topbar onMenuClick={() => setSidebarOpen(true)} />
        </div>

        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}