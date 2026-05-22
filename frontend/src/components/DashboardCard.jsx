export default function DashboardCard({ title, value, caption, active }) {
  return (
    <div className={`rounded-3xl p-6 shadow-sm ${active ? 'bg-slate-900 text-white' : 'bg-white text-slate-900'}`}>
      <p className={`text-sm font-medium ${active ? 'text-slate-300' : 'text-slate-500'}`}>{title}</p>
      <p className={`mt-4 text-3xl font-semibold ${active ? 'text-white' : 'text-slate-900'}`}>{value}</p>
      <p className={`mt-2 text-sm ${active ? 'text-slate-300' : 'text-slate-500'}`}>{caption}</p>
    </div>
  )
}
