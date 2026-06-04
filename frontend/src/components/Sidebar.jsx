import { NavLink, useNavigate } from "react-router-dom";
import { FiBell, FiClock, FiGrid, FiHome, FiLogOut, FiMap, FiSettings, FiTruck, FiUser } from "react-icons/fi";

export default function Sidebar({ open, onClose }) {
  const navigate = useNavigate();

  const navItems = [
    { label: "Dashboard", icon: <FiHome />, to: "/admin" },
    { label: "Users", icon: <FiUser />, to: "/admin/users" },
    { label: "Categories", icon: <FiGrid/> , to: "/admin/categories" },
    { label: "Input Resi", icon: <FiTruck/> , to: "/admin/input-resi" },
    { label: "Tracking", icon: <FiMap/>, to: "/admin/tracking" },
    {label: "Riwayat", icon: <FiClock/>, to: "/admin/riwayat" },
    { label: "Management", icon: <FiSettings/>, to: "/admin/management" },
    { label: "Notifications", icon: <FiBell/>, to: "/admin/notifications" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
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
        className={`fixed inset-y-0 left-0 z-40 w-72 flex flex-col
        bg-[#14B8A6] px-5 py-6 shadow-2xl transition duration-300
        lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Mobile */}
        <div className="mb-6 flex items-center justify-between lg:hidden">
          <p className="text-sm text-white/80">Menu</p>
          <button
            onClick={onClose}
            className="rounded-xl bg-white/20 px-3 py-1 text-sm text-white"
          >
            Close
          </button>
        </div>

        {/* Header */}
        <div className="hidden lg:block mb-10">
          <h1 className="text-2xl font-bold text-white">ReLoop Admin</h1>
          <p className="text-sm text-white/80">
            Dashboard utama untuk manajemen.
          </p>
        </div>

        {/* Menu */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-white/30 text-white shadow-sm"
                    : "text-white/90 hover:bg-white/20 hover:text-white"
                }`
              }
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 text-white">
                {item.icon}
              </span>
              <span className="font-medium">{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Need Help */}
        <div className="mt-8 rounded-3xl bg-white/20 p-5 text-sm text-white shadow">
          <p className="font-semibold">Need help?</p>
          <p className="mt-2 text-white/90 leading-relaxed">
            Baca dokumentasi atau hubungi tim dev.
          </p>
        </div>

        {/* Profile + Logout */}
        <div className="mt-auto pt-6">
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
                  Admin Relopp
                </p>
                <p className="text-sm text-white/80">Admin</p>
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
