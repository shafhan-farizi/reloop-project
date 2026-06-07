import { useEffect, useState } from "react";
import api from "../../api/xios";

const BASE_URL = "http://localhost:8000";

export default function TrackingPengiriman() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);

  const load = async () => {
    try {
      const res = await api.get('/shipments');
      setShipments(res.data.data || res.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-900">Tracking Pengiriman</h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* List Shipment */}
        <div className="space-y-4">
          {shipments.length > 0 ? (
            shipments.map((s) => (
              <div 
                key={s.id} 
                onClick={() => setSelectedShipment(s)}
                className={`border p-4 rounded-2xl flex items-center gap-4 cursor-pointer transition ${
                  selectedShipment?.id === s.id ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="h-16 w-16 bg-slate-100 rounded-xl overflow-hidden">
                  <img 
                    src={s.item?.images?.[0] ? `${BASE_URL}/storage/${s.item.images[0]}` : "/placeholder.png"} 
                    alt="item" 
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                </div>
                <div>
                  <div className="font-semibold text-slate-900">{s.item?.title || s.item_name}</div>
                  <div className={`text-xs font-medium px-2 py-1 rounded-full inline-block mt-1 ${
                    s.status === 'delivered' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                  }`}>
                    {s.status?.toUpperCase()}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-500">Tidak ada pengiriman aktif.</p>
          )}
        </div>

        {/* Detail Panel */}
        <div className="border border-slate-200 p-6 rounded-3xl bg-white shadow-sm h-fit sticky top-6">
          <h4 className="font-semibold text-lg mb-4 text-slate-900">Status Pengiriman</h4>
          {selectedShipment ? (
            <div className="space-y-4">
              <div className="flex justify-between border-b pb-4">
                <span className="text-slate-500">Barang:</span>
                <span className="font-semibold">{selectedShipment.item?.title}</span>
              </div>
              <div className="flex justify-between border-b pb-4">
                <span className="text-slate-500">Status Terakhir:</span>
                <span className="font-semibold text-emerald-600">{selectedShipment.status}</span>
              </div>
              <div className="pt-2">
                <span className="text-slate-500 text-sm">Alamat Penerima:</span>
                <p className="text-sm mt-1 bg-slate-50 p-3 rounded-lg">{selectedShipment.delivery_address || "-"}</p>
              </div>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-400">
              <p>Pilih salah satu item di samping untuk melihat detail tracking.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}