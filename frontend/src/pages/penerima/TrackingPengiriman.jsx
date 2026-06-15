import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/xios";

const BASE_URL = "http://localhost:8000";

export default function TrackingPengiriman() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const resolveStatus = (s) => {
    if (!s) return s?.status;
    if (s.delivered_at) return 'delivered';
    if (s.shipped_at) return 'in_transit';
    if (s.tracking_number && s.courier) return 'in_transit';
    return s.status || 'preparing';
  };

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get('/shipments', {
        params: {
          as: 'requester',
          per_page: 50,
        },
      });
      
      let data = [];
      if (res.data?.data?.shipments) {
        data = res.data.data.shipments;
      } else if (res.data?.data) {
        data = Array.isArray(res.data.data) ? res.data.data : [];
      } else if (Array.isArray(res.data)) {
        data = res.data;
      }
      
      setShipments(data);
    } catch (err) {
      console.error('Error loading shipments:', err);
      setError('Gagal memuat data pengiriman');
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const getImageUrl = (shipment) => {
    const path = shipment?.request?.item?.images?.[0];
    if (!path) return "/placeholder.png";
    if (path.startsWith("http")) return path;
    return `${BASE_URL}/storage/${path}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#f8fafc] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Tracking Pengiriman</h1>
            <p className="mt-2 text-slate-500">Pantau status pengiriman barang Anda.</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      {loading ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Memuat data pengiriman...</p>
        </div>
      ) : shipments.length === 0 ? (
        <div className="rounded-3xl bg-white p-8 text-center shadow-sm">
          <p className="text-slate-500">Tidak ada pengiriman saat ini.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {shipments.map((shipment) => (
            <div
              key={shipment.id}
              onClick={() => navigate(`/penerima/tracking/${shipment.id}`)}
              className="cursor-pointer rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition hover:border-slate-300 hover:shadow-md"
            >
              <div className="space-y-3">
                {/* Item Image */}
                <div className="h-40 overflow-hidden rounded-2xl bg-slate-100">
                  <img
                    src={getImageUrl(shipment)}
                    alt="item"
                    className="h-full w-full object-cover"
                    onError={(e) => { e.target.src = "/placeholder.png"; }}
                  />
                </div>

                {/* Item Info */}
                <div className="space-y-2">
                  <h3 className="font-semibold text-slate-900">
                    {shipment.request?.item?.title || shipment.request?.item_name || '-'}
                  </h3>
                  
                  {/* Status Badge */}
                  <div className="flex items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        resolveStatus(shipment) === 'delivered'
                          ? 'bg-emerald-100 text-emerald-700'
                          : resolveStatus(shipment) === 'in_transit'
                          ? 'bg-sky-100 text-sky-700'
                          : 'bg-amber-100 text-amber-700'
                      }`}
                    >
                      {resolveStatus(shipment) === 'delivered'
                        ? 'SELESAI'
                        : resolveStatus(shipment) === 'in_transit'
                        ? 'DALAM PENGIRIMAN'
                        : 'PENDING'}
                    </span>
                  </div>

                  {/* Tracking Info */}
                  <div className="space-y-1 text-xs text-slate-500">
                    {shipment.tracking_number && (
                      <p>
                        <span className="font-medium">No. Resi:</span> {shipment.tracking_number}
                      </p>
                    )}
                    {shipment.courier && (
                      <p>
                        <span className="font-medium">Kurir:</span> {shipment.courier}
                      </p>
                    )}
                    {shipment.shipped_at && (
                      <p>
                        <span className="font-medium">Dikirim:</span>{' '}
                        {new Date(shipment.shipped_at).toLocaleDateString('id-ID')}
                      </p>
                    )}
                  </div>

                  {/* Click to Details */}
                  <div className="text-center">
                    <button className="mt-3 w-full rounded-full bg-teal-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-teal-700">
                      Lihat Detail
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}