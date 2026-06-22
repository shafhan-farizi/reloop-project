import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/xios";

export default function AdminTrackingList() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminShipments = async () => {
      setLoading(true);
      try {
        // Asumsi endpoint admin: /admin/shipments
        const res = await api.get("/admin/shipments", {
          params: { per_page: 50 },
        });
        const data =
          res.data?.data?.shipments || res.data?.data || res.data || [];
        setShipments(data);
      } catch (err) {
        console.error("Gagal memuat data admin:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminShipments();
  }, []);

  // Menghitung durasi hari sejak dikirim
  const calculateDuration = (shippedAt, deliveredAt) => {
    if (!shippedAt) return "-";
    const start = new Date(shippedAt);
    const end = deliveredAt ? new Date(deliveredAt) : new Date();
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (deliveredAt)
      return (
        <span className="text-emerald-600 font-medium">
          Selesai ({diffDays} Hari)
        </span>
      );
    return (
      <span className="text-amber-600 font-medium">
        {diffDays} Hari Berjalan
      </span>
    );
  };

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">
        Memuat data monitoring...
      </div>
    );

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">
          Monitoring Aktivitas Pengiriman
        </h1>
        <p className="mt-2 text-slate-500">
          Pantau status konfirmasi dari sisi Donatur dan Penerima.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl bg-white shadow-sm border border-slate-200">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-slate-900 border-b border-slate-200">
            <tr>
              <th className="p-4 font-semibold">ID / Resi</th>
              <th className="p-4 font-semibold">Detail Barang</th>
              <th className="p-4 font-semibold">Pihak 1 (Donatur)</th>
              <th className="p-4 font-semibold">Pihak 2 (Penerima)</th>
              <th className="p-4 font-semibold">Durasi</th>
              <th className="p-4 font-semibold text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {shipments.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-8 text-center">
                  Tidak ada data transaksi.
                </td>
              </tr>
            ) : (
              shipments.map((shipment) => (
                <tr key={shipment.id} className="hover:bg-slate-50 transition">
                  <td className="p-4 font-medium text-slate-900">
                    {shipment.tracking_number ||
                      `TX-${shipment.id.substring(0, 6).toUpperCase()}`}
                  </td>
                  <td className="p-4">
                    {shipment.request?.item?.title ||
                      shipment.request?.item_name ||
                      "Barang Donasi"}
                  </td>
                  <td className="p-4">
                    {shipment.shipped_at ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-medium text-emerald-800">
                        🟢 Sudah Dikirim (
                        {new Date(shipment.shipped_at).toLocaleDateString(
                          "id-ID",
                        )}
                        )
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
                        ⚪ Belum Dikirim
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    {shipment.delivered_at ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-100 px-2.5 py-1 text-xs font-medium text-blue-800">
                        🔵 Sudah Diterima
                      </span>
                    ) : shipment.shipped_at ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-2.5 py-1 text-xs font-medium text-amber-800">
                        🟡 Menunggu Konfirmasi
                      </span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="p-4">
                    {calculateDuration(
                      shipment.shipped_at,
                      shipment.delivered_at,
                    )}
                  </td>
                  <td className="p-4 text-center">
                    <button
                      onClick={() => navigate(`/admin/tracking/${shipment.id}`)}
                      className="inline-flex items-center justify-center rounded-lg bg-teal-50 p-2 text-teal-600 hover:bg-teal-100 transition"
                      title="Lihat Log Detail"
                    >
                      {/* Icon Mata (Eye) */}
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
