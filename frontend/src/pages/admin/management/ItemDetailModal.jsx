import { statusLabel } from "./constants";

export default function ItemDetailModal({
  open,
  item,
  onClose,
  getImageUrl,
}) {
  if (!open || !item) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl w-full max-w-3xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-black"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-6">
          Detail Barang
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={getImageUrl(item)}
              alt={item.title}
              className="w-full h-72 object-cover rounded-xl border"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-gray-500 text-sm">Nama Barang</p>
              <p className="font-semibold">{item.title}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Kategori</p>
              <p className="font-semibold">
                {item.category?.name || "-"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Kondisi</p>
              <p className="font-semibold">{item.condition}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Lokasi</p>
              <p className="font-semibold">{item.location}</p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Pengiriman</p>
              <p className="font-semibold">
                {item.shipping_type === "free"
                  ? "Pickup Gratis"
                  : "Delivery Berbayar"}
              </p>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Status</p>

              <span
                className={`px-3 py-1 rounded-full text-xs ${
                  statusLabel(item.status).className
                }`}
              >
                {statusLabel(item.status).label}
              </span>
            </div>

            <div>
              <p className="text-gray-500 text-sm">Donatur</p>
              <p className="font-semibold">
                {item.donor?.name || "-"}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <p className="text-gray-500 text-sm mb-2">
            Deskripsi Barang
          </p>

          <div className="bg-gray-50 p-4 rounded-lg">
            {item.description}
          </div>
        </div>

        <div className="mt-4 text-sm text-gray-500">
          Dibuat :
          {" "}
          {new Date(item.created_at).toLocaleDateString("id-ID")}
        </div>
      </div>
    </div>
  );
}