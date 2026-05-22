import DashboardCard from './DashboardCard.jsx'

export default function MainContent() {
  return (
    <section className="grid gap-5 xl:grid-cols-[1.4fr_0.8fr]">
      <div className="space-y-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <DashboardCard
            title="Total Users"
            value="2.480"
            caption="Aktif dalam 30 hari terakhir."
            active
          />
          <DashboardCard
            title="Orders"
            value="1.132"
            caption="Pesanan terbaru dan status pembayaran."
          />
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Overview aktivitas</h2>
              <p className="mt-1 text-sm text-slate-500">Ringkasan aktivitas admin dan performa.</p>
            </div>
            <button className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700">View all</button>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Pending</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">24</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Approved</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">87</p>
            </div>
            <div className="rounded-3xl bg-slate-50 p-4">
              <p className="text-sm text-slate-500">Rejected</p>
              <p className="mt-3 text-2xl font-semibold text-slate-900">5</p>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Quick Actions</h2>
              <p className="mt-1 text-sm text-slate-500">Akses cepat untuk fitur admin.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-3">
            <button className="w-full rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800">Tambah Item</button>
            <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Lihat Kategori</button>
            <button className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 hover:bg-slate-50">Kelola Request</button>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Topbar</h2>
          <p className="mt-2 text-sm text-slate-500">Contoh topbar dengan tombol dan status pengguna.</p>
          <div className="mt-6 flex flex-col gap-4 rounded-3xl bg-slate-50 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm text-slate-500">Admin</p>
              <p className="mt-1 text-base font-semibold text-slate-900">Randi</p>
            </div>
            <button className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Sign out</button>
          </div>
        </div>
      </div>
    </section>
  )
}
