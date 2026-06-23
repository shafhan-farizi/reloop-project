import { Outlet } from "react-router-dom";
import { useState } from "react";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100 flex pt-20 md:pt-22 lg:pt-24">

      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 w-full overflow-x-hidden px-4 sm:px-6 md:px-8 py-6 md:py-8 lg:px-8 lg:ml-60">

        <Topbar onMenuClick={() => setSidebarOpen(true)} />

        <div className="mt-8 md:mt-10">
          <Outlet />
        </div>

      </main>
    </div>
  );
}