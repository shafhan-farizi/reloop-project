import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidebarPengguna from "../components/SidebarPengguna";
import Topbar from "../components/Topbar";

export default function PenggunaLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      <SidebarPengguna open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-6">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <Outlet />
      </main>
    </div>
  );
}
