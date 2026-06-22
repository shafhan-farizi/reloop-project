import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [loading, setLoading] = useState(true);

  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

  const filteredShipments = useMemo(() => {
    if (!searchQuery) return shipments;
    return shipments.filter((shipment) =>
      (shipment.request?.item?.title || "").toLowerCase().includes(searchQuery)
    );
  }, [shipments, searchQuery]);

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

  const normalizeRupiahValue = (value) => {
    if (value === null || value === undefined || value === '') return 0;
    const normalized = String(value)
      .replace(/\./g, '')
      .replace(/,/g, '.')
      .replace(/[^\d.-]/g, '');
    return Number(normalized) || 0;
  };

  const formatRupiahValue = (value) => {
    return normalizeRupiahValue(value).toLocaleString('id-ID');
  };

  return (
    <div>
      <h2 className="text-xl font-semibold">Riwayat Donasi</h2>
      <div className="mt-4 grid gap-6 lg:grid-cols-[1.7fr_1fr]">
        <div className="bg-white rounded-3xl p-5 shadow-sm">
          <div>
            <div className="hidden sm:block overflow-x-auto">
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
                ) : filteredShipments.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-slate-500">
                      Tidak ada riwayat pengiriman yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredShipments.map((shipment) => (
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

            <div className="block sm:hidden">
              {loading ? (
                <div className="p-6 text-center text-slate-500">Memuat riwayat pengiriman...</div>
              ) : filteredShipments.length === 0 ? (
                <div className="p-6 text-center text-slate-500">Tidak ada riwayat pengiriman yang cocok.</div>
              ) : (
                <div className="space-y-3">
                  {filteredShipments.map((shipment) => (
                    <div key={shipment.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex items-start gap-3">
                        <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                          <img src={getShipmentImage(shipment)} alt={shipment.request?.item?.title || 'Barang'} className="h-full w-full object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-semibold text-slate-900 text-sm truncate">{shipment.request?.item?.title || '-'}</div>
                              <div className="text-xs text-slate-500">{shipment.request?.requester?.name || '-'}</div>
                            </div>
                            <div className="text-xs text-slate-400">{shipment.created_at ? new Date(shipment.created_at).toLocaleDateString('id-ID') : '-'}</div>
                          </div>

                          <div className="mt-2 flex items-center justify-between">
                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusBadge[shipment.status] || 'bg-slate-100 text-slate-700'}`}>{statusLabel[shipment.status] || shipment.status || 'Selesai'}</span>
                            <button onClick={() => setSelectedShipment(shipment)} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">Lihat Detail</button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h3 className="text-lg font-semibold">Detail Donasi</h3>
            {selectedShipment ? (
              <div className="mt-5 space-y-5">
                <div className="grid gap-3">
                  <div className="rounded-3xl border border-slate-200 p-4">
                    <div className="flex items-center gap-4 pb-4 border-b border-slate-200">
                      <div className="h-16 w-16 rounded-3xl bg-white p-2 shadow-sm flex-shrink-0">
                        <img
                          src={getShipmentImage(selectedShipment)}
                          alt={selectedShipment.request?.item?.title || 'Barang'}
                          className="h-full w-full rounded-2xl object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Nama Barang</p>
                        <p className="text-lg font-semibold text-slate-900 truncate">{selectedShipment.request?.item?.title || '-'}</p>
                        <div className="mt-2 flex flex-wrap gap-1">
                          {selectedShipment.request?.item?.category?.name && (
                            <span className="rounded-full bg-sky-100 px-2 py-0.5 text-xs font-semibold text-sky-700">
                              {selectedShipment.request.item.category.name}
                            </span>
                          )}
                          {selectedShipment.request?.item?.condition && (
                            <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-semibold text-amber-700">
                              {selectedShipment.request.item.condition}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedShipment.request?.item?.description && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <p className="text-sm text-slate-600">{selectedShipment.request.item.description}</p>
                      </div>
                    )}

                    <div className="mt-4 pt-4 border-t border-slate-200 grid grid-cols-2 gap-3">
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Penerima</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedShipment.request?.requester?.name || '-'}</p>
                        <p className="text-xs text-slate-500 mt-1">{selectedShipment.request?.delivery_address || '-'}</p>
                        <p className="text-xs text-slate-500">HP: {selectedShipment.request?.recipient_phone || '-'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 uppercase tracking-wide">Pengiriman</p>
                        <p className="mt-1 text-sm font-semibold text-slate-900">{selectedShipment.courier || '-'}</p>
                        <p className="text-xs text-slate-500 mt-1">Resi: {selectedShipment.tracking_number || '-'}</p>
                        <p className="text-xs text-slate-500">COD: Rp {formatRupiahValue(selectedShipment.cod_amount)}</p>
                      </div>
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-200">
                      <p className="text-xs text-slate-500 uppercase tracking-wide">Dibuat</p>
                      <p className="mt-1 text-sm text-slate-900">{selectedShipment.created_at ? new Date(selectedShipment.created_at).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }) : '-'}</p>
                    </div>
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
