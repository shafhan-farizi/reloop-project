import { FiEye, FiEdit2, FiTrash2 } from "react-icons/fi";
import { statusLabel } from "./constants";

export default function ItemTable({
  items,
  getImageUrl,
  handleDetail,
  handleEdit,
  handleDelete,
}) {
  return (
    <table className="w-full">
      <thead className="bg-gray-50">
        <tr>
          <th className="p-4">Foto</th>
          <th className="p-4">Nama Barang</th>
          <th className="p-4">Kondisi</th>
          <th className="p-4">Status</th>
          <th className="p-4">Tanggal</th>
          <th className="p-4">Aksi</th>
        </tr>
      </thead>

      <tbody>
        {items.map((item) => {
          const label = statusLabel(item.status);

          return (
            <tr key={item.id} className="border-t">
              <td className="p-4">
                <img
                  src={getImageUrl(item)}
                  alt=""
                  className="w-14 h-14 object-cover rounded"
                />
              </td>

              <td className="p-4">{item.title}</td>

              <td className="p-4">{item.condition}</td>

              <td className="p-4">
                <span
                  className={`px-3 py-1 rounded-full text-xs ${label.className}`}
                >
                  {label.label}
                </span>
              </td>

              <td className="p-4">
                {new Date(item.created_at).toLocaleDateString("id-ID")}
              </td>

              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    onClick={() => handleDetail(item)}
                    className="w-9 h-9 flex justify-center items-center rounded-lg bg-blue-50 text-blue-600"
                  >
                    <FiEye />
                  </button>

                  <button
                    onClick={() => handleEdit(item)}
                    className="w-9 h-9 flex justify-center items-center rounded-lg bg-green-50 text-green-600"
                  >
                    <FiEdit2 />
                  </button>

                  <button
                    onClick={() => handleDelete(item.id)}
                    className="w-9 h-9 flex justify-center items-center rounded-lg bg-red-50 text-red-600"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}