import { NavLink } from "react-router-dom";

export default function SidebarPenerima({ open, onClose }) {
  const navItems = [
    { label: 'Beranda', icon: '🏠', to: '/penerima' },
    { label: 'Cari Barang', icon: '🔍', to: '/penerima/cari' },
    { label: 'Request Saya', icon: '📝', to: '/penerima/request-saya' },
    { label: 'Tracking Pengiriman', icon: '🚚', to: '/penerima/tracking' },
    { label: 'Riwayat Penerima', icon: '📜', to: '/penerima/riwayat' },
  ];

  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-900/40 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-slate-200 bg-slate-950 px-5 py-6 shadow-2xl transition duration-300 lg:static lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <div>
            <div className="text-2xl font-semibold text-white">Reloop</div>
            <p className="text-sm text-slate-400">Dashboard penerima.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-3xl bg-slate-800 px-3 py-2 text-sm font-semibold text-white"
          >
            Tutup
          </button>
        </div>

        <div className="hidden lg:block mb-10">
          <div className="mb-4 text-3xl font-semibold text-white">Reloop</div>
          <p className="text-sm text-slate-400">Kelola kebutuhan dan pengiriman dengan sederhana.</p>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-3xl px-4 py-3 text-sm font-medium transition ${
                  isActive ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-200 hover:bg-emerald-600 hover:text-white'
                }`
              }
            >
              <span className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-white/10 text-white">
                {item.icon}
              </span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="mt-auto rounded-3xl bg-slate-800 p-4 text-sm text-slate-300 shadow-sm">
          <p className="font-semibold text-white">Butuh bantuan?</p>
          <p className="mt-2">Hubungi admin atau cek petunjuk penggunaan.</p>
        </div>
      </aside>
    </>
  );
}
