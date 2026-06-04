import { useEffect, useState } from "react";
import api from "../../api/xios";

export default function RiwayatPenerima() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      // Pastikan endpoint sesuai, biasanya /requests untuk riwayat penerima
      const res = await api.get('/requests'); 
      const data = res.data.data || res.data || [];
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
      <h2 className="text-2xl font-bold text-slate-900">Riwayat Penerima</h2>
      
      <div className="bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="text-slate-500 uppercase text-xs tracking-wider">
              <tr className="border-b border-slate-200">
                <th className="px-6 py-4">Barang</th>
                <th className="px-6 py-4">Tanggal Request</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Donatur</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan={4} className="p-10 text-center">Memuat riwayat...</td></tr>
              ) : history.length > 0 ? (
                history.map((h) => (
                  <tr key={h.id}>
                    <td className="px-6 py-5 font-semibold text-slate-900">{h.item?.title || "Barang tidak diketahui"}</td>
                    <td className="px-6 py-5">{h.created_at ? new Date(h.created_at).toLocaleDateString("id-ID") : "-"}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        h.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        h.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {h.status === 'approved' ? 'Disetujui' : h.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="px-6 py-5">{h.item?.donor?.name || h.donor_name || '-'}</td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan={4} className="p-10 text-center text-slate-500">Belum ada riwayat penerimaan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}