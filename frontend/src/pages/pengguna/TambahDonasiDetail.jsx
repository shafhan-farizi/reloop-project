import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { getItem } from "../../_service/item";

export default function TambahDonasiDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadItem = async () => {
      try {
        const response = await getItem(id);
        setItem(response);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Gagal memuat detail barang.");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadItem();
    }
  }, [id]);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        {loading ? (
          <div className="py-20 text-center text-slate-500">Memuat detail barang...</div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-100 bg-rose-50 px-6 py-10 text-center text-rose-700">{error}</div>
        ) : !item ? (
          <div className="py-20 text-center text-slate-500">Barang tidak ditemukan.</div>
        ) : (
          <div className="grid gap-8 xl:grid-cols-[1.3fr_0.7fr]">
            <div className="space-y-8">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <h1 className="text-3xl font-bold text-slate-900">{item.title}</h1>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">{item.description}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    {item.category?.name || "Kategori tidak tersedia"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    {item.condition || "Kondisi tidak tersedia"}
                  </span>
                  <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-700">
                    {item.shipping_type === "free" ? "Gratis untuk penerima" : item.shipping_type === "paid" ? "Biaya ditanggung penerima" : "Opsi pengiriman tidak tersedia"}
                  </span>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Galeri Foto</h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {(item.images || []).length > 0 ? (
                    item.images.map((image, index) => (
                      <div key={index} className="overflow-hidden rounded-[1.75rem] bg-slate-100">
                        <img
                          src={typeof image === "string" ? image : image.url || image.path}
                          alt={`${item.title} ${index + 1}`}
                          className="h-40 w-full object-cover"
                        />
                      </div>
                    ))
                  ) : (
                    <div className="col-span-full rounded-[1.75rem] border border-dashed border-slate-300 bg-slate-50 p-12 text-center text-slate-500">
                      Belum ada foto untuk barang ini.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
                <h2 className="text-xl font-semibold text-slate-900">Detail Barang</h2>
                <div className="mt-6 space-y-4 text-sm text-slate-700">
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Status</div>
                    <p className="mt-2 font-semibold text-slate-900">{item.status || "-"}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Lokasi</div>
                    <p className="mt-2 font-semibold text-slate-900">{item.location || "-"}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Tanggal input</div>
                    <p className="mt-2 font-semibold text-slate-900">{item.created_at ? new Date(item.created_at).toLocaleDateString("id-ID") : "-"}</p>
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.24em] text-slate-500">Jumlah request</div>
                    <p className="mt-2 font-semibold text-slate-900">{item.requests_count ?? 0}</p>
                  </div>
                </div>
              </div>

              <div className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-slate-900">Aksi</h2>
                <div className="mt-6 flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/pengguna/tambah-donasi")}
                    className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
                  >
                    Kembali ke daftar donasi
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
