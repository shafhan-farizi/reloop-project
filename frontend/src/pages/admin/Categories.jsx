import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../_service/category";
import { FiEdit2, FiTrash2 } from "react-icons/fi";

export default function Categories() {
  const [searchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    description: "",
    items_count: 0,
  });

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories(res.categories || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchInitial = async () => {
      await fetchCategories();
    };

    fetchInitial();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchParams.get("search")?.trim().toLowerCase() || "";
    if (!q) return categories;

    return categories.filter((category) => {
      const name = category.name?.toLowerCase() || "";
      const description = category.description?.toLowerCase() || "";
      return name.includes(q) || description.includes(q);
    });
  }, [categories, searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name.trim()) {
      alert("Nama kategori wajib diisi");
      return;
    }

    try {
      if (editingId) {
        await updateCategory(editingId, {
          name: form.name,
          description: form.description,
        });

        alert("Kategori berhasil diperbarui");
      } else {
        await createCategory({
          name: form.name,
          description: form.description,
        });

        alert("Kategori berhasil ditambahkan");
      }

      resetForm();
      setShowForm(false);

      fetchCategories();
    } catch (error) {
      console.log(error);
    }
  };

  const handleEdit = (category) => {
    setEditingId(category.id);

    setForm({
      name: category.name || "",
      description: category.description || "",
      items_count: category.items_count || 0,
    });

    setShowForm(true);
  };

  const resetForm = () => {
    setEditingId(null);

    setForm({
      name: "",
      description: "",
      items_count: 0,
    });
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm("Yakin ingin menghapus kategori ini?");

    if (!confirmDelete) return;

    try {
      await deleteCategory(id);

      fetchCategories();

      alert("Kategori berhasil dihapus");
    } catch (error) {
      console.log(error);

      alert(error?.response?.data?.message || "Kategori gagal dihapus");
    }
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-col sm:flex-row">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">Kategori</h1>

          <p className="text-sm sm:text-base text-gray-500 mt-1">
            Daftar kategori yang tersedia untuk donasi
          </p>
        </div>

        <button
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="bg-orange-400 hover:bg-orange-500 text-white px-4 py-2 rounded-lg font-medium transition text-sm sm:text-base whitespace-nowrap"
        >
          + Add Kategori
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="font-semibold text-base sm:text-lg text-gray-700">Data Kategori</h2>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-xs sm:text-sm">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">Nama Kategori</th>

                <th className="px-4 sm:px-6 py-3 text-left">Deskripsi Kategori</th>

                <th className="px-4 sm:px-6 py-3 text-center">Jumlah Barang</th>

                <th className="px-4 sm:px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => (
                  <tr key={category.id} className="border-b hover:bg-gray-50">
                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800">
                      {category.name}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-500 text-sm">
                      {category.description || "-"}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      {category.items_count ?? 0}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(category)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-emerald-200 text-emerald-600 hover:bg-emerald-100 transition"
                          title="Edit"
                        >
                          <FiEdit2 size={16} />
                        </button>

                        <button
                          onClick={() => handleDelete(category.id)}
                          className="w-9 h-9 flex items-center justify-center rounded-lg bg-red-200 text-red-600 hover:bg-red-100 transition"
                          title="Hapus"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center py-6 text-gray-500 text-sm">
                    Belum ada kategori.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="block sm:hidden p-3 space-y-3">
          {filteredCategories.length > 0 ? (
            filteredCategories.map((category) => (
              <div key={category.id} className="bg-white rounded-lg border p-3 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-gray-800 truncate">{category.name}</div>
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">{category.description || '-'}</div>
                  </div>
                  <div className="text-center shrink-0">
                    <div className="text-sm font-medium">{category.items_count ?? 0}</div>
                    <div className="mt-2 flex gap-1">
                      <button onClick={() => handleEdit(category)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-emerald-200 text-emerald-600 hover:bg-emerald-100">
                        <FiEdit2 size={14} />
                      </button>
                      <button onClick={() => handleDelete(category.id)} className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-200 text-red-600 hover:bg-red-100">
                        <FiTrash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-gray-500 text-sm">Belum ada kategori.</div>
          )}
        </div>
      </div>

      {/* Modal Tambah Kategori */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-lg shadow-lg">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold">
                {editingId ? "Edit Kategori" : "Tambah Kategori"}
              </h2>

              <button
                onClick={() => setShowForm(false)}
                className="text-gray-500 hover:text-black"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Nama Kategori
                </label>

                <input
                  type="text"
                  value={form.name}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                  }
                  placeholder="Contoh : Pakaian"
                  className="w-full border rounded-lg px-4 py-2"
                />
                {editingId && (
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Jumlah Barang
                    </label>

                    <input
                      type="number"
                      value={form.items_count}
                      readOnly
                      className="w-full border rounded-lg px-4 py-2 bg-gray-100"
                    />
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Deskripsi Kategori
                </label>

                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      description: e.target.value,
                    })
                  }
                  placeholder="Masukkan deskripsi kategori"
                  className="w-full border rounded-lg px-4 py-2 resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    resetForm();
                    setShowForm(false);
                  }}
                  className="px-4 py-2 border rounded-lg"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-400 text-white rounded-lg hover:bg-orange-500"
                >
                  {editingId ? "Update" : "Simpan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
