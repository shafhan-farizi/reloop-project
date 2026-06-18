import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../../api/xios";
import { createShipment } from "../../_service/shipment";
import { getApprovedRequests } from "../../_service/request";

export default function Pengiriman() {
  const [searchParams] = useSearchParams();
  const [shipments, setShipments] = useState([]);
  const [selectedShipment, setSelectedShipment] = useState(null);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedRequestId, setSelectedRequestId] = useState("");
  const selectedRequest = useMemo(
    () => approvedRequests.find((req) => String(req.id) === selectedRequestId) || null,
    [approvedRequests, selectedRequestId]
  );
  const [form, setForm] = useState({
    courier: "",
    tracking_number: "",
    cod_amount: "",
  });
  const [loading, setLoading] = useState(true);
  const [requestLoading, setRequestLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);

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
      const res = await api.get('/shipments', {
        params: {
          as: 'donor',
          per_page: 50,
        },
      });
      const data = res.data?.data?.shipments || [];
      setShipments(data);
    } catch (err) {
      console.error("Gagal memuat pengiriman:", err);
      setShipments([]);
    } finally {
      setLoading(false);
    }
  };

  const loadApprovedRequests = async () => {
    setRequestLoading(true);
    try {
      const response = await getApprovedRequests();
      let requestsData = [];

      if (Array.isArray(response)) {
        requestsData = response;
      } else if (Array.isArray(response?.requests)) {
        requestsData = response.requests;
      } else if (Array.isArray(response?.data?.requests)) {
        requestsData = response.data.requests;
      } else if (Array.isArray(response?.data)) {
        requestsData = response.data;
      }

      setApprovedRequests(
        requestsData.filter((req) => !req.shipment)
      );
    } catch (err) {
      console.error("Gagal memuat request approved:", err);
      setApprovedRequests([]);
    } finally {
      setRequestLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!selectedRequestId) {
      alert("Pilih request terlebih dahulu untuk membuat shipment.");
      return;
    }

    if (!form.courier.trim() || !form.tracking_number.trim()) {
      alert("Lengkapi kurir dan nomor resi terlebih dahulu.");
      return;
    }

    try {
      setSubmitLoading(true);
      const result = await createShipment({
        request_id: Number(selectedRequestId),
        courier: form.courier,
        tracking_number: form.tracking_number,
        cod_amount: Number(form.cod_amount) || 0,
      });

      const createdShipment = result?.data?.shipment || result?.shipment || null;
      await load();
      await loadApprovedRequests();
      setSelectedRequestId("");
      setForm({ courier: "", tracking_number: "", cod_amount: "" });
      if (createdShipment) {
        setSelectedShipment(createdShipment);
      }
      alert("Shipment berhasil dibuat. Lihat di daftar pengiriman.");
    } catch (err) {
      console.error("Gagal membuat shipment:", err);
      alert(err?.response?.data?.message || "Gagal membuat shipment.");
    } finally {
      setSubmitLoading(false);
    }
  };

  useEffect(() => {
    load();
    loadApprovedRequests();
  }, []);

  useEffect(() => {
    const requestId = searchParams.get("request_id");
    if (requestId && approvedRequests.some((req) => String(req.id) === requestId)) {
      setSelectedRequestId(requestId);
    }
  }, [approvedRequests, searchParams]);

  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const resolveImageUrl = (value) => {
    if (!value) return null;
    if (typeof value !== "string") return null;

    const trimmed = value.trim();
    if (!trimmed) return null;
    if (/^https?:\/\//i.test(trimmed)) return trimmed;
    const cleaned = trimmed.replace(/^\/+/, "");
    if (cleaned.startsWith("storage/")) {
      return `https://bereloop-sibm4.karyakreasi.id/${cleaned}`;
    }
    if (cleaned.startsWith("uploads/")) {
      return `https://bereloop-sibm4.karyakreasi.id/storage/${cleaned}`.replace(/\/storage\/storage/, "/storage");
    }
    return `https://bereloop-sibm4.karyakreasi.id/${cleaned}`;
  };

  const getShipmentImage = (shipment) => {
    const item = shipment?.request?.item;
    const rawImage = item?.image_url || item?.images?.[0] || item?.image;
    return resolveImageUrl(rawImage) || "/placeholder.png";
  };

  const getStatusBadge = (status) => {
    const mapping = {
      preparing: "bg-sky-100 text-sky-700",
      in_transit: "bg-orange-100 text-orange-700",
      delivered: "bg-emerald-100 text-emerald-700",
      cancelled: "bg-rose-100 text-rose-700",
    };
    return mapping[status] || "bg-slate-100 text-slate-700";
  };

  const getTimeline = () => {
    if (!selectedShipment) return [];

    const requestApprovedAt = selectedShipment.request?.updated_at || selectedShipment.request?.created_at;
    const shippedAt = selectedShipment.shipped_at || selectedShipment.created_at;
    const deliveredAt = selectedShipment.delivered_at;
    const hasShipped = Boolean(shippedAt);

    return [
      {
        title: "Request disetujui",
        subtitle: selectedShipment.request?.status === "approved" ? "Selesai" : "Menunggu",
        date: formatDate(requestApprovedAt),
        active: true,
      },
      {
        title: "Barang dikirim",
        subtitle: selectedShipment.status === "delivered" ? "Dalam perjalanan" : "Sedang diproses",
        date: formatDate(shippedAt),
        active: hasShipped,
      },
      {
        title: "Barang diterima",
        subtitle: selectedShipment.status === "delivered" ? "Terkonfirmasi" : "Belum sampai",
        date: formatDate(deliveredAt),
        active: selectedShipment.status === "delivered",
      },
    ];
  };

  const summary = useMemo(() => {
    const counts = { "Pengiriman": 0, "Terkirim": 0, "Selesai": 0, "Dibatalkan": 0 };
    shipments.forEach(s => {
      const label = mapStatus(s.status);
      if (counts.hasOwnProperty(label)) counts[label]++;
    });
    return [
      { label: "Pengiriman", count: counts["Pengiriman"], color: "bg-sky-50 text-sky-700" },
      { label: "Terkirim", count: counts["Terkirim"], color: "bg-orange-50 text-orange-700" },
      { label: "Selesai", count: counts["Selesai"], color: "bg-emerald-50 text-emerald-700" },
      { label: "Dibatalkan", count: counts["Dibatalkan"], color: "bg-rose-50 text-rose-700" },
    ];
  }, [shipments]);

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Pengiriman</h2>
          <p className="text-sm text-slate-500">Kelola dan pantau pengiriman donasi Anda.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        {summary.map((item, idx) => (
          <div key={idx} className={`rounded-3xl border p-5 shadow-sm ${item.color}`}>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</div>
            <div className="mt-3 text-3xl font-bold">{item.count}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="bg-white rounded-3xl p-6 shadow-sm border">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-lg font-semibold">Daftar Pengiriman</h3>
              <p className="text-sm text-slate-500">Tampilkan semua pengiriman aktif dan statusnya.</p>
            </div>
            <div className="w-full max-w-sm">
              <input
                type="text"
                placeholder="Cari nama atau penerima..."
                className="w-full rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm outline-none focus:border-slate-300"
              />
            </div>
          </div>

          <div className="mt-6 overflow-x-auto">
            {loading ? (
              <p className="text-center py-8 text-slate-500">Memuat data...</p>
            ) : shipments.length === 0 ? (
              <p className="text-center py-8 text-slate-500">Tidak ada pengiriman yang tersedia.</p>
            ) : (
              <table className="w-full min-w-[640px] text-left text-sm text-slate-600">
                <thead className="border-b border-slate-200 text-slate-500">
                  <tr>
                    <th className="px-6 py-4">Barang</th>
                    <th className="px-6 py-4">Penerima</th>
                    <th className="px-6 py-4">Alamat</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {shipments.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900">{s.request?.item?.title || "-"}</td>
                      <td className="px-6 py-4">{s.request?.requester?.name || "-"}</td>
                      <td className="px-6 py-4 text-slate-600">{s.request?.delivery_address || "-"}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadge(s.status)}`}>
                          {mapStatus(s.status)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          type="button"
                          onClick={() => setSelectedShipment(s)}
                          className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                          {s.status === 'delivered' ? 'Lihat' : 'Lacak'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Detail Pengiriman</p>
                <h3 className="text-lg font-semibold">{selectedShipment ? "Ringkasan perjalanan" : "Pilih pengiriman untuk melihat detail"}</h3>
              </div>
            </div>

            {selectedShipment ? (
              <div className="mt-6 space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <div className="flex items-center gap-4">
                    <img src={getShipmentImage(selectedShipment)} alt="Barang" className="h-20 w-20 rounded-3xl object-cover" />
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Penerima</p>
                      <p className="text-lg font-semibold">{selectedShipment.request?.requester?.name || "-"}</p>
                      <p className="text-sm text-slate-500">{selectedShipment.request?.delivery_address || "-"}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="rounded-3xl bg-white p-4 shadow-sm border">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Barang</p>
                      <p className="mt-1 font-semibold">{selectedShipment.request?.item?.title || "-"}</p>
                    </div>
                    <div className="rounded-3xl bg-white p-4 shadow-sm border">
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Estimasi Tiba</p>
                      <p className="mt-1 font-semibold">
                        {selectedShipment.shipped_at
                          ? formatDate(new Date(new Date(selectedShipment.shipped_at).getTime() + 7 * 24 * 60 * 60 * 1000).toISOString())
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Timeline Pengiriman</h4>
                  <div className="space-y-5">
                    {getTimeline().map((step, index) => (
                      <div key={index} className="flex items-start gap-4">
                        <div className="mt-1 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-slate-50 text-sm font-semibold text-slate-700">
                          {index + 1}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{step.title}</p>
                          <p className="text-xs text-slate-500">{step.subtitle}</p>
                          {step.date && <p className="mt-2 text-xs text-slate-400">{step.date}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center text-slate-500">
                Pilih pengiriman di daftar untuk melihat detail dan timeline.
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h4 className="text-lg font-semibold mb-4">Buat Pengiriman</h4>
            {selectedRequest ? (
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Request Terpilih</p>
                  <p className="mt-2 font-semibold text-slate-900">{selectedRequest.item?.title || `Request #${selectedRequest.id}`}</p>
                  <p className="text-sm text-slate-500">{selectedRequest.requester?.name || '-'} • {formatDate(selectedRequest.created_at)}</p>
                  <p className="mt-3 text-sm text-slate-600">{selectedRequest.delivery_address || '-'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Kurir</label>
                    <input
                      type="text"
                      value={form.courier}
                      onChange={(e) => setForm((prev) => ({ ...prev, courier: e.target.value }))}
                      placeholder="JNE, J&T, SiCepat..."
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">No. Resi</label>
                    <input
                      type="text"
                      value={form.tracking_number}
                      onChange={(e) => setForm((prev) => ({ ...prev, tracking_number: e.target.value }))}
                      placeholder="Masukkan nomor resi"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">COD Amount (opsional)</label>
                    <input
                      type="number"
                      value={form.cod_amount}
                      onChange={(e) => setForm((prev) => ({ ...prev, cod_amount: e.target.value }))}
                      placeholder="0"
                      className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={submitLoading || !selectedRequestId}
                    className="w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitLoading ? 'Menyimpan...' : 'Buat Shipment'}
                  </button>
                </form>
              </div>
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 p-6 text-slate-500">
                Pilih request approved di bawah untuk membuat shipment.
              </div>
            )}
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border">
            <h4 className="text-lg font-semibold mb-4">Request Approved</h4>
            {requestLoading ? (
              <div className="text-sm text-slate-500">Memuat request approved...</div>
            ) : approvedRequests.length === 0 ? (
              <div className="text-sm text-slate-500">Tidak ada request approved yang belum memiliki shipment.</div>
            ) : (
              <div className="space-y-4">
                {approvedRequests.map((req) => (
                  <button
                    key={req.id}
                    type="button"
                    onClick={() => setSelectedRequestId(String(req.id))}
                    className={`w-full rounded-3xl border px-4 py-4 text-left transition ${selectedRequestId === String(req.id) ? 'border-teal-500 bg-teal-50' : 'border-slate-200 bg-white hover:border-slate-300'}`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="font-semibold">{req.item?.title || `Request #${req.id}`}</p>
                        <p className="text-xs text-slate-500">{req.requester?.name || '-'} • {formatDate(req.created_at)}</p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600">Pilih</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
