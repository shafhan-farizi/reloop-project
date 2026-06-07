import { useCallback, useEffect, useState } from "react";
import { FiEye } from "react-icons/fi";
import { getAdminItems } from "../../_service/item";
import { getCategories } from "../../_service/category";
import { statusLabel, statusOptions } from "./management/constants";
import ItemDetailModal from "./management/ItemDetailModal";

// const BASE_URL = "http://localhost:8000";

// Perbaikan utama: tangani images sebagai array of objects [{url}] atau array of strings
const getImageUrl = (item) => {
  const images = item?.images;
  if (!Array.isArray(images) || images.length === 0) return null;

  const first = images[0];
  if (typeof first !== "string" || !first.trim()) return null;

  // Perbaiki double prefix: /storage/http://localhost/storage/...
  const doublePrefix = /^https?:\/\/[^/]+\/storage\/(https?:\/\/)/;
  if (doublePrefix.test(first)) {
    return first.replace(doublePrefix, "$1");
  }

  // URL sudah benar, return langsung  ← ini yang hilang sebelumnya
  return first;
};

export default function Management() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const data = await getAdminItems({
        search: search || undefined,
        status: filterStatus || undefined,
        category_id: filterCategory || undefined,
        per_page: 20,
      });
      console.log("RAW FIRST ITEM:", JSON.stringify(data.items?.[0], null, 2));
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  }, [search, filterCategory, filterStatus]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await getCategories();
        setCategories(res?.categories || []);
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(fetchItems, 400);
    return () => clearTimeout(timer);
  }, [fetchItems]);

  const resetFilters = () => {
    setSearch("");
    setFilterCategory("");
    setFilterStatus("");
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-4xl font-bold text-orange-400">
            Management Barang
          </h1>
          <p className="text-gray-500">Daftar barang donasi aktif.</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="p-4 flex flex-wrap gap-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            className="border rounded-lg px-4 py-2"
          />
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            <option value="">Semua Kategori</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border rounded-lg px-4 py-2"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
          <button
            onClick={resetFilters}
            className="border px-4 py-2 rounded-lg"
          >
            Reset
          </button>
        </div>

        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-4 text-left">Foto</th>
              <th className="p-4 text-left">Nama Barang</th>
              <th className="p-4 text-left">Kondisi</th>
              <th className="p-4 text-left">Status</th>
              <th className="p-4 text-left">Tanggal</th>
              <th className="p-4 text-left">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const label = statusLabel(item.status);
              const imageUrl = getImageUrl(item);
              return (
                <tr key={item.id} className="border-t">
                  <td className="p-4">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={item.title}
                        className="w-14 h-14 object-cover rounded"
                        onError={(e) => {
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                    ) : null}
                    <div
                      className="w-14 h-14 rounded bg-gray-100 items-center justify-center text-gray-400 text-xs"
                      style={{ display: imageUrl ? "none" : "flex" }}
                    >
                      No img
                    </div>
                  </td>
                  <td className="p-4">{item.title}</td>
                  <td className="p-4">{item.condition}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs ${label.className}`}
                    >
                      {label.label}
                    </span>
                  </td>
                  <td className="p-4">
                    {new Date(item.created_at).toLocaleDateString("id-ID")}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDetail(true);
                        }}
                        className="w-9 h-9 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                        title="Detail"
                      >
                        <FiEye size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <ItemDetailModal
          open={showDetail}
          item={selectedItem}
          getImageUrl={getImageUrl}
          onClose={() => {
            setShowDetail(false);
            setSelectedItem(null);
          }}
        />
      </div>
    </div>
  );
}
