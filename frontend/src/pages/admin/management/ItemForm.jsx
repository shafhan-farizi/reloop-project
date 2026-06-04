import { conditionOptions, statusOptions } from "./constants";

export default function ItemForm({
  form,
  setForm,
  categories,
  editingItem,
  handleSave,
  handleImageChange,
  onBack,
}) {
  return (
    <>
      <button onClick={onBack} className="mb-5 border px-4 py-2 rounded-lg">
        ← Kembali
      </button>

      <div className="bg-white rounded-xl shadow p-6">
        <h2 className="text-2xl font-bold mb-6">
          {editingItem ? "Edit Barang" : "Tambah Barang"}
        </h2>

        <form
          onSubmit={handleSave}
          className="grid lg:grid-cols-[2fr_1fr] gap-6"
        >
          {/* KIRI */}
          <div className="space-y-4">
            <label className="border-2 border-dashed rounded-xl h-52 flex items-center justify-center cursor-pointer overflow-hidden bg-gray-50">
              {form.imagePreview ? (
                <img
                  src={form.imagePreview}
                  alt="preview"
                  className="max-h-full max-w-full object-contain"
                />
              ) : (
                <span className="text-gray-400">Upload Foto</span>
              )}

              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </label>

            <input
              type="text"
              value={form.title}
              placeholder="Nama Barang"
              className="w-full border rounded-lg p-3"
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />

            <div className="grid md:grid-cols-2 gap-4">
              <select
                value={form.category_id}
                className="border rounded-lg p-3"
                onChange={(e) =>
                  setForm({ ...form, category_id: e.target.value })
                }
              >
                <option value="">Pilih Kategori</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>

              <select
                value={form.condition}
                className="border rounded-lg p-3"
                onChange={(e) =>
                  setForm({ ...form, condition: e.target.value })
                }
              >
                {conditionOptions.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <textarea
              rows={5}
              value={form.description}
              placeholder="Deskripsi"
              className="w-full border rounded-lg p-3"
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />

            <input
              type="text"
              value={form.location}
              placeholder="Lokasi Barang"
              className="w-full border rounded-lg p-3"
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
          </div>

          {/* KANAN */}
          <div className="space-y-4 border rounded-xl p-4">
            <select
              value={form.shipping_type}
              className="w-full border rounded-lg p-3"
              onChange={(e) =>
                setForm({ ...form, shipping_type: e.target.value })
              }
            >
              <option value="">Pilih Pengiriman</option>
              <option value="free">Pickup (Gratis)</option>
              <option value="paid">Delivery (Bayar)</option>
            </select>

            <select
              value={form.status}
              className="w-full border rounded-lg p-3"
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              {statusOptions
                .filter((x) => x.value)
                .map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
            </select>

            <textarea
              rows={5}
              value={form.notes}
              placeholder="Catatan Admin"
              className="w-full border rounded-lg p-3"
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />

            <button
              type="submit"
              className="w-full bg-orange-400 hover:bg-orange-500 text-white py-3 rounded-lg font-semibold"
            >
              SIMPAN
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
