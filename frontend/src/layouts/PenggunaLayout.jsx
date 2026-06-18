import { useState } from "react";
import { Outlet } from "react-router-dom";

import SidebarPengguna from "../components/SidebarPengguna";
import Topbar from "../components/Topbar";

export default function PenggunaLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex pt-16 md:pt-20">
      <SidebarPengguna open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 p-4 md:p-6 lg:ml-72">
        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="mt-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
