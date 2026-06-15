import { useEffect, useMemo, useState } from "react";
import { getPublicItems } from "../../_service/item";
import { getUserRequests } from "../../_service/request";

const BASE_URL = "http://localhost:8000";

function getImageUrl(item) {
  if (item?.images && Array.isArray(item.images) && item.images.length > 0) {
    const path = item.images[0];
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/storage/${path}`;
  }
  return "/placeholder.png";
}

export default function Beranda() {
  const [requests, setRequests] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [requestData, itemData] = await Promise.all([
        getUserRequests({ per_page: 10 }),
        getPublicItems({ limit: 8 }),
      ]);

      setRequests(requestData.requests || []);
      setItems(itemData.items || itemData || []);
    } catch (error) {
      console.error("Gagal memuat dashboard penerima:", error);
      setRequests([]);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const counts = useMemo(() => {
    const summary = { total: 0, pending: 0, approved: 0, rejected: 0, cancelled: 0 };
    requests.forEach((request) => {
      summary.total += 1;
      summary[request.status] = (summary[request.status] || 0) + 1;
    });
    return summary;
  }, [requests]);

  const getItemCondition = (item) => {
    return item.condition || item.condition_name || item.condition_label || "Layak Pakai";
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">Penerima</p>
            <h1 className="mt-3 text-5xl font-bold uppercase tracking-[-0.03em] text-slate-900">HALO REQUESTER 👋 !!!</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">Terimakasih telah berbagi kebaikan hari ini.</p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-4">
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Total Requester</p>
            <p className="mt-4 text-3xl font-bold text-slate-900">{counts.total}</p>
            <p className="mt-2 text-sm text-slate-500">Request</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-emerald-600">Disetujui</p>
            <p className="mt-4 text-3xl font-bold text-slate-900">{counts.approved}</p>
            <p className="mt-2 text-sm text-slate-500">Request</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-rose-600">Ditolak</p>
            <p className="mt-4 text-3xl font-bold text-slate-900">{counts.rejected}</p>
            <p className="mt-2 text-sm text-slate-500">Request</p>
          </div>
          <div className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-6 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Dalam Pengiriman</p>
            <p className="mt-4 text-3xl font-bold text-slate-900">{counts.pending}</p>
            <p className="mt-2 text-sm text-slate-500">Request</p>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Rekomendasi Barang</h2>
            <p className="mt-1 text-sm text-slate-500">Temukan barang yang sesuai untuk kebutuhanmu.</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <select className="min-w-[180px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400">
              <option>Semua Kategori</option>
            </select>
            <select className="min-w-[180px] rounded-full border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 outline-none focus:border-emerald-400">
              <option>Semua Kondisi</option>
            </select>
          </div>
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <div className="col-span-full rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">Memuat rekomendasi barang...</div>
          ) : items.length === 0 ? (
            <div className="col-span-full rounded-[1.75rem] border border-slate-200 bg-slate-50 p-8 text-center text-slate-500">Belum ada barang tersedia saat ini.</div>
          ) : (
            items.map((item) => (
              <div key={item.id} className="rounded-[1.75rem] border border-slate-200 bg-white p-4 shadow-sm">
                <div className="h-44 overflow-hidden rounded-[1.5rem] bg-slate-100">
                  <img
                    src={getImageUrl(item)}
                    alt={item.title || "Barang"}
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title || "Tanpa judul"}</h3>
                  <p className="text-sm text-slate-500">{item.category?.name || item.category_name || "Kategori tidak tersedia"}</p>
                  <p className="text-sm text-slate-500">Kondisi: <span className="font-semibold text-slate-900">{getItemCondition(item)}</span></p>
                </div>
                <button className="mt-4 w-full rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">
                  Request
                </button>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
}