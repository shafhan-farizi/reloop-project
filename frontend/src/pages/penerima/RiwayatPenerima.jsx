import { useEffect, useState } from "react";
import api from "../../api/xios";

export default function RiwayatPenerima() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shipments', {
        params: {
          as: 'requester',
          status: 'delivered',
          per_page: 20,
        },
      });
      const data = res.data.data?.shipments || res.data.data || res.data || [];
      setHistory(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat riwayat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-slate-900">Riwayat Penerima</h2>
        <p className="text-sm text-slate-500">Menampilkan barang yang sudah dikonfirmasi diterima oleh Anda dari tracking pengiriman.</p>
      </div>

      {loading ? (
        <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200 text-center text-slate-500">Memuat riwayat...</div>
      ) : history.length === 0 ? (
        <div className="rounded-[2rem] bg-white p-8 shadow-sm border border-slate-200 text-center text-slate-500">Belum ada pengiriman yang sudah dikonfirmasi diterima.</div>
      ) : (
        <div className="space-y-6">
          {history.map((h) => (
            <div key={h.id} className="rounded-[2rem] bg-white p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-24 w-24 rounded-3xl overflow-hidden bg-slate-100">
                    <img
                      src={h.request?.item?.images?.[0] || '/placeholder.png'}
                      alt={h.request?.item?.title || 'Barang'}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.target.src = '/placeholder.png'; }}
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{h.request?.item?.title || 'Barang tidak diketahui'}</h3>
                    <p className="text-sm text-slate-500 mt-1">{h.request?.item?.category?.name || 'Kategori tidak tersedia'}</p>
                    <p className="text-sm text-slate-500 mt-2">Donatur: <span className="font-semibold text-slate-900">{h.request?.item?.donor?.name || h.request?.item?.donor_name || '-'}</span></p>
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1 text-sm text-slate-600">
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">No. Resi</div>
                    <div className="mt-2 font-semibold text-slate-900">{h.tracking_number || '-'}</div>
                  </div>
                  <div className="rounded-3xl bg-slate-50 p-4">
                    <div className="text-xs uppercase tracking-[0.3em] text-slate-400">Tanggal Diterima</div>
                    <div className="mt-2 font-semibold text-slate-900">{h.delivered_at ? new Date(h.delivered_at).toLocaleDateString('id-ID') : '-'}</div>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="rounded-3xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-700 w-fit">Diterima</div>
                <div className="text-sm text-slate-600">Alamat Penerima: <span className="font-semibold text-slate-900">{h.request?.delivery_address || '-'}</span></div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}