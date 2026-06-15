import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../api/xios";

const BASE_URL = "http://localhost:8000";

export default function TrackingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/shipments/${id}`);
      setShipment(res.data?.data?.shipment || res.data?.data || res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const buildEvents = (s) => {
    if (!s) return [];
    if (s.events && s.events.length) return s.events;
    const list = [];
    if (s.created_at) list.push({ title: 'Pengiriman dibuat', timestamp: s.created_at });
    if (s.shipped_at) list.push({ title: 'Barang sedang dalam perjalanan', timestamp: s.shipped_at });
    if (s.delivered_at) list.push({ title: 'Barang telah diterima', timestamp: s.delivered_at });
    return list;
  };

  const resolveStatus = (s) => {
    if (!s) return s?.status;
    if (s.delivered_at) return 'delivered';
    if (s.shipped_at) return 'in_transit';
    if (s.tracking_number && s.courier) return 'in_transit';
    return s.status || 'preparing';
  };

  const confirmReceived = async () => {
    if (!shipment) return;
    if (!confirm('Konfirmasi bahwa barang sudah sampai dan kamu terima?')) return;
    setActionLoading(true);
    try {
      const res = await api.post(`/shipments/${shipment.id}/confirm-received`);
      const updated = res.data?.data?.shipment || res.data?.data || res.data;
      setShipment(updated);
      alert('Konfirmasi berhasil. Terima kasih!');
      navigate('/penerima/riwayat');
    } catch (err) { console.error(err); }
    finally { setActionLoading(false); }
  };

  if (loading) return <div className="p-6">Memuat...</div>;

  if (!shipment) return <div className="p-6">Shipment tidak ditemukan.</div>;

  const currentStatus = resolveStatus(shipment);
  const canConfirm = currentStatus === 'in_transit';

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Detail Tracking</h2>
          <p className="text-sm text-slate-500">No. Resi: {shipment.tracking_number || '-'}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => navigate(-1)} className="px-4 py-2 rounded bg-slate-100">Kembali</button>
          {currentStatus === 'delivered' ? (
            <button className="px-4 py-2 rounded bg-emerald-500 text-white cursor-default">Barang Sudah Diterima</button>
          ) : (
            <button
              disabled={actionLoading || !canConfirm}
              onClick={confirmReceived}
              className={`px-4 py-2 rounded text-white ${!canConfirm ? 'bg-slate-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600'}`}
            >
              {actionLoading ? 'Memproses...' : canConfirm ? 'Konfirmasi Terima' : 'Menunggu Donatur Kirim'}
            </button>
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <div className="md:col-span-2 rounded-2xl bg-white p-6 border">
          <div className="flex items-start gap-4">
            <div className="h-24 w-24 bg-slate-100 rounded overflow-hidden">
              <img src={shipment.request?.item?.images?.[0] || '/placeholder.png'} alt="item" className="w-full h-full object-cover"/>
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <h3 className="font-semibold text-lg">{shipment.request?.item?.title || shipment.request?.item_name || '-'}</h3>
                {currentStatus === 'delivered' && (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">Sudah Diterima</span>
                )}
              </div>
              <p className="text-sm text-slate-500">{shipment.request?.item?.category?.name || ''}</p>
              <p className="mt-3 text-sm">Alamat: <span className="font-semibold">{shipment.delivery_address || '-'}</span></p>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="font-semibold">Timeline</h4>
            <div className="mt-3 space-y-4">
              {buildEvents(shipment).map((ev, idx) => (
                <div key={idx} className="flex items-start gap-3">
                  <div className="mt-1">
                    <div className="h-3 w-3 rounded-full bg-emerald-600" />
                  </div>
                  <div>
                    <div className="font-semibold">{ev.title}</div>
                    <div className="text-xs text-slate-500">{ev.timestamp ? new Date(ev.timestamp).toLocaleString('id-ID') : ''}</div>
                    {ev.location && <div className="text-xs text-slate-500">{ev.location}</div>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-6 border">
          <h4 className="font-semibold mb-3">Info Pengiriman</h4>
          <div className="text-sm text-slate-600">
            <div>No. Resi: <b>{shipment.tracking_number || '-'}</b></div>
            <div>Kurir: <b>{shipment.courier || '-'}</b></div>
            <div>Status: <b>{currentStatus === 'preparing' ? 'Belum dikirim' : currentStatus === 'in_transit' ? 'Dalam perjalanan' : currentStatus === 'delivered' ? 'Sudah diterima' : currentStatus}</b></div>
            {currentStatus === 'delivered' && (
              <div className="mt-2 rounded-full bg-emerald-50 px-3 py-2 text-emerald-700">Tracking selesai. Barang sudah diterima.</div>
            )}
            {currentStatus === 'preparing' && (
              <div className="mt-2 rounded-full bg-amber-50 px-3 py-2 text-amber-700">Status belum dikirim, tunggu donatur menginput data pengiriman.</div>
            )}
            {currentStatus === 'in_transit' && (
              <div className="mt-2 rounded-full bg-sky-50 px-3 py-2 text-sky-700">Donatur sudah mengirimkan barang. Silakan tunggu sampai, lalu konfirmasi penerimaan.</div>
            )}
            <div className="mt-3">Tanggal Dibuat: <b>{shipment.created_at ? new Date(shipment.created_at).toLocaleString('id-ID') : '-'}</b></div>
          </div>
        </div>
      </div>
    </div>
  );
}
