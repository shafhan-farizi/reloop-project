import { useEffect, useState } from "react";
import api from "../../api/xios";

// --- KONFIGURASI ---
const BASE_URL = "http://localhost:8000";

// Fungsi untuk mendapatkan URL gambar yang valid
function getImageUrl(item) {
  if (item?.images && Array.isArray(item.images) && item.images.length > 0) {
    const path = item.images[0];
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/storage/${path}`;
  }
  return "/placeholder.png";
}

export default function Beranda() {
  const [summary, setSummary] = useState({});
  const [items, setItems] = useState([]);

  const load = async () => {
    try {
      const res = await api.get('/items?limit=8');
      
      // Ambil data array dengan aman, menyesuaikan struktur API yang umum
      const data = res.data?.data || res.data?.items || (Array.isArray(res.data) ? res.data : []);
      setItems(data);
      
      // Summary placeholder
      setSummary({ total_requester: 5, approved: 3, rejected: 1, sending: 2 });
    } catch (err) {
      console.error("Gagal memuat data:", err);
      setItems([]); // Set array kosong jika terjadi error agar tidak crash
    }
  };

  useEffect(() => { 
    load(); 
  }, []);

  return (
    <div>
      <h2 className="text-2xl font-bold text-emerald-600">HALO REQUESTER 👋 !!!</h2>
      <p className="text-slate-600">Terimakasih telah berbagi kebaikan hari ini</p>

      {/* Grid Summary */}
      <div className="mt-6 grid grid-cols-4 gap-4">
        <div className="p-4 border rounded">Total Requester<br/><b>{summary.total_requester || 0}</b></div>
        <div className="p-4 border rounded">Disetujui<br/><b>{summary.approved || 0}</b></div>
        <div className="p-4 border rounded">Ditolak<br/><b>{summary.rejected || 0}</b></div>
        <div className="p-4 border rounded">Dalam Pengiriman<br/><b>{summary.sending || 0}</b></div>
      </div>

      {/* Daftar Barang */}
      <div className="mt-8">
        <h3 className="font-semibold mb-4">Barang Tersedia</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {items.length > 0 ? (
            items.map(i => (
              <div key={i.id} className="border rounded p-4 bg-white shadow-sm">
                <div className="h-36 overflow-hidden rounded-lg mb-3 bg-slate-100">
                  <img 
                    src={getImageUrl(i)} 
                    alt={i.title} 
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                </div>
                <div className="font-semibold text-slate-900">{i.title}</div>
                <div className="text-xs text-slate-500">{i.category?.name || i.category_name || "-"}</div>
                <div className="mt-3">
                  <button className="px-3 py-1 border rounded text-sm hover:bg-slate-50 transition">Request</button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500 italic">Belum ada barang tersedia saat ini.</p>
          )}
        </div>
      </div>
    </div>
  );
}