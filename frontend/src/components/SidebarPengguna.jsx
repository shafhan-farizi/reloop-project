import { NavLink } from "react-router-dom";
import {
  HomeIcon,
  PlusCircleIcon,
  InboxArrowDownIcon,
  TruckIcon,
  ClockIcon,
  BellIcon,
  UserCircleIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const mainNav = [
  { label: 'Dashboard', icon: HomeIcon, to: '/pengguna' },
  { label: 'Tambah Donasi', icon: PlusCircleIcon, to: '/pengguna/tambah-donasi' },
  { label: 'Request Masuk', icon: InboxArrowDownIcon, to: '/pengguna/request-masuk' },
  { label: 'Pengiriman', icon: TruckIcon, to: '/pengguna/pengiriman' },
  { label: 'Riwayat Donasi', icon: ClockIcon, to: '/pengguna/riwayat' },
];

const secondaryNav = [
  { label: 'Notifikasi', icon: BellIcon, to: '/pengguna/notifikasi' },
  { label: 'Profile', icon: UserCircleIcon, to: '/pengguna/profile' },
  { label: 'Pengaturan', icon: Cog6ToothIcon, to: '/pengguna/pengaturan' },
  { label: 'Keluar', icon: ArrowRightOnRectangleIcon, to: '/logout' },
];

export default function SidebarPengguna({ open, onClose }) {
  return (
    <>
      <div
        className={`fixed inset-0 z-30 bg-slate-950/60 transition-opacity lg:hidden ${open ? 'opacity-100' : 'pointer-events-none opacity-0'}`}
        onClick={onClose}
      />

      <aside className={`fixed inset-y-0 left-0 z-40 w-56 lg:w-60 transform flex flex-col bg-teal-700 px-4 py-6 shadow-2xl transition duration-300 lg:fixed lg:translate-x-0 ${
        open ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="mb-8 flex items-center justify-between lg:hidden">
          <div>
            <div className="text-2xl font-semibold text-white">Donasi Kita</div>
            <p className="text-sm text-teal-100">Kelola donasi dengan mudah.</p>
          </div>
          <button
            onClick={onClose}
            className="rounded-3xl bg-white/10 px-3 py-2 text-sm font-semibold text-white"
          >
            Tutup
          </button>
        </div>

        <div className="hidden lg:block mb-10">
          <div className="mb-4 text-3xl font-semibold text-white">Donasi Kita</div>
          <p className="text-sm text-teal-100">Kelola donasi dan pengiriman dengan mudah.</p>
        </div>

        <nav className="flex-1 space-y-3">
          {mainNav.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.label}
                to={item.to}
                onClick={onClose}
                className={({ isActive }) =>
                  `flex items-center gap-4 rounded-[2rem] px-4 py-3 text-sm font-medium transition ${
                    isActive ? 'bg-white text-teal-700 shadow-lg' : 'text-teal-100 hover:bg-white/10 hover:text-white'
                  }`
                }
              >
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-[1.5rem] bg-white/10 text-white">
                  <Icon className="h-6 w-6" />
                </span>
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        <div className="mt-auto border-t border-teal-500 pt-6">
          <nav className="space-y-2">
            {secondaryNav.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.label}
                  to={item.to}
                  onClick={onClose}
                  className="flex items-center gap-4 rounded-[1.75rem] px-4 py-3 text-sm font-medium text-teal-100 transition hover:bg-white/10 hover:text-white"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-[1.5rem] bg-white/10 text-white">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>
      </aside>
    </>
  );
}
