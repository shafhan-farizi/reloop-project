import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/xios";

export default function AdminTrackingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/shipments/${id}`);
        setShipment(res.data?.data?.shipment || res.data?.data || res.data);
      } catch (err) {
        console.error("Gagal memuat detail admin", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading)
    return (
      <div className="p-8 text-center text-slate-500">Memuat log detail...</div>
    );
  if (!shipment)
    return (
      <div className="p-8 text-center text-red-500">
        Data pengiriman tidak ditemukan.
      </div>
    );

  const isShipped = !!shipment.shipped_at;
  const isDelivered = !!shipment.delivered_at;
  const donatur = shipment.donatur || shipment.request?.donatur || {};
  const penerima = shipment.penerima || shipment.request?.penerima || {};

  return (
    <div className="w-full overflow-x-hidden space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-slate-900">
            Log Konfirmasi Pengiriman
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Resi: {shipment.tracking_number || `TX-${shipment.id}`}
          </p>
        </div>
        <button
          onClick={() => navigate(-1)}
          className="rounded-lg bg-slate-100 px-3 py-2 text-xs sm:text-sm font-semibold hover:bg-slate-200"
        >
          Kembali
        </button>
      </div>

      <div className="rounded-3xl bg-white p-4 sm:p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-base sm:text-lg border-b pb-3 mb-4">Timeline Konfirmasi</h3>
        <div className="space-y-4">
          {/* Donatur step */}
          <div className="flex items-start gap-4">
            <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-emerald-500 text-white text-sm font-semibold flex-shrink-0">
              ✓
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-slate-900">Donatur ({donatur.name || "Pengirim"})</div>
                <time className="text-xs font-medium text-slate-500">
                  {isShipped ? new Date(shipment.shipped_at).toLocaleString("id-ID") : "-"}
                </time>
              </div>
              <div className="text-sm text-slate-600">
                {isShipped
                  ? `Telah menandai barang sebagai "Sudah Dikirim" via ${shipment.courier || "Kurir"} (Resi: ${shipment.tracking_number}).`
                  : "Belum menginput data pengiriman."}
              </div>
            </div>
          </div>

          {/* Penerima step */}
          <div className="flex items-start gap-4">
            <div className={`mt-1 flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${isDelivered ? 'bg-blue-500 text-white' : 'bg-amber-400 text-white'} flex-shrink-0`}>
              {isDelivered ? '✓' : '⏱'}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <div className="font-bold text-slate-900">Penerima ({penerima.name || "Penerima"})</div>
                <time className="text-xs font-medium text-slate-500">
                  {isDelivered ? new Date(shipment.delivered_at).toLocaleString("id-ID") : "Saat ini"}
                </time>
              </div>
              <div className="text-sm text-slate-600">
                {isDelivered
                  ? 'Telah mengonfirmasi bahwa "Barang Sudah Diterima". Transaksi selesai.'
                  : isShipped
                    ? 'Menunggu konfirmasi "Barang Diterima" dari Penerima.'
                    : "Menunggu Donatur memproses barang."}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BUKTI FOTO PENERIMA */}
      <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-lg border-b pb-3 mb-4">
          Bukti Foto Penerimaan
        </h3>
        <div className="space-y-3">
          {shipment.feedback_images && shipment.feedback_images.length > 0 ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {shipment.feedback_images.map((img, idx) => (
                  <img
                    key={idx}
                    src={img}
                    alt={`Bukti Penerima ${idx + 1}`}
                    className="w-full h-24 md:h-40 object-cover rounded-xl border bg-slate-50 shadow-sm"
                  />
                ))}
            </div>
          ) : (
            <div className="flex h-24 md:h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400 px-4 text-center">
              Belum ada foto bukti dari penerima
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
