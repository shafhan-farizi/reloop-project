import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

  const filteredItems = useMemo(() => {
    if (!searchQuery) return items;
    return items.filter((item) =>
      (item.title || "").toLowerCase().includes(searchQuery)
    );
  }, [items, searchQuery]);

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
    <div className="space-y-6 sm:space-y-8 md:space-y-8">
      <section className="rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 shadow-sm">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-orange-500">Tambah Donasi Barang</p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Bagikan barang yang masih layak pakai.</h1>
          </div>
          <button
            onClick={() => navigate("/pengguna/tambah-donasi/form")}
            className="rounded-full bg-orange-500 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-orange-600 whitespace-nowrap"
          >
            + ADD DONASI
          </button>
        </div>
      </section>

      <section className="rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div>
          <div className="hidden sm:block mt-4 sm:mt-6 overflow-x-auto rounded-lg sm:rounded-xl md:rounded-[2rem] border border-slate-200 bg-white">
            <table className="min-w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="bg-slate-50 text-slate-500">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold uppercase">Barang</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold uppercase hidden sm:table-cell">Kategori</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold uppercase hidden md:table-cell">Kondisi</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold uppercase">Status</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold uppercase">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={5} className="p-6 sm:p-10 text-center text-xs sm:text-sm">Memuat...</td></tr>
              ) : filteredItems.length === 0 ? (
                <tr><td colSpan={5} className="p-6 sm:p-10 text-center text-xs sm:text-sm">Tidak ada donasi yang cocok.</td></tr>
              ) : (
                filteredItems.map((item) => (
                  <tr key={item.id} className="border-b border-slate-200">
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 flex items-center gap-2 sm:gap-4">
                      <div className="h-10 w-10 sm:h-14 sm:w-14 overflow-hidden rounded-lg sm:rounded-3xl bg-slate-100 flex-shrink-0">
                        <img
                          src={getImageUrl(item)}
                          alt={item.title}
                          className="h-full w-full object-cover"
                          onError={(e) => { e.target.src = "/placeholder.png"; }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{item.title}</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 hidden sm:table-cell text-xs sm:text-sm">{item.category?.name || "-"}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 hidden md:table-cell text-xs">{item.condition || "-"}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5">
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold inline-block ${getStatusStyle(item.status)}`}>
                        {getStatusLabel(item.status)}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 flex gap-1 sm:gap-2">
                      <button onClick={() => navigate(`/pengguna/tambah-donasi/${item.id}`)} className="p-1.5 sm:p-2 border rounded-lg sm:rounded-full hover:bg-slate-50"><EyeIcon className="h-4 w-4 sm:h-5 sm:w-5"/></button>
                      <button onClick={() => navigate(`/pengguna/tambah-donasi/${item.id}/edit`)} className="p-1.5 sm:p-2 border rounded-lg sm:rounded-full hover:bg-slate-50"><PencilSquareIcon className="h-4 w-4 sm:h-5 sm:w-5"/></button>
                      <button onClick={() => handleDelete(item.id)} className="p-1.5 sm:p-2 border rounded-lg sm:rounded-full text-rose-600 hover:bg-rose-50"><TrashIcon className="h-4 w-4 sm:h-5 sm:w-5"/></button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>

          <div className="block sm:hidden mt-4">
            {loading ? (
              <div className="p-4 text-center text-sm text-slate-500">Memuat...</div>
            ) : filteredItems.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">Tidak ada donasi yang cocok.</div>
            ) : (
              <div className="space-y-3">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100 flex-shrink-0">
                        <img src={getImageUrl(item)} alt={item.title} className="h-full w-full object-cover" onError={(e)=>{e.target.src='/placeholder.png'}} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-900 text-sm truncate">{item.title}</div>
                            <div className="text-xs text-slate-500">{item.category?.name || '-'}</div>
                          </div>
                          <div className="text-xs text-slate-400">{item.created_at ? new Date(item.created_at).toLocaleDateString('id-ID') : ''}</div>
                        </div>

                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${getStatusStyle(item.status)}`}>{getStatusLabel(item.status)}</span>
                          <div className="flex gap-2">
                            <button onClick={() => navigate(`/pengguna/tambah-donasi/${item.id}`)} className="p-1.5 border rounded-lg text-xs">View</button>
                            <button onClick={() => navigate(`/pengguna/tambah-donasi/${item.id}/edit`)} className="p-1.5 border rounded-lg text-xs">Edit</button>
                            <button onClick={() => handleDelete(item.id)} className="p-1.5 border rounded-lg text-xs text-rose-600 hover:bg-rose-50">Delete</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}