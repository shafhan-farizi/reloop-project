import { useEffect, useState, useMemo } from "react";
import api from "../../api/xios";

export default function Pengiriman() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fungsi untuk memetakan status dari database ke label UI
  const mapStatus = (status) => {
    switch (status) {
      case 'preparing': return 'Pengiriman';
      case 'in_transit': return 'Terkirim';
      case 'delivered': return 'Selesai';
      default: return 'Lainnya';
    }
  };

  const load = async () => {
    setLoading(true);
    try {
      // Memanggil endpoint dari ShipmentController
      const res = await api.get('/shipments');
      // Mengambil data berdasarkan struktur response: { data: { shipments: [...] } }
      const data = res.data?.data?.shipments || [];
      setShipments(data);
    } catch (err) {
      console.error("Gagal memuat pengiriman:", err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  const summary = useMemo(() => {
    const counts = { "Pengiriman": 0, "Terkirim": 0, "Selesai": 0 };
    shipments.forEach(s => {
      const label = mapStatus(s.status);
      if (counts.hasOwnProperty(label)) counts[label]++;
    });
    return [
      { label: "Pengiriman", count: counts["Pengiriman"], color: "bg-blue-50 text-blue-700" },
      { label: "Terkirim", count: counts["Terkirim"], color: "bg-amber-50 text-amber-700" },
      { label: "Selesai", count: counts["Selesai"], color: "bg-emerald-50 text-emerald-700" },
    ];
  }, [shipments]);

  return (
    <div className="space-y-6 p-6">
      <h2 className="text-2xl font-bold">PENGIRIMAN</h2>
      
      {/* Kartu Ringkasan */}
      <div className="grid grid-cols-3 gap-4">
        {summary.map((item, idx) => (
          <div key={idx} className={`p-5 rounded-2xl border ${item.color}`}>
            <div className="text-2xl font-bold">{item.count}</div>
            <div className="text-sm font-medium">{item.label}</div>
          </div>
        ))}
      </div>

      {/* Tabel */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border">
        {loading ? <p className="text-center py-4">Memuat data...</p> : (
          <table className="w-full text-left">
            <thead>
              <tr className="text-slate-500 text-sm">
                <th className="py-4">Barang</th>
                <th className="py-4">Penerima</th>
                <th className="py-4">Alamat</th>
                <th className="py-4">Status</th>
                <th className="py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {shipments.map(s => (
                <tr key={s.id} className="text-sm">
                  <td className="py-4 font-medium">{s.request?.item?.title || "Barang"}</td>
                  <td className="py-4">{s.request?.requester?.name || "-"}</td>
                  <td className="py-4 text-slate-600">{s.request?.delivery_address || "-"}</td>
                  <td className="py-4">
                    <span className="px-3 py-1 rounded-full bg-slate-100 text-xs">
                      {mapStatus(s.status)}
                    </span>
                  </td>
                  <td className="py-4">
                    <button onClick={() => setSelectedShipment(s)} className="px-4 py-2 border rounded-xl hover:bg-slate-50">
                      {s.status === 'delivered' ? 'Lihat' : 'Lacak'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail Pengiriman */}
      {selectedShipment && (
        <div className="p-6 bg-white rounded-3xl border shadow-sm">
          <h3 className="text-emerald-500 font-bold mb-4">Detail Pengiriman</h3>
          <div className="flex gap-4">
            <img src={selectedShipment.request?.item?.image_url || "/placeholder.png"} className="w-20 h-20 rounded-lg object-cover" />
            <div>
              <p className="font-bold">{selectedShipment.request?.requester?.name}</p>
              <p className="text-sm text-slate-500">{selectedShipment.request?.delivery_address}</p>
              <p className="font-semibold mt-2">{selectedShipment.request?.item?.title}</p>
              <p className="text-xs text-blue-600 font-medium mt-1">Resi: {selectedShipment.tracking_number} ({selectedShipment.courier})</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}