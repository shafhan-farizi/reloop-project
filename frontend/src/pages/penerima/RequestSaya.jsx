import { useEffect, useMemo, useState } from "react";
import { getUserRequests } from "../../_service/request";

const statusTabs = [
  { key: "", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
  { key: "cancelled", label: "Selesai" },
];

const statusLabel = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  cancelled: "Selesai",
};

export default function RequestSaya() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({});

  const load = async (filterStatus = "") => {
    setLoading(true);
    try {
      const res = await getUserRequests({ status: filterStatus, per_page: 20 });
      setRequests(res.requests || []);
      setMeta(res.meta || {});
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(status);
  }, [status]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      const title = r.item?.title || r.item_name || "";
      const donorName = r.item?.donor?.name || r.donor?.name || "";
      return (
        search === "" ||
        title.toLowerCase().includes(search.toLowerCase()) ||
        donorName.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [requests, search]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900">Request Saya</h2>
        <p className="text-slate-600">Lihat semua permintaan barang yang Anda ajukan.</p>
      </div>

      <div className="flex flex-wrap gap-3">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${
              status === tab.key ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm'
            }`}
          >
            {tab.label}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Barang atau Donatur..."
          className="ml-auto min-w-[220px] rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm"
        />
      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Jumlah Request</p>
            <h3 className="text-2xl font-semibold text-slate-900">{meta?.total ?? requests.length}</h3>
          </div>
          <div className="grid gap-2 sm:grid-cols-4">
            {statusTabs.filter((t) => t.key).map((tab) => (
              <div key={tab.key} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs text-slate-500">{tab.label}</p>
                <p className="text-lg font-semibold text-slate-900">{requests.filter((r) => r.status === tab.key).length}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-6 overflow-x-auto">
          <table className="w-full min-w-[700px] text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 text-slate-500">
              <tr>
                <th className="px-6 py-3">Barang</th>
                <th className="px-6 py-3">Tanggal Request</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Donatur</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">Memuat request...</td>
                </tr>
              ) : filteredRequests.length === 0 ? (
                <tr>
                  <td colSpan={4} className="py-10 text-center text-slate-500">Tidak ada request.</td>
                </tr>
              ) : (
                filteredRequests.map((r) => {
                  const item = r.item || {};
                  const donorName = item.donor?.name || r.donor?.name || "-";
                  return (
                    <tr key={r.id} className="border-b border-slate-200 last:border-none">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900">{item.title || r.item_name || "-"}</div>
                        <div className="text-xs text-slate-500">{item.category?.name || item.category_name || "-"}</div>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-'}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          r.status === 'pending'
                            ? 'bg-amber-100 text-amber-700'
                            : r.status === 'approved'
                            ? 'bg-emerald-100 text-emerald-700'
                            : r.status === 'rejected'
                            ? 'bg-rose-100 text-rose-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {statusLabel[r.status] || r.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{donorName}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
