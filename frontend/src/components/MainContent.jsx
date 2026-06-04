import { useEffect, useState } from "react";
import DashboardCard from "./DashboardCard";
import api from "../api/xios";

import { FaUsers, FaBoxOpen, FaClipboardList, FaTruck } from "react-icons/fa";

export default function MainContent() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const response = await api.get("/admin/dashboard/stats");

        setStats(response.data.data.stats);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading || !stats) {
    return (
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        Loading dashboard...
      </div>
    );
  }

  return (
    <section className="space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-4xl font-bold text-orange-500">Dashboard</h1>

        <p className="mt-2 text-slate-500">Selamat Datang, {user?.name}</p>
      </div>

      {/* HERO */}
      <div className="relative overflow-hidden rounded-3xl bg-orange-500 p-8 shadow-xl">
        {" "}
        {/* Background Decoration */}
        <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10"></div>
        <div className="absolute right-20 bottom-0 h-32 w-32 rounded-full bg-white/10"></div>
        <div className="relative z-10 flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          {/* LEFT */}
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-100">
              Admin Dashboard
            </p>

            <h2 className="mt-2 text-4xl font-bold text-white">
              Halo, {user?.name} 👋
            </h2>

            <p className="mt-3 max-w-xl text-orange-50">
              Kelola pengguna, donasi, permintaan barang, dan pengiriman dalam
              satu dashboard terpusat.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                👥 {stats.users.active} User Aktif
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                📦 {stats.items.available} Barang Tersedia
              </span>

              <span className="rounded-full bg-white/20 px-4 py-2 text-sm font-medium text-white backdrop-blur-sm">
                🚚 {stats.shipments.in_transit} Pengiriman Berjalan
              </span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
              <p className="text-sm text-orange-100">Total User</p>

              <h3 className="mt-2 text-4xl font-bold text-white">
                {stats.users.total}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
              <p className="text-sm text-orange-100">Total Barang</p>

              <h3 className="mt-2 text-4xl font-bold text-white">
                {stats.items.total}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
              <p className="text-sm text-orange-100">Total Request</p>

              <h3 className="mt-2 text-4xl font-bold text-white">
                {stats.requests.total}
              </h3>
            </div>

            <div className="rounded-2xl bg-white/15 p-5 backdrop-blur-sm">
              <p className="text-sm text-orange-100">Total Shipment</p>

              <h3 className="mt-2 text-4xl font-bold text-white">
                {stats.shipments.total}
              </h3>
            </div>
          </div>
        </div>
      </div>

      {/* KPI */}
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        <DashboardCard
          title="Total User"
          value={stats.users.total}
          growth={`${stats.users.active} aktif`}
          icon={<FaUsers className="text-violet-600" />}
          iconBg="bg-violet-100"
        />

        <DashboardCard
          title="Total Barang"
          value={stats.items.total}
          growth={`${stats.items.available} tersedia`}
          icon={<FaBoxOpen className="text-emerald-600" />}
          iconBg="bg-emerald-100"
        />

        <DashboardCard
          title="Total Request"
          value={stats.requests.total}
          growth={`${stats.requests.pending} pending`}
          icon={<FaClipboardList className="text-orange-600" />}
          iconBg="bg-orange-100"
        />

        <DashboardCard
          title="Total Shipment"
          value={stats.shipments.total}
          growth={`${stats.shipments.in_transit} transit`}
          icon={<FaTruck className="text-blue-600" />}
          iconBg="bg-blue-100"
        />
      </div>

      {/* CONTENT */}
      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        {/* RINGKASAN */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">
            Ringkasan Platform
          </h2>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <StatBox
              title="User Aktif"
              value={stats.users.active}
              color="bg-violet-50"
            />

            <StatBox
              title="User Nonaktif"
              value={stats.users.inactive}
              color="bg-red-50"
            />

            <StatBox
              title="Barang Tersedia"
              value={stats.items.available}
              color="bg-emerald-50"
            />

            <StatBox
              title="Barang Reserved"
              value={stats.items.reserved}
              color="bg-orange-50"
            />
          </div>
        </div>

        {/* QUICK STATS */}
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900">Monitoring Cepat</h2>

          <div className="mt-6 space-y-4">
            <QuickItem label="Request Pending" value={stats.requests.pending} />

            <QuickItem
              label="Request Approved"
              value={stats.requests.approved}
            />

            <QuickItem
              label="Shipment Transit"
              value={stats.shipments.in_transit}
            />

            <QuickItem
              label="Shipment Delivered"
              value={stats.shipments.delivered}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function StatBox({ title, value, color }) {
  return (
    <div className={`rounded-2xl p-5 ${color}`}>
      <p className="text-sm text-slate-500">{title}</p>

      <h3 className="mt-2 text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}

function QuickItem({ label, value }) {
  return (
    <div className="flex items-center justify-between rounded-2xl bg-slate-50 p-4">
      <span className="text-slate-600">{label}</span>

      <span className="font-bold text-slate-900">{value}</span>
    </div>
  );
}
