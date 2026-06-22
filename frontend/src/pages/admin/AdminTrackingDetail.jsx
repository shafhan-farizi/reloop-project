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

  if (loading) return <div className="p-8 text-center text-slate-500">Memuat log detail...</div>;
  if (!shipment) return <div className="p-8 text-center text-red-500">Data pengiriman tidak ditemukan.</div>;

  const isShipped = !!shipment.shipped_at;
  const isDelivered = !!shipment.delivered_at;

  // Ekstraksi data relasi (Sesuaikan dengan struktur response JSON backend Anda)
  const donatur = shipment.donatur || shipment.request?.donatur || {};
  const penerima = shipment.penerima || shipment.request?.penerima || {};

  return (
    <div className="space-y-6 p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Log Konfirmasi Pengiriman</h2>
          <p className="text-sm text-slate-500">Resi: {shipment.tracking_number || `TX-${shipment.id}`}</p>
        </div>
        <button onClick={() => navigate(-1)} className="rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold hover:bg-slate-200">
          Kembali
        </button>
      </div>

      {/* TIMELINE DUA SISI */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-lg border-b pb-3 mb-4">Timeline Konfirmasi</h3>
        <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
          
          {/* Event 1: Donatur Mengirim */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white bg-emerald-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
              ✓
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-slate-50">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900">Donatur ({donatur.name || 'Pengirim'})</div>
                <time className="text-xs font-medium text-slate-500">
                  {isShipped ? new Date(shipment.shipped_at).toLocaleString('id-ID') : '-'}
                </time>
              </div>
              <div className="text-sm text-slate-600">
                {isShipped 
                  ? `Telah menandai barang sebagai "Sudah Dikirim" via ${shipment.courier || 'Kurir'} (Resi: ${shipment.tracking_number}).` 
                  : 'Belum menginput data pengiriman.'}
              </div>
            </div>
          </div>

          {/* Event 2: Penerima Konfirmasi */}
          <div className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
            <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10 ${isDelivered ? 'bg-blue-500 text-white' : 'bg-amber-400 text-white'}`}>
              {isDelivered ? '✓' : '⏱'}
            </div>
            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-slate-200 bg-white">
              <div className="flex items-center justify-between space-x-2 mb-1">
                <div className="font-bold text-slate-900">Penerima ({penerima.name || 'Penerima'})</div>
                <time className="text-xs font-medium text-slate-500">
                  {isDelivered ? new Date(shipment.delivered_at).toLocaleString('id-ID') : 'Saat ini'}
                </time>
              </div>
              <div className="text-sm text-slate-600">
                {isDelivered 
                  ? 'Telah mengonfirmasi bahwa "Barang Sudah Diterima". Transaksi selesai.' 
                  : isShipped ? 'Menunggu konfirmasi "Barang Diterima" dari Penerima.' : 'Menunggu Donatur memproses barang.'}
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* BAWAH: BUKTI FOTO (PENERIMA SAJA) */}
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <h3 className="font-semibold text-lg border-b pb-3 mb-4">Bukti Foto Penerimaan</h3>
        <div className="space-y-3">
          {shipment.feedback_images && shipment.feedback_images.length > 0 ? (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
              {shipment.feedback_images.map((img, idx) => (
                <img key={idx} src={img} alt={`Bukti Penerima ${idx+1}`} className="w-full h-40 object-cover rounded-xl border bg-slate-50 shadow-sm" />
              ))}
            </div>
          ) : (
            <div className="flex h-40 items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 text-sm text-slate-400">
              Belum ada foto bukti dari penerima
            </div>
          )}
        </div>
      </div>
    </div>
  );
}