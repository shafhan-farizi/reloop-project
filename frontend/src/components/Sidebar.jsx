import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiClock, FiGrid, FiHome, FiLogOut, FiMap, FiSettings, FiTruck, FiUser, FiSearch, FiClipboard } from "react-icons/fi";
import { useState, useEffect } from "react";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("admin");

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserRole(userData.role || "admin");
      } catch (err) {
        console.error("Error parsing user:", err);
      }
    }
  }, []);

  const adminItems = [
    { label: "Dashboard", icon: <FiHome />, to: "/admin" },
    { label: "Users", icon: <FiUser />, to: "/admin/users" },
    { label: "Categories", icon: <FiGrid/> , to: "/admin/categories" },
    { label: "Tracking", icon: <FiMap/>, to: "/admin/tracking" },
    { label: "Riwayat", icon: <FiClock/>, to: "/admin/riwayat" },
    { label: "Management", icon: <FiSettings/>, to: "/admin/management" },
    { label: "Notifications", icon: <FiBell />, to: "/admin/notifications" },
    { label: "Keluar", icon: <FiLogOut />, to: "/logout" },
  ];

  const penerimaItems = [
    { label: "Beranda", icon: <FiHome />, to: "/penerima/beranda" },
    { label: "Cari Barang", icon: <FiSearch />, to: "/penerima/cari-barang" },
    { label: "Request Saya", icon: <FiClipboard />, to: "/penerima/request-saya" },
    { label: "Tracking Pengiriman", icon: <FiTruck />, to: "/penerima/tracking-pengiriman" },
    { label: "Riwayat Penerima", icon: <FiClock />, to: "/penerima/riwayat" },
    { label: "Notifikasi", icon: <FiBell />, to: "/penerima/notifikasi" },
    { label: "Profile", icon: <FiUser />, to: "/penerima/profile" },
    { label: "Pengaturan", icon: <FiSettings />, to: "/penerima/pengaturan" },
  ];

  const pengunaItems = [
    { label: "Dashboard", icon: <FiHome />, to: "/pengguna" },
    { label: "Request Masuk", icon: <FiClipboard />, to: "/pengguna/request-masuk" },
    { label: "Pengiriman", icon: <FiTruck />, to: "/pengguna/pengiriman" },
    { label: "Riwayat Donasi", icon: <FiClock />, to: "/pengguna/riwayat-donasi" },
    { label: "Tambah Donasi", icon: <FiGrid />, to: "/pengguna/tambah-donasi" },
    { label: "Notifikasi", icon: <FiBell />, to: "/pengguna/notifikasi" },
    { label: "Profile", icon: <FiUser />, to: "/pengguna/profile" },
    { label: "Pengaturan", icon: <FiSettings />, to: "/pengguna/pengaturan" },
  ];

  const navItems = userRole === "admin" ? adminItems : userRole === "donor" ? pengunaItems : penerimaItems;
  const bgColor = "bg-teal-600"; // Teal color for all roles
  const headerText = userRole === "admin" ? "ReLoop Admin" : userRole === "donor" ? "Donasi Kita" : "ReLoop";
  const headerDesc = userRole === "admin" ? "Dashboard utama untuk manajemen." : userRole === "donor" ? "Kelola donasi dan pengiriman dengan mudah." : "Kelola kebutuhan dan pengiriman dengan sederhana.";

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <>
      {/* Overlay mobile */}
      <div
        className={`fixed inset-0 z-30 bg-black/40 transition-opacity lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-56 lg:w-60 flex flex-col
        bg-teal-700 px-4 py-6 shadow-2xl transition duration-300
        lg:fixed lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="text-sm text-white/80">Menu</p>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/20 px-3 py-1 text-sm text-white hover:bg-white/30"
          >
            Close
          </button>
        </div>

        {/* Header */}
        <div className="hidden lg:block mb-10">
          <h1 className="text-2xl font-bold text-white">{headerText}</h1>
          <p className="text-sm text-white/80">
            {headerDesc}
          </p>
        </div>

        {/* Menu */}
        <nav className="flex-1 space-y-3">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-white text-teal-600 shadow-sm"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl text-lg">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Need Help */}
        <div className="hidden border-t border-teal-500 pt-6">
          <p className="font-semibold">Butuh bantuan?</p>
          <p className="mt-2 text-white/90 leading-relaxed">
            {userRole === "admin" 
              ? "Baca dokumentasi atau hubungi tim dev." 
              : "Hubungi admin atau cek petunjuk penggunaan."}
          </p>
        </div>

        {/* Profile*/}
        <div className="hidden mt-auto pt-6">
          <div className="flex items-center justify-between border-t border-white/30 pt-5">
            {/* Profile */}
            <div className="flex items-center gap-4">
              <img
                src="https://i.pravatar.cc/60"
                alt="avatar"
                className="h-12 w-12 rounded-full border-2 border-white shadow-md"
              />
              <div>
                <p className="text-base font-semibold text-white">
                  {userRole === "admin" ? "Admin Reloop" : userRole === "donor" ? "Donatur" : "Penerima"}
                </p>
                <p className="text-sm text-white/80">{userRole}</p>
              </div>
            </div>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center justify-center rounded-xl bg-white/20 p-3 text-white transition hover:bg-white/30"
              title="Logout"
            >
              <FiLogOut size={18} />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
