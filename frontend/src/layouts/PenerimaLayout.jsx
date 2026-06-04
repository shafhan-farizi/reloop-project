import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidebarPenerima from "../components/SidebarPenerima";
import Topbar from "../components/Topbar";

export default function PenerimaLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SidebarPenerima open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <Outlet />
      </main>
    </div>
  );
}
