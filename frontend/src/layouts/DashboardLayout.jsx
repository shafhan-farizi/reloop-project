import { Outlet } from "react-router-dom";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";

export default function DashboardLayout() {
  return (
    <div className="min-h-screen bg-slate-100 flex pt-16 md:pt-20">

      <Sidebar />

      <main className="flex-1 p-4 md:p-6 lg:ml-72">

        <Topbar  />

        <div className="mt-6">
          <Outlet />
        </div>

      </main>
    </div>
  );
}