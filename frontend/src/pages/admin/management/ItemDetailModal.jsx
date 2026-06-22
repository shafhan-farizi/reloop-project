import { statusLabel } from "./constants";

export default function ItemDetailModal({
  open,
  item,
  onClose,
  getImageUrl,
}) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 sm:p-0">
      <div className="bg-white rounded-lg sm:rounded-2xl w-full max-w-3xl p-4 sm:p-6 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-3 sm:top-4 right-3 sm:right-4 text-gray-500 hover:text-black text-lg sm:text-2xl"
        >
          ✕
        </button>

        <h2 className="text-lg sm:text-2xl font-bold mb-4 sm:mb-6 pr-6">
          Detail Barang
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          <div>
            <img
              src={getImageUrl(item)}
              alt={item.title}
              className="w-full h-48 sm:h-64 md:h-72 object-cover rounded-lg sm:rounded-xl border"
            />
          </div>

          <div className="space-y-2 sm:space-y-3">
            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Nama Barang</p>
              <p className="font-semibold text-sm sm:text-base">{item.title}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Kategori</p>
              <p className="font-semibold text-sm sm:text-base">
                {item.category?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Kondisi</p>
              <p className="font-semibold text-sm sm:text-base">{item.condition}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Lokasi</p>
              <p className="font-semibold text-sm sm:text-base">{item.location}</p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Pengiriman</p>
              <p className="font-semibold text-sm sm:text-base">
                {item.shipping_type === "free"
                  ? "Pickup Gratis"
                  : "Delivery Berbayar"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Status</p>

              <span
                className={`px-2 sm:px-3 py-1 rounded-full text-xs ${
                  statusLabel(item.status).className
                }`}
              >
                {statusLabel(item.status).label}
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-xs sm:text-sm">Donatur</p>
              <p className="font-semibold text-sm sm:text-base">
                {item.donor?.name || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-4 sm:mt-6">
          <p className="text-gray-500 text-xs sm:text-sm mb-2">
            Deskripsi Barang
          </p>

          <div className="bg-gray-50 p-3 sm:p-4 rounded-lg text-sm sm:text-base">
            {item.description}
          </div>
        </div>

        <div className="mt-3 sm:mt-4 text-xs sm:text-sm text-gray-500">
          Dibuat :{" "}
          {new Date(item.created_at).toLocaleDateString("id-ID")}
        </div>
      </div>
    </div>
  );
}