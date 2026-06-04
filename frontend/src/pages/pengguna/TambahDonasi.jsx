import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { EyeIcon, PencilSquareIcon, TrashIcon } from "@heroicons/react/24/outline";
import { deleteItem, getMyItems } from "../../_service/item";

// --- KONFIGURASI ---
const BASE_URL = "http://localhost:8000"; 

function getImageUrl(item) {
  // 1. Validasi struktur data images dari API
  if (item?.images && Array.isArray(item.images) && item.images.length > 0) {
    const firstImage = item.images[0];
    
    // 2. Ekstraksi path (mendukung struktur object atau string langsung)
    const path = typeof firstImage === 'object' 
      ? (firstImage.url || firstImage.path || firstImage.file_path) 
      : firstImage;
    
    if (path) {
      // 3. Jika path sudah full URL, gunakan langsung
      if (path.startsWith("http")) return path;
      
      // 4. Jika path relatif, gabungkan dengan BASE_URL + /storage/
      // Pastikan sudah menjalankan 'php artisan storage:link' di backend
      return `${BASE_URL}/storage/${path}`;
    }
  }

  // 5. Fallback ke placeholder jika data gambar tidak valid
  return "/placeholder.png";
}

function getStatusLabel(status) {
  const map = {
    available: "Tersedia",
    reserved: "Diproses",
    sent: "Dikirim",
    delivered: "Dikirim",
    cancelled: "Dibatalkan",
    failed: "Dibatalkan"
  };
  return map[status] || (status ? status.charAt(0).toUpperCase() + status.slice(1) : "Tidak diketahui");
}

function getStatusStyle(status) {
  const styles = {
    available: "bg-emerald-100 text-emerald-700",
    reserved: "bg-amber-100 text-amber-700",
    sent: "bg-sky-100 text-sky-700",
    delivered: "bg-sky-100 text-sky-700",
    cancelled: "bg-rose-100 text-rose-700",
    failed: "bg-rose-100 text-rose-700"
  };
  return styles[status] || "bg-slate-100 text-slate-700";
}

export default function TambahDonasi() {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const response = await getMyItems();
        setItems(Array.isArray(response.items) ? response.items : []);
      } catch (err) {
        console.error("Gagal memuat data:", err);
      } finally {
        setLoading(false);
      }
    };
    loadItems();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Yakin ingin menghapus donasi ini?")) return;
    try {
      await deleteItem(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Gagal menghapus donasi.");
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">Tambah Donasi Barang</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">Bagikan barang yang masih layak pakai.</h1>
          </div>
          <button
            onClick={() => navigate("/pengguna/tambah-donasi/form")}
            className="rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600"
          >
            + ADD DONASI
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="mt-6 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold uppercase">Nama barang</th>
                <th className="px-6 py-4 font-semibold uppercase">Kategori</th>
                <th className="px-6 py-4 font-semibold uppercase">Kondisi</th>
                <th className="px-6 py-4 font-semibold uppercase">Status</th>
                <th className="px-6 py-4 font-semibold uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center">Memuat...</td></tr>
              ) : items.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center">Belum ada donasi.</td></tr>
              ) : (
                items.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="px-6 py-5 flex items-center gap-4">
                      <div className="h-14 w-14 overflow-hidden rounded-3xl bg-slate-100">
                        <img
                          src={getImageUrl(item)}
                          alt={item.title}
                          className="h-14 w-14 object-cover"
                          // Jika gagal load dari storage, tetap tampilkan placeholder
                          onError={(e) => { e.target.src = "/placeholder.png"; }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900">{item.title}</span>
                    </td>
                    <td className="px-6 py-5">{item.category?.name || "-"}</td>
                    <td className="px-6 py-5">{item.condition || "-"}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-6 py-5 flex gap-2">
                      <button onClick={() => navigate(`/pengguna/tambah-donasi/${item.id}`)} className="p-2 border rounded-full"><EyeIcon className="h-5 w-5"/></button>
                      <button onClick={() => navigate(`/pengguna/tambah-donasi/${item.id}/edit`)} className="p-2 border rounded-full"><PencilSquareIcon className="h-5 w-5"/></button>
                      <button onClick={() => handleDelete(item.id)} className="p-2 border rounded-full text-rose-600"><TrashIcon className="h-5 w-5"/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}