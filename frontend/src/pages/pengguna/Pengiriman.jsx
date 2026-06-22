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

  const load = async (search = "") => {
    setLoading(true);
    try {
      const params = {
        as: 'donor',
        per_page: 50,
      };
      if (search) params.search = search;

      const res = await api.get('/shipments', { params });
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

  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

  const filteredShipments = useMemo(() => {
    if (!searchQuery) return shipments;
    return shipments.filter((shipment) => {
      const title =
        shipment.request?.item?.title ||
        shipment.request?.item?.name ||
        "";
      return title.toLowerCase().includes(searchQuery);
    });
  }, [shipments, searchQuery]);

  const parseRupiahInput = (value) => {
    if (typeof value === 'number') return value;
    if (value === undefined || value === null || value === '') return 0;
    const normalized = String(value)
      .replace(/\./g, '')
      .replace(/,/g, '.')
      .replace(/[^\d.-]/g, '');
    return Number(normalized) || 0;
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
        cod_amount: parseRupiahInput(form.cod_amount),
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
    const query = searchParams.get("search") || "";
    load(query);
    loadApprovedRequests();
  }, [searchParams]);

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
    const shippedAt = selectedShipment.shipped_at;
    const deliveredAt = selectedShipment.delivered_at;
    const hasShipped = Boolean(shippedAt);
    const hasDelivered = Boolean(deliveredAt);

    return [
      {
        title: "Request disetujui",
        subtitle: selectedShipment.request?.status === "approved" ? "Disetujui" : "Menunggu",
        date: formatDate(requestApprovedAt),
        active: true,
      },
      {
        title: "Barang dikirim",
        subtitle: hasDelivered ? "Sudah dikirim" : hasShipped ? "Dalam perjalanan" : "Belum dikirim",
        date: formatDate(shippedAt),
        active: hasShipped || hasDelivered,
      },
      {
        title: "Barang diterima",
        subtitle: hasDelivered ? "Terkonfirmasi" : hasShipped ? "Belum sampai" : "Menunggu pengiriman",
        date: formatDate(deliveredAt),
        active: hasDelivered,
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
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-6 md:p-8">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold">Pengiriman</h2>
          <p className="text-xs sm:text-sm text-slate-500">Kelola dan pantau pengiriman donasi Anda.</p>
        </div>
      </div>

      <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 md:grid-cols-4">
        {summary.map((item, idx) => (
          <div key={idx} className={`rounded-lg sm:rounded-2xl md:rounded-3xl border p-3 sm:p-4 md:p-5 shadow-sm ${item.color}`}>
            <div className="text-xs uppercase tracking-[0.3em] text-slate-500">{item.label}</div>
            <div className="mt-2 sm:mt-3 text-2xl sm:text-3xl font-bold">{item.count}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="bg-white rounded-lg sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 shadow-sm border">
          <div className="flex flex-col gap-2 sm:gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-semibold">Daftar Pengiriman</h3>
              <p className="text-xs sm:text-sm text-slate-500">Tampilkan semua pengiriman aktif dan statusnya.</p>
            </div>
            </div>

          <div>
            <div className="hidden sm:block mt-4 sm:mt-6 overflow-x-auto">
              {loading ? (
                <p className="text-center py-6 sm:py-8 text-slate-500 text-xs sm:text-sm">Memuat data...</p>
              ) : filteredShipments.length === 0 ? (
                <p className="text-center py-6 sm:py-8 text-slate-500 text-xs sm:text-sm">Tidak ada pengiriman yang tersedia.</p>
              ) : (
                <table className="w-full min-w-[520px] text-left text-xs sm:text-sm text-slate-600">
                  <thead className="border-b border-slate-200 text-slate-500">
                    <tr>
                      <th className="px-2 sm:px-4 py-3">Barang</th>
                      <th className="px-2 sm:px-4 py-3 hidden sm:table-cell">Penerima</th>
                      <th className="px-2 sm:px-4 py-3 hidden md:table-cell">Alamat</th>
                      <th className="px-2 sm:px-4 py-3">Status</th>
                      <th className="px-2 sm:px-4 py-3">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {filteredShipments.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-2 sm:px-4 py-3 font-semibold text-slate-900 text-xs sm:text-sm truncate">{s.request?.item?.title || "-"}</td>
                        <td className="px-2 sm:px-4 py-3 hidden sm:table-cell text-xs">{s.request?.requester?.name || "-"}</td>
                        <td className="px-2 sm:px-4 py-3 text-slate-600 hidden md:table-cell text-xs">{s.request?.delivery_address || "-"}</td>
                        <td className="px-2 sm:px-4 py-3">
                          <span className={`inline-flex rounded-full px-2 sm:px-3 py-0.5 sm:py-1 text-xs font-semibold ${getStatusBadge(s.status)}`}>
                            {mapStatus(s.status)}
                          </span>
                        </td>
                        <td className="px-2 sm:px-4 py-3">
                          <button
                            type="button"
                            onClick={() => setSelectedShipment(s)}
                            className="rounded-full border border-slate-200 bg-white px-2 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
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

            <div className="block sm:hidden">
              {loading ? (
                <p className="text-center py-6 text-slate-500 text-xs">Memuat data...</p>
              ) : filteredShipments.length === 0 ? (
                <p className="text-center py-6 text-slate-500 text-xs">Tidak ada pengiriman yang tersedia.</p>
              ) : (
                <div className="space-y-3">
                  {filteredShipments.map((s) => (
                    <div key={s.id} className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={getShipmentImage(s)} alt={s.request?.item?.title || 'Barang'} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-900 text-sm truncate">{s.request?.item?.title || '-'}</div>
                            <div className="text-xs text-slate-500">{s.request?.requester?.name || '-'}</div>
                          </div>
                          <div className="text-xs text-slate-400">{s.created_at ? new Date(s.created_at).toLocaleDateString('id-ID') : '-'}</div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusBadge(s.status)}`}>{mapStatus(s.status)}</span>
                          <button onClick={() => setSelectedShipment(s)} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100">{s.status === 'delivered' ? 'Lihat' : 'Lacak'}</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-4 sm:space-y-6">
          <div className="bg-white rounded-lg sm:rounded-2xl md:rounded-3xl p-4 sm:p-6 shadow-sm border">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Detail Pengiriman</p>
                <h3 className="text-lg font-semibold">{selectedShipment ? "Ringkasan perjalanan" : "Pilih pengiriman untuk melihat detail"}</h3>
              </div>
            </div>

            {selectedShipment ? (
              <>
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

                {selectedShipment.rating ? (
                  <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
                    <h4 className="mb-5 text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Feedback dari Penerima</h4>
                    <div className="flex items-center gap-2 text-amber-400 text-xl">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <span key={index}>{index < selectedShipment.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                    <p className="mt-3 text-sm text-slate-700">{selectedShipment.feedback_message || 'Penerima tidak memberikan komentar.'}</p>
                    {Array.isArray(selectedShipment.feedback_images) && selectedShipment.feedback_images.length > 0 && (
                      <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
                        {selectedShipment.feedback_images.map((image, idx) => (
                          <img key={idx} src={image} alt={`feedback-${idx}`} className="h-24 w-full rounded-2xl object-cover" />
                        ))}
                      </div>
                    )}
                  </div>
                ) : null}
              </>
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
                      type="text"
                      value={form.cod_amount}
                      onChange={(e) => setForm((prev) => ({ ...prev, cod_amount: e.target.value }))}
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
