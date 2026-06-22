import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import {
  Bars3Icon,
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
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchKeyword, setSearchKeyword] = useState(searchParams.get("search") || "");
  const [user, setUser] = useState({ name: "Yanto", role: "Ag Donatur" });

  const searchRoute = () => {
    const pathname = location.pathname;
    if (pathname === "/admin") return "/admin/users";
    if (pathname.startsWith("/admin")) return pathname;
    if (pathname.startsWith("/penerima/cari")) return "/penerima/cari";
    if (pathname.startsWith("/penerima/request-saya")) return "/penerima/request-saya";
    if (pathname.startsWith("/pengguna/pengiriman")) return "/pengguna/pengiriman";
    if (pathname.startsWith("/catalog")) return "/catalog";
    if (pathname === "/penerima") return "/penerima/cari";
    return pathname;
  };

  const isSearchHidden = ["/pengaturan", "/profile", "/admin/tracking"].some((path) => location.pathname.endsWith(path)) || location.pathname === "/admin";

  const isBackButtonHidden = location.pathname.startsWith("/admin");

  const handleSearch = (event) => {
    event?.preventDefault();
    const query = searchKeyword.trim();
    const target = searchRoute();
    if (!query) {
      navigate(target);
      return;
    }
    navigate(`${target}?search=${encodeURIComponent(query)}`);
  };

  useEffect(() => {
    setSearchKeyword(searchParams.get("search") || "");
  }, [searchParams]);

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
    <header className="fixed top-0 left-0 right-0 lg:left-60 z-40 lg:z-50 bg-teal-500 px-4 md:px-6 py-2 shadow-sm text-white rounded-b-lg">
      <div className="flex items-center gap-3 justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-teal-600 text-white transition hover:bg-teal-700 lg:hidden"
          >
            <Bars3Icon className="h-6 w-6" />
          </button>
          <div>
            <div className="text-sm font-semibold text-white md:hidden">ReLoop</div>
            <h1 className="hidden md:block text-xl font-bold text-white">ReLoop Donation Platform</h1>
          </div>
        </div>

        {/* Center Section - Search */}
        {!isSearchHidden && (
          <form onSubmit={handleSearch} className="relative flex-1 mx-4 max-w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-4">
              <MagnifyingGlassIcon className="h-5 w-5 text-slate-400" />
            </div>
            <input
              type="search"
              placeholder="Cari Sesuatu..."
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              className="w-full rounded-full border border-white/20 bg-white px-12 py-2 text-sm text-slate-900 outline-none transition focus:border-white focus:ring-2 focus:ring-white/30"
              autoComplete="off"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/20 hover:bg-white/30 px-4 py-1.5 text-xs font-semibold text-white transition"
            >
              Cari
            </button>
          </form>
        )}

        {/* Right Section */}
        <div className="flex items-center gap-2 md:gap-3 justify-end">
          {!isBackButtonHidden && (
            <button
              onClick={() => navigate("/pilih-peran")}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
              title="Ubah Peran"
            >
              <ArrowUturnLeftIcon className="h-5 w-5" />
            </button>
          )}
          <div className="inline-flex items-center gap-3 rounded-full bg-white/15 px-3 md:px-4 py-2">
            <UserCircleIcon className="h-8 w-8 text-white" />
            <div className="text-left hidden md:block">
              <p className="text-sm font-semibold text-white">{user.name}</p>
              <p className="text-xs text-teal-100">{user.role}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
