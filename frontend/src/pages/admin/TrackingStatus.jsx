import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getShipment, updateShipmentStatus } from "../../_service/shipment";

const FALLBACK_IMAGE =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300' viewBox='0 0 300 300'%3E%3Crect width='300' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-size='14' fill='%239ca3af'%3ENo Image%3C/text%3E%3C/svg%3E";

// ✅ PERBAIKAN: regex .+ diganti .+? (non-greedy)
function getItemImage(images) {
  if (!images) return null;

  let url = null;

  if (Array.isArray(images)) url = images[0] || null;
  else if (typeof images === "string" && images.startsWith("http"))
    url = images;

  if (!url) return null;

  // Ekstrak path setelah domain kedua, lalu rebuild pakai base URL yang benar
  // Input:  "http://localhost:8000/storage/http://localhost/storage/uploads/items/kaos.webp"
  // Output: "http://localhost:8000/storage/uploads/items/kaos.webp"
  const match = url.match(/https?:\/\/[^/]+\/storage\/uploads\/.+/);
  if (match) {
    // Ambil hanya path /storage/uploads/... nya
    const pathMatch = url.match(/\/storage\/uploads\/.+/);
    if (pathMatch) return `http://localhost:8000${pathMatch[0]}`;
  }

  return url;
}

const STATUS_STEP = {
  preparing: 0,
  in_transit: 1,
  delivered: 2,
};

const TIMELINE = ["Paket Dipersiapkan", "Dalam Pengiriman", "Paket Diterima"];

export default function TrackingStatus() {
  const [searchParams] = useSearchParams();
  const [shipmentId, setShipmentId] = useState(searchParams.get("search") || "");
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const queryId = searchParams.get("search") || "";
    if (queryId && queryId !== shipmentId) {
      setShipmentId(queryId);
      handleSearch(queryId);
    }
  }, [searchParams]);

  const shipmentData = shipment;
  const currentStep = STATUS_STEP[shipmentData?.status] ?? 0;
  const imageSrc =
    !imgError && getItemImage(shipmentData?.request?.item?.images)
      ? getItemImage(shipmentData?.request?.item?.images)
      : FALLBACK_IMAGE;

  const handleSearch = async (id) => {
    if (!id || !id.trim()) {
      alert("Masukkan Shipment ID");
      return;
    }
    try {
      setLoading(true);
      setImgError(false);
      const res = await getShipment(id.trim());
      setShipment(res);
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Shipment tidak ditemukan");
      setShipment(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    try {
      await updateShipmentStatus(shipmentData.id);
      await handleSearch(shipmentId);
      alert("Status berhasil diperbarui");
    } catch (error) {
      console.error(error);
      alert(error?.response?.data?.message || "Gagal update status");
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch(shipmentId);
  };

  return (
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400 mb-4">
          Tracking Status
        </h1>
        <div className="flex gap-2 sm:gap-3">
          <input
            type="text"
            placeholder="Masukkan Shipment ID"
            value={shipmentId}
            onChange={(e) => setShipmentId(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 border rounded-lg px-3 sm:px-4 py-2 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-cyan-500"
          />
          <button
            onClick={() => handleSearch(shipmentId)}
            disabled={loading}
            className="bg-[#14B8A6] hover:bg-[#14B8A6]/90 disabled:opacity-50 text-white px-3 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium whitespace-nowrap"
          >
            {loading ? "Mencari..." : "Cari"}
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mt-4 sm:mt-6 text-gray-500 text-sm sm:text-base">
          Memuat data shipment...
        </div>
      )}

      {/* Detail Shipment */}
      {!loading && shipmentData && (
        <div className="bg-white rounded-lg sm:rounded-xl shadow-md p-4 sm:p-6 mt-4 sm:mt-6">
          {/* Detail Atas */}
          <div className="flex flex-col lg:flex-row gap-4 sm:gap-6">
            {/* Foto Barang */}
            <div className="w-full sm:w-80 lg:w-64 shrink-0">
              <img
                src={imageSrc}
                alt={shipmentData.request?.item?.title || "Item"}
                onError={() => setImgError(true)}
                className="w-full h-56 sm:h-64 object-cover border rounded-lg bg-gray-100"
              />
            </div>

            {/* Informasi Barang */}
            <div className="flex-1 space-y-2 sm:space-y-3 text-xs sm:text-sm">
              {[
                ["Nama Barang", shipmentData.request?.item?.title],
                ["Kondisi Barang", shipmentData.request?.item?.condition],
                ["Lokasi Barang", shipmentData.request?.item?.location],
                ["Kurir", shipmentData.courier],
                ["Alamat Tujuan", shipmentData.request?.delivery_address],
                ["No. Penerima", shipmentData.request?.recipient_phone],
              ].map(([label, value]) => (
                <div key={label} className="grid grid-cols-[100px_20px_1fr] sm:grid-cols-[140px_20px_1fr] gap-2">
                  <span className="text-gray-500 truncate">{label}</span>
                  <span className="flex-shrink-0">:</span>
                  <span className="break-words">{value ?? "-"}</span>
                </div>
              ))}

              <div className="grid grid-cols-[100px_20px_1fr] sm:grid-cols-[140px_20px_1fr] gap-2">
                <span className="text-gray-500">Status</span>
                <span className="flex-shrink-0">:</span>
                <span className="font-semibold text-cyan-600 capitalize">
                  {shipmentData.status?.replace("_", " ") ?? "-"}
                </span>
              </div>
            </div>
          </div>

          {/* Deskripsi */}
          <div className="mt-6 border-t pt-4">
            <h3 className="font-semibold text-sm sm:text-base mb-2">Deskripsi Barang</h3>
            <p className="text-gray-600 text-xs sm:text-sm">
              {shipmentData.request?.item?.description || "-"}
            </p>
          </div>

          {/* Tracking Timeline */}
          <div className="mt-8 border rounded-lg sm:rounded-xl p-4 sm:p-6">
            <h3 className="font-semibold text-base sm:text-lg mb-4 sm:mb-6">Status Pengiriman</h3>
            <div className="space-y-0">
              {TIMELINE.map((label, index) => (
                <div key={label} className="flex items-start gap-3 sm:gap-4">
                  <div className="flex flex-col items-center flex-shrink-0">
                    <div
                      className={`w-5 h-5 rounded-full border-2 ${
                        index <= currentStep
                          ? "bg-cyan-600 border-cyan-600"
                          : "bg-white border-gray-300"
                      }`}
                    />
                    {index < TIMELINE.length - 1 && (
                      <div
                        className={`w-0.5 h-10 ${
                          index < currentStep ? "bg-cyan-600" : "bg-gray-300"
                        }`}
                      />
                    )}
                  </div>
                  <p
                    className={`font-medium mt-0.5 text-sm sm:text-base ${
                      index <= currentStep ? "text-cyan-700" : "text-gray-400"
                    }`}
                  >
                    {label}
                  </p>
                </div>
              ))}
            </div>

            <div className="flex justify-end mt-6 sm:mt-8">
              <button
                onClick={handleUpdate}
                disabled={shipmentData?.status === "delivered"}
                className="bg-cyan-600 hover:bg-cyan-700 disabled:opacity-50 disabled:cursor-not-allowed text-white px-4 sm:px-5 py-2 rounded-lg text-sm sm:text-base font-medium"
              >
                Update Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
