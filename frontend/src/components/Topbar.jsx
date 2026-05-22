export default function Topbar({ onMenuClick }) {
  return (
    <header className="mb-6 rounded-3xl bg-white p-5 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-11 w-11 items-center justify-center rounded-3xl bg-slate-100 text-slate-700 transition hover:bg-slate-200 lg:hidden"
          >
            <span className="text-lg font-semibold">☰</span>
          </button>
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-sky-500">Admin Dashboard</p>
            <h1 className="mt-2 text-3xl font-semibold text-slate-900">Slicing Kerangka Utama</h1>
            <p className="mt-1 text-sm text-slate-500">Sidebar dan topbar dengan struktur dasar untuk panel admin.</p>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 shadow-sm">
            <span className="text-sm text-slate-600">Tanggal:</span>
            <span className="ml-2 font-medium text-slate-900">22 Mei 2026</span>
          </div>
          <button className="inline-flex items-center justify-center rounded-3xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
            Notifications
          </button>
        </div>
      </div>
    </header>
  )
}
