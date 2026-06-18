import { useEffect, useState } from "react";
import api from "../../api/xios";

const statusLabel = {
  preparing: "Dalam Pengiriman",
  in_transit: "Dalam Pengiriman",
  delivered: "Selesai",
  cancelled: "Dibatalkan",
};

const statusBadge = {
  preparing: "bg-sky-100 text-sky-700",
  in_transit: "bg-amber-100 text-amber-700",
  delivered: "bg-emerald-100 text-emerald-700",
  cancelled: "bg-rose-100 text-rose-700",
};

export default function RiwayatDonasi() {
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/shipments', {
        params: {
          as: 'donor',
          per_page: 50,
        },
      });
      const data = Array.isArray(res.data?.data?.shipments)
        ? res.data.data.shipments
        : Array.isArray(res.data?.shipments)
        ? res.data.shipments
        : Array.isArray(res.data)
        ? res.data
        : [];
      setShipments(data);
    } catch (err) {
      console.error(err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const resolveImageUrl = (value) => {
    if (!value || typeof value !== 'string') return null;
    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const cleaned = trimmed.replace(/^\/+/, '');
    if (cleaned.startsWith('storage/')) {
      return `https://bereloop-sibm4.karyakreasi.id/${cleaned}`;
    }
    if (cleaned.startsWith('uploads/')) {
      return `https://bereloop-sibm4.karyakreasi.id/storage/${cleaned}`.replace(/\/storage\/storage/, '/storage');
    }
    return `https://bereloop-sibm4.karyakreasi.id/${cleaned}`;
  };

  const getShipmentImage = (shipment) => {
    const item = shipment?.request?.item;
    const rawImage = item?.image_url || item?.images?.[0] || item?.image;
    return resolveImageUrl(rawImage) || '/placeholder.png';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Riwayat Donasi</h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="py-3">Barang</th>
                  <th>Penerima</th>
                  <th>Tanggal Donasi</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500">
                      Memuat riwayat pengiriman...
                    </td>
                  </tr>
                ) : shipments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500">
                      Belum ada riwayat pengiriman.
                    </td>
                  </tr>
                ) : (
                  shipments.map((shipment) => (
                    <tr key={shipment.id} className="border-t hover:bg-slate-50 transition-colors">
                      <td className="py-3 font-semibold text-slate-900">
                        {shipment.request?.item?.title || "-"}
                      </td>
                      <td>{shipment.request?.requester?.name || "-"}</td>
                      <td>
                        {shipment.created_at
                          ? new Date(shipment.created_at).toLocaleDateString("id-ID", {
                              day: "numeric",
                              month: "long",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td>
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[shipment.status] || 'bg-slate-100 text-slate-700'}`}>
                          {statusLabel[shipment.status] || shipment.status || "Selesai"}
                        </span>
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => setSelectedShipment(shipment)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          Lihat Detail
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Detail Donasi</h3>
            {selectedShipment ? (
              <div className="mt-5 space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-4">
                    <div className="h-16 w-16 rounded-3xl bg-white p-3 shadow-sm">
                      <img
                        src={getShipmentImage(selectedShipment)}
                        alt={selectedShipment.request?.item?.title || 'Barang'}
                        className="h-full w-full rounded-2xl object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-slate-500">Nama Barang</p>
                      <p className="text-lg font-semibold text-slate-900">{selectedShipment.request?.item?.title || '-'}</p>
                      <p className="text-sm text-slate-500">{selectedShipment.request?.item?.category?.name || '-'}</p>
                    </div>
                  </div>
                </div>

                <div className="grid gap-3">
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Penerima</p>
                    <p className="mt-2 font-semibold text-slate-900">{selectedShipment.request?.requester?.name || '-'}</p>
                    <p className="text-sm text-slate-500">{selectedShipment.request?.delivery_address || '-'}</p>
                    <p className="mt-2 text-sm text-slate-500">No. HP: {selectedShipment.request?.recipient_phone || '-'}</p>
                  </div>
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <p className="text-sm text-slate-500">Pengiriman</p>
                    <p className="mt-2 text-sm text-slate-900">Kurir: {selectedShipment.courier || '-'}</p>
                    <p className="text-sm text-slate-900">No. Resi: {selectedShipment.tracking_number || '-'}</p>
                    <p className="mt-2 text-sm text-slate-500">COD: Rp {selectedShipment.cod_amount?.toLocaleString('id-ID') || '0'}</p>
                    <p className="mt-2 text-sm text-slate-500">Dibuat: {selectedShipment.created_at ? new Date(selectedShipment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 p-4">
                  <p className="text-sm text-slate-500">Status Pengiriman</p>
                  <div className="mt-3 flex items-center justify-between gap-4">
                    <span className={`inline-flex rounded-full px-3 py-2 text-xs font-semibold ${statusBadge[selectedShipment.status] || 'bg-slate-100 text-slate-700'}`}>
                      {statusLabel[selectedShipment.status] || selectedShipment.status || 'Selesai'}
                    </span>
                    <div className="text-right text-sm text-slate-500">
                      <p>Berangkat: {selectedShipment.shipped_at ? new Date(selectedShipment.shipped_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                      <p>Terima: {selectedShipment.delivered_at ? new Date(selectedShipment.delivered_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mt-4 rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-8 text-center text-slate-500">
                Klik tombol "Lihat Detail" pada baris untuk menampilkan informasi pengiriman.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
