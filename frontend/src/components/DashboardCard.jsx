export default function DashboardCard({ title, value, growth, icon, iconBg = 'bg-slate-100' }) {
  return (
    <div className="rounded-3xl bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">{value}</h2>
          <p className="mt-2 text-xs font-semibold text-emerald-600">{growth}</p>
        </div>
        <div className={`flex h-16 w-16 items-center justify-center rounded-2xl text-2xl ${iconBg}`}>
          {icon}
        </div>
      </div>
    </div>
  )
}