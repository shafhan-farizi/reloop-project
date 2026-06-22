import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUserRequests } from "../../_service/request";

const statusTabs = [
  { key: "", label: "Semua" },
  { key: "pending", label: "Menunggu" },
  { key: "approved", label: "Disetujui" },
  { key: "rejected", label: "Ditolak" },
];

const statusLabel = {
  pending: "Menunggu",
  approved: "Disetujui",
  rejected: "Ditolak",
  cancelled: "Dibatalkan",
};

export default function RequestSaya() {
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [meta, setMeta] = useState({});

  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

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

  const getRequestStatusLabel = (request) => {
    if (request.shipment?.delivered_at) return "Selesai";
    return statusLabel[request.status] || request.status || "-";
  };

  const requestStatusCount = (key) => {
    return requests.filter((r) => r.status === key).length;
  };

  useEffect(() => {
    load(status);
  }, [status]);

  const filteredRequests = useMemo(() => {
    if (!searchQuery) return requests;
    return requests.filter((r) => {
      const title = r.item?.title || r.item_name || "";
      const donorName = r.item?.donor?.name || r.donor?.name || "";
      return (
        title.toLowerCase().includes(searchQuery) ||
        donorName.toLowerCase().includes(searchQuery)
      );
    });
  }, [requests, searchQuery]);

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

      </div>

      <div className="rounded-3xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm text-slate-500">Jumlah Request</p>
            <h3 className="text-2xl font-semibold text-slate-900">{meta?.total ?? requests.length}</h3>
          </div>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {statusTabs.filter((t) => t.key).map((tab) => (
              <div key={tab.key} className="rounded-3xl border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs text-slate-500">{tab.label}</p>
                <p className="text-lg font-semibold text-slate-900">{requestStatusCount(tab.key)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="hidden sm:block mt-6 overflow-x-auto">
            <table className="w-full min-w-[520px] text-left text-sm text-slate-600">
              <thead className="border-b border-slate-200 text-slate-500">
                <tr>
                  <th className="px-4 py-3">Barang</th>
                  <th className="px-4 py-3">Tanggal Request</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Donatur</th>
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
                        <td className="px-4 py-3">
                          <div className="font-semibold text-slate-900">{item.title || r.item_name || "-"}</div>
                          <div className="text-xs text-slate-500">{item.category?.name || item.category_name || "-"}</div>
                          <div className="text-xs text-slate-500 mt-1">{item.shipping_type === 'free' ? 'Ongkir dibayar oleh pengirim' : item.shipping_type === 'paid' ? 'Ongkir dibayar oleh penerima' : '-'}</div>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                            r.shipment?.delivered_at
                              ? 'bg-emerald-100 text-emerald-700'
                              : r.status === 'pending'
                              ? 'bg-amber-100 text-amber-700'
                              : r.status === 'approved'
                              ? 'bg-emerald-100 text-emerald-700'
                              : r.status === 'rejected'
                              ? 'bg-rose-100 text-rose-700'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {getRequestStatusLabel(r)}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-slate-700">{donorName}</td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden mt-4">
            {loading ? (
              <div className="py-6 text-center text-slate-500">Memuat request...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="py-6 text-center text-slate-500">Tidak ada request.</div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((r) => {
                  const item = r.item || {};
                  const donorName = item.donor?.name || r.donor?.name || "-";
                  return (
                    <div key={r.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold text-slate-900 text-sm truncate">{item.title || r.item_name || '-'}</div>
                              <div className="text-xs text-slate-500">{item.category?.name || item.category_name || '-'}</div>
                            </div>
                            <div className="text-xs text-slate-400">{r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-'}</div>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                              r.shipment?.delivered_at
                                ? 'bg-emerald-100 text-emerald-700'
                                : r.status === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : r.status === 'approved'
                                ? 'bg-emerald-100 text-emerald-700'
                                : r.status === 'rejected'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-100 text-slate-700'
                            }`}>
                              {getRequestStatusLabel(r)}
                            </span>

                            <div className="text-xs text-slate-600">{donorName}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
