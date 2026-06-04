import { useEffect, useMemo, useState } from "react";
import { getUserRequests } from "../../_service/request";

const statusTabs = [
  { key: "", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
  { key: "cancelled", label: "Selesai" },
];

export default function RequestSaya() {
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  const load = async (filterStatus = "") => {
    setLoading(true);
    try {
      const res = await getUserRequests({ status: filterStatus, per_page: 20 });
      setRequests(res.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load(status);
  }, [status]);

  const filteredRequests = useMemo(() => {
    return requests.filter((r) => {
      return (
        search === "" ||
        r.item?.title?.toLowerCase().includes(search.toLowerCase()) ||
        r.donor?.name?.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [requests, search]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Request Saya</h2>
      <p className="text-slate-600">Lihat semua permintaan barang yang anda ajukan</p>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {statusTabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setStatus(tab.key)}
            className={`rounded-full border px-4 py-2 text-sm font-semibold ${status === tab.key ? 'bg-emerald-500 text-white' : 'bg-white text-slate-700 shadow-sm'}`}
          >
            {tab.label}
          </button>
        ))}
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari Barang..."
          className="ml-auto min-w-[220px] rounded-full border px-4 py-2 text-sm"
        />
      </div>

      <div className="mt-4 bg-white rounded p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600"><th>Barang</th><th>Tanggal Request</th><th>Status</th><th>Donatur</th></tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={4} className="py-6 text-center">Loading...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center">Tidak ada request.</td></tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id} className="border-t">
                    <td className="py-3">
                      <div className="font-semibold">{r.item?.title || r.item_name}</div>
                      <div className="text-xs text-slate-500">{r.item?.category?.name || r.item?.category_name || '-'}</div>
                    </td>
                    <td>{new Date(r.created_at).toLocaleDateString()}</td>
                    <td>
                      <span className={`px-3 py-1 rounded-full text-xs ${
                        r.status === 'pending'
                          ? 'bg-orange-100 text-orange-700'
                          : r.status === 'approved'
                          ? 'bg-emerald-100 text-emerald-700'
                          : r.status === 'rejected'
                          ? 'bg-red-100 text-red-700'
                          : 'bg-slate-100 text-slate-700'
                      }`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.item?.donor?.name || r.donor?.name || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
