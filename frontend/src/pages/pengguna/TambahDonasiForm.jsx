import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createAdminItem, getItem, updateItem } from "../../_service/item";
import { getCategories } from "../../_service/category";

export default function TambahDonasiForm() {
  const navigate = useNavigate();
  const { id } = useParams();
  const fileInputRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: "",
    description: "",
    condition: "",
    location: "",
    shipping_type: "",
    category_id: "",
    images: [],
  });
  const [editingItem, setEditingItem] = useState(null);
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [loadingItem, setLoadingItem] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const response = await getCategories();
        setCategories(response.categories || []);
      } catch (error) {
        console.error("Failed to load categories", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (!id) return;

    const loadItem = async () => {
      setLoadingItem(true);
      try {
        const response = await getItem(id);
        setEditingItem(response);
        setForm((prev) => ({
          ...prev,
          title: response.title || "",
          description: response.description || "",
          condition: response.condition || "",
          location: response.location || "",
          shipping_type: response.shipping_type || "",
          category_id: response.category_id || "",
        }));
      } catch (error) {
        console.error("Failed to load item", error);
        setStatus({ type: "error", message: error.response?.data?.message || "Gagal memuat data item." });
      } finally {
        setLoadingItem(false);
      }
    };

    loadItem();
  }, [id]);

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setStatus({ type: "", message: "" });
  };

  const handleImageChange = (event) => {
    const files = Array.from(event.target.files || []);
    setForm((prev) => ({ ...prev, images: files }));
    setErrors((prev) => ({ ...prev, images: undefined }));
    setStatus({ type: "", message: "" });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setErrors({});
    setStatus({ type: "", message: "" });

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("condition", form.condition);
    formData.append("location", form.location);
    formData.append("shipping_type", form.shipping_type);
    formData.append("category_id", form.category_id);
    
    // Perbaikan: Pastikan semua file di-append ke formData
    form.images.forEach((file) => {
      formData.append("images[]", file);
    });

    try {
      const response = id
        ? await updateItem(id, formData)
        : await createAdminItem(formData);

      setStatus({
        type: "success",
        message: response.message || (id ? "Donasi berhasil diperbarui." : "Donasi berhasil ditambahkan."),
      });

      if (!id) {
        setForm({
          title: "",
          description: "",
          condition: "",
          location: "",
          shipping_type: "",
          category_id: "",
          images: [],
        });
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }

      setTimeout(() => navigate("/pengguna/tambah-donasi"), 800);
    } catch (error) {
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
        setStatus({ type: "error", message: "Periksa kembali data yang dimasukkan." });
      } else {
        setStatus({ type: "error", message: error.response?.data?.message || "Gagal menambahkan donasi." });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-teal-600">{id ? "Edit Donasi" : "Tambah Donasi"}</p>
            <h1 className="mt-3 text-4xl font-bold text-slate-900">{id ? "Perbarui detail barang Anda" : "Form Donasi Baru"}</h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              {id
                ? "Perbarui informasi barang yang sudah diunggah. Foto hanya dapat diubah di halaman edit khusus nanti."
                : "Isi detail barang yang ingin didonasikan dan unggah foto agar dapat segera diproses."}
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/pengguna/tambah-donasi")}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-100"
          >
            Kembali ke Daftar Donasi
          </button>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <form onSubmit={handleSubmit} className="grid gap-8 lg:grid-cols-[1.6fr_1fr]">
          <div className="space-y-6 rounded-[2rem] border border-slate-200 bg-slate-50 p-6">
            {status.message && (
              <div
                className={`rounded-3xl px-5 py-4 text-sm font-medium ${
                  status.type === "success"
                    ? "bg-emerald-100 text-emerald-800"
                    : "bg-rose-100 text-rose-800"
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Nama Barang</label>
              <input
                type="text"
                value={form.title}
                onChange={(event) => handleChange("title", event.target.value)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                placeholder="Contoh: Sepatu Olahraga"
              />
              {errors.title && <p className="text-sm text-rose-600">{errors.title[0]}</p>}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Deskripsi</label>
              <textarea
                value={form.description}
                onChange={(event) => handleChange("description", event.target.value)}
                className="min-h-[150px] w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                placeholder="Jelaskan kondisi dan manfaat barang yang ingin didonasikan"
              />
              {errors.description && <p className="text-sm text-rose-600">{errors.description[0]}</p>}
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Kategori</label>
                <select
                  value={form.category_id}
                  onChange={(event) => handleChange("category_id", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                >
                  <option value="">Pilih kategori</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category_id && <p className="text-sm text-rose-600">{errors.category_id[0]}</p>}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Lokasi</label>
                <input
                  type="text"
                  value={form.location}
                  onChange={(event) => handleChange("location", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                  placeholder="Misal: Jakarta Selatan"
                />
                {errors.location && <p className="text-sm text-rose-600">{errors.location[0]}</p>}
              </div>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Kondisi Barang</label>
                <select
                  value={form.condition}
                  onChange={(event) => handleChange("condition", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                >
                  <option value="">Pilih kondisi</option>
                  <option value="baru">Baru</option>
                  <option value="seperti baru">Seperti baru</option>
                  <option value="layak pakai">Layak pakai</option>
                </select>
                {errors.condition && <p className="text-sm text-rose-600">{errors.condition[0]}</p>}
              </div>

              <div className="space-y-3">
                <label className="block text-sm font-medium text-slate-700">Opsi Pengiriman</label>
                <select
                  value={form.shipping_type}
                  onChange={(event) => handleChange("shipping_type", event.target.value)}
                  className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-900 outline-none transition focus:border-teal-500"
                >
                  <option value="">Pilih opsi pengiriman</option>
                  <option value="free">Gratis untuk penerima</option>
                  <option value="paid">Biaya pengiriman ditanggung penerima</option>
                </select>
                {errors.shipping_type && <p className="text-sm text-rose-600">{errors.shipping_type[0]}</p>}
              </div>
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700">Foto Barang (1-5)</label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/png,image/jpeg,image/webp"
                onChange={handleImageChange}
                disabled={Boolean(id)}
                className="w-full rounded-3xl border border-slate-200 bg-white px-5 py-3 text-sm text-slate-900 outline-none transition file:mr-4 file:rounded-full file:border-0 file:bg-teal-500 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white disabled:cursor-not-allowed disabled:opacity-60"
              />
              {errors.images && <p className="text-sm text-rose-600">{errors.images[0]}</p>}
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="space-y-2">
                <p className="text-sm font-semibold text-slate-900">Preview</p>
                <p className="text-sm text-slate-500">{form.images.length} file dipilih</p>
              </div>
              <button
                type="submit"
                disabled={loading || loadingItem}
                className="inline-flex items-center justify-center rounded-full bg-teal-600 px-7 py-3 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:bg-teal-300"
              >
                {loading || loadingItem ? (id ? "Menyimpan..." : "Menambahkan...") : id ? "Simpan Perubahan" : "Tambah Donasi"}
              </button>
            </div>
          </div>
        </form>
      </section>
    </div>
  );
}