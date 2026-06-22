import { useCallback, useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showDetail, setShowDetail] = useState(false);

  const fetchItems = useCallback(async () => {
    try {
      const data = await getAdminItems({
        status: filterStatus || undefined,
        category_id: filterCategory || undefined,
        per_page: 20,
      });
      console.log("RAW FIRST ITEM:", JSON.stringify(data.items?.[0], null, 2));
      setItems(data.items || []);
    } catch {
      setItems([]);
    }
  }, [filterCategory, filterStatus]);

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

  const filteredItems = useMemo(() => {
    const query = searchParams.get("search")?.trim().toLowerCase() || "";
    if (!query) return items;

    return items.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const description = item.description?.toLowerCase() || "";
      const condition = item.condition?.toLowerCase() || "";
      return (
        title.includes(query) ||
        description.includes(query) ||
        condition.includes(query)
      );
    });
  }, [items, searchParams]);

  return (
    <div className="p-4 sm:p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
            Management Barang
          </h1>
          <p className="text-sm sm:text-base text-gray-500">Daftar barang donasi aktif.</p>
        </div>
      </div>

      <div className="bg-white rounded-lg sm:rounded-xl shadow overflow-hidden">
        <div className="p-3 sm:p-4 flex flex-wrap gap-3">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="border rounded-lg px-3 sm:px-4 py-2 text-sm"
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
            className="border rounded-lg px-3 sm:px-4 py-2 text-sm"
          >
            {statusOptions.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 text-xs sm:text-sm">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">Foto</th>
                <th className="px-4 sm:px-6 py-3 text-left">Nama Barang</th>
                <th className="px-4 sm:px-6 py-3 text-left">Kondisi</th>
                <th className="px-4 sm:px-6 py-3 text-left">Status</th>
                <th className="px-4 sm:px-6 py-3 text-left">Tanggal</th>
                <th className="px-4 sm:px-6 py-3 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredItems.map((item) => {
                const label = statusLabel(item.status);
                const imageUrl = getImageUrl(item);
                return (
                  <tr key={item.id} className="border-t">
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
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
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">{item.title}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">{item.condition}</td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs ${label.className}`}
                      >
                        {label.label}
                      </span>
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-sm">
                      {new Date(item.created_at).toLocaleDateString("id-ID")}
                    </td>
                    <td className="px-4 sm:px-6 py-3 sm:py-4">
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
        </div>

        {/* Mobile cards */}
        <div className="block sm:hidden p-3 space-y-3">
          {filteredItems.length === 0 ? (
            <div className="text-center py-6 text-gray-500 text-sm">Tidak ada barang.</div>
          ) : (
            filteredItems.map((item) => {
              const label = statusLabel(item.status);
              const imageUrl = getImageUrl(item);
              return (
                <div key={item.id} className="bg-white border rounded-lg p-3 shadow-sm">
                  <div className="flex items-start gap-3">
                    {imageUrl ? (
                      <img src={imageUrl} alt={item.title} className="w-16 h-16 object-cover rounded shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-gray-100 flex items-center justify-center text-xs text-gray-400 shrink-0">No img</div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate text-sm">{item.title}</div>
                      <div className="text-xs text-gray-500 mt-1">{item.condition}</div>
                      <div className="mt-2">
                        <span className={`px-2 py-1 rounded-full text-xs ${label.className}`}>{label.label}</span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => {
                          setSelectedItem(item);
                          setShowDetail(true);
                        }}
                        className="w-8 h-8 flex items-center justify-center rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100"
                        title="Detail"
                      >
                        <FiEye size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

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
