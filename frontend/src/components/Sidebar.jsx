import { NavLink } from "react-router-dom";

export default function Sidebar({ open, onClose }) {
  const navItems = [
    { label: "Dashboard", icon: "D", to: "/admin" },
    { label: "Users", icon: "U", to: "/admin/users" },
    { label: "Categories", icon: "C", to: "/admin/categories" },
    { label: "Input Resi", icon: "I", to: "/admin/input-resi" },
    { label: "Tracking", icon: "T", to: "/admin/tracking" },
    { label: "Management", icon: "M", to: "/admin/management" },
    { label: "Notifications", icon: "N", to: "/admin/notifications" },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
      />

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-white px-5 py-6 shadow-xl transition duration-300 lg:static lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <div>
            <p className="text-sm text-slate-500">Dashboard mobile.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-2xl bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            Close
          </button>
        </div>

        <div className="hidden lg:block mb-10">
          <div className="mb-4 text-2xl font-semibold text-slate-900">
            ReLoop Admin
          </div>
          <p className="text-sm text-slate-500">
            Dashboard utama untuk manajemen.
          </p>
        </div>
        {/* sidebar  */}
        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all ${
                  isActive
                    ? "bg-slate-100 text-slate-900 shadow-sm"
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`
              }
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-slate-50 p-4 text-sm text-slate-600 shadow-sm">
          <p className="font-semibold text-slate-900">Need help?</p>
          <p className="mt-2">Baca dokumentasi atau hubungi tim dev.</p>
        </div>
      </aside>
    </>
  );
}
