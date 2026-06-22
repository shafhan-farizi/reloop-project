import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getPublicItems } from "../../_service/item";

const BASE_URL = "http://localhost:8000";

function getImageUrl(item) {
  if (item?.images && Array.isArray(item.images) && item.images.length > 0) {
    const path = item.images[0];
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/storage/${path}`;
  }
  return "/placeholder.png";
}

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState(searchParams.get("search") || "");
  const [searching, setSearching] = useState(false);

  const loadItems = async (search = "") => {
    setLoading(true);
    try {
      const data = await getPublicItems({ search, per_page: 24 });
      setItems(data.items || []);
    } catch (error) {
      console.error("Gagal memuat katalog:", error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const currentSearch = searchParams.get("search") || "";
    setQ(currentSearch);
    loadItems(currentSearch);
  }, [searchParams]);

  const handleSearch = async (event) => {
    event.preventDefault();
    setSearching(true);
    try {
      setSearchParams(q ? { search: q } : {});
      await loadItems(q);
    } finally {
      setSearching(false);
    }
  };

  return (
    <div className="space-y-8 py-10 px-4 mx-auto max-w-screen-xl lg:px-8">
      <div className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Katalog Barang</p>
            <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">Temukan barang donasi dan kebutuhan populer.</h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Jelajahi katalog barang yang tersedia dan temukan bantuan yang cocok untuk kebutuhanmu.
            </p>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Masuk untuk Request
          </Link>
        </div>

        <form onSubmit={handleSearch} className="mt-8 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="search"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            placeholder="Cari barang berdasarkan nama, kategori, atau kondisi"
            className="w-full rounded-full border border-slate-200 bg-slate-50 px-5 py-3 text-sm text-slate-900 outline-none focus:border-emerald-400"
          />
          <button
            type="submit"
            disabled={searching}
            className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {searching ? "Mencari..." : "Cari Barang"}
          </button>
        </form>
      </div>

      <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full rounded-[2rem] border border-slate-200/70 bg-white p-8 text-center text-slate-500">
            Memuat katalog barang...
          </div>
        ) : items.length === 0 ? (
          <div className="col-span-full rounded-[2rem] border border-slate-200/70 bg-white p-8 text-center text-slate-500">
            Tidak ada barang yang cocok dengan pencarian ini.
          </div>
        ) : (
          items.map((item) => (
            <div key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <img
                className="h-44 w-full object-cover"
                src={getImageUrl(item)}
                alt={item.name || item.title || "Item donasi"}
                onError={(event) => { event.target.src = "/placeholder.png"; }}
              />
              <div className="p-5">
                <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">{item.category?.name || "Barang"}</p>
                <h2 className="mt-3 text-lg font-semibold text-slate-900">{item.name || item.title || "Tanpa judul"}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">{item.description || "Deskripsi singkat tentang barang ini."}</p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-700">
                    {item.condition || item.condition_name || "Layak Pakai"}
                  </span>
                  <Link
                    to="/login"
                    className="rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-700"
                  >
                    Request
                  </Link>
                </div>
              </div>
            </div>
          ))
        )}
      </section>
    </div>
  );
}
