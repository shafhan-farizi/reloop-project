import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidebarPenerima from "../components/SidebarPenerima";
import Topbar from "../components/Topbar";

export default function PenerimaLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex pt-20 md:pt-22 lg:pt-24">
      <SidebarPenerima 
        open={sidebarOpen} 
        onClose={() => setSidebarOpen(false)} 
      />

      <main className="flex-1 px-5 md:px-8 py-6 md:py-8 lg:px-8 lg:ml-60">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="mt-8 md:mt-10">
          <Outlet />
        </div>
      </main>
    </div>
  );
}