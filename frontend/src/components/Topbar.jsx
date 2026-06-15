import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bars3Icon,
  BellIcon,
  EnvelopeIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
  ArrowUturnLeftIcon,
} from "@heroicons/react/24/outline";





function getRoleLabel(role) {
  if (!role) return "Ag Donatur";
  if (role === "admin") return "Admin";
  if (role === "penerima") return "Penerima";
  if (role === "donor" || role === "pengguna") return "Ag Donatur";
  return role.charAt(0).toUpperCase() + role.slice(1);
}

export default function Topbar({ onMenuClick }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "Yanto", role: "Ag Donatur" });
  useEffect(() => {
    const raw = localStorage.getItem("user");
    if (!raw) return;

    try {
      const parsed = JSON.parse(raw);
      setUser({
        name: parsed.name || parsed.full_name || parsed.username || "Yanto",
        role: getRoleLabel(parsed.role),
      });
    } catch (error) {
      console.error("Failed to parse user from localStorage", error);
    }
  }, []);


  return (
    <header className="mb-6 rounded-[2rem] bg-teal-500 px-5 py-4 shadow-[0_32px_80px_rgba(15,23,42,0.08)] text-white">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-[#14B8A6] text-white transition hover:bg-[#0f9c8f] lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>

          <div>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              ReLoop Donation Platform
            </h1>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-2xl">
          <div className="absolute inset-y-0 left-0 flex items-center pl-4">
            <MagnifyingGlassIcon className="h-5 w-5 text-teal-600" />
          </div>
          <input
            type="search"
            placeholder="Cari Sesuatu..."
            className="w-full rounded-full border border-white/20 bg-white px-14 py-3 text-sm text-slate-900 outline-none transition duration-200 focus:border-white focus:ring-2 focus:ring-white/30"
          />
        </div>

        <div className="flex items-center gap-3 justify-end">
          <button
            onClick={() => navigate("/pilih-peran")}
            className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white transition hover:bg-white/25"
            title="Ubah Peran"
          >
            <ArrowUturnLeftIcon className="h-5 w-5" />
          </button>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white transition hover:bg-white/25">
            <BellIcon className="h-5 w-5" />
          </button>
          <button className="inline-flex h-12 w-12 items-center justify-center rounded-3xl bg-white/15 text-white transition hover:bg-white/25">
            <EnvelopeIcon className="h-5 w-5" />
          </button>
          <div className="inline-flex items-center gap-3 rounded-3xl bg-white/15 px-4 py-2">
            <UserCircleIcon className="h-8 w-8 text-white" />
            <div className="text-left">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-teal-100">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
