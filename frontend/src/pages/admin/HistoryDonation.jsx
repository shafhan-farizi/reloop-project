import { useEffect, useState } from "react";
import { getDonationHistory } from "../../_service/donation";

export default function DonationHistory() {
  const [data, setData] = useState([]);
  const [page, setPage] = useState(1);
  const [viewAll, setViewAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (viewAll) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        const res = await getDonationHistory(token, page);

        const rawData = res?.data?.requests || [];

        const mapped = rawData.map((item) => ({
          id: item.id,
          name: item.item?.title || item.item?.name || "-",
          requester: item.requester?.name || "-",
          date: item.created_at
            ? new Date(item.created_at).toLocaleDateString("id-ID")
            : "-",
          status: item.status || "pending",

          image: item.item?.images || "",
          condition: item.item?.condition || "-",
          description: item.item?.description || "-",
          location: item.item?.location || "-",
        }));

        setData(mapped);
      } catch (err) {
        console.error("Gagal mengambil data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [page, token, viewAll]);

  const handleViewAll = async () => {
    try {
      setLoading(true);

      let currentPage = 1;
      let allData = [];
      let hasMoreData = true;

      while (hasMoreData) {
        const res = await getDonationHistory(token, currentPage);

        const requests = res?.data?.requests || [];

        if (requests.length === 0) {
          hasMoreData = false;
        } else {
          allData.push(...requests);
          currentPage++;
        }
      }

      const mapped = allData.map((item) => ({
        id: item.id,
        name: item.item?.title || item.item?.name || "-",
        requester: item.requester?.name || "-",
        date: item.created_at
          ? new Date(item.created_at).toLocaleDateString("id-ID")
          : "-",
        status: item.status || "pending",

        image: item.item?.images || "",
        condition: item.item?.condition || "-",
        description: item.item?.description || "-",
        location: item.item?.location || "-",
      }));

      setData(mapped);

      setViewAll(true);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToPagination = () => {
    setViewAll(false);
    setPage(1);
  };

  const handlePrint = () => {
    window.print();
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case "pending":
        return "bg-amber-100 text-amber-700 border border-amber-200";
      case "approved":
      case "terkirim":
        return "bg-emerald-100 text-emerald-700 border border-emerald-200";
      case "rejected":
        return "bg-red-100 text-red-700 border border-red-200";
      default:
        return "bg-gray-100 text-gray-600 border border-gray-200";
    }
  };

  const handlePrintDetail = () => {
    const item = selectedItem;

    const printWindow = window.open("", "_blank");

    printWindow.document.write(`
    <html>
      <head>
        <title>Detail Barang Donasi</title>

        <style>
          body {
            font-family: Arial, sans-serif;
            padding: 40px;
            color: #333;
          }

          .header {
            text-align: center;
            margin-bottom: 30px;
            border-bottom: 2px solid #ddd;
            padding-bottom: 15px;
          }

          .header h1 {
            margin: 0;
            font-size: 22px;
          }

          .container {
            display: flex;
            gap: 30px;
            margin-top: 20px;
          }

          .image {
            width: 280px;
          }

          .image img {
            width: 100%;
            border-radius: 12px;
            border: 1px solid #ddd;
          }

          .info {
            flex: 1;
          }

          .row {
            margin-bottom: 12px;
          }

          .label {
            font-weight: bold;
            color: #555;
            font-size: 13px;
          }

          .value {
            font-size: 14px;
            margin-top: 2px;
          }

          .description {
            margin-top: 25px;
            padding: 15px;
            border: 1px solid #ddd;
            border-radius: 10px;
            background: #f9f9f9;
          }

          .status {
            display: inline-block;
            padding: 4px 10px;
            border-radius: 20px;
            background: #eee;
            font-size: 12px;
          }

        </style>
      </head>

      <body>

        <div class="header">
          <h1>DETAIL BARANG DONASI</h1>
          <p>Tanggal Print: ${new Date().toLocaleDateString("id-ID")}</p>
        </div>

        <div class="container">

          <div class="image">
            <img src="${item.image}" />
          </div>

          <div class="info">

            <div class="row">
              <div class="label">Nama Barang</div>
              <div class="value">${item.name}</div>
            </div>

            <div class="row">
              <div class="label">Requester</div>
              <div class="value">${item.requester}</div>
            </div>

            <div class="row">
              <div class="label">Kondisi</div>
              <div class="value">${item.condition}</div>
            </div>

            <div class="row">
              <div class="label">Lokasi</div>
              <div class="value">${item.location}</div>
            </div>

            <div class="row">
              <div class="label">Status</div>
              <div class="value">
                <span class="status">${item.status}</span>
              </div>
            </div>

            <div class="row">
              <div class="label">Tanggal</div>
              <div class="value">${item.date}</div>
            </div>

          </div>
        </div>

        <div class="description">
          <div class="label">Deskripsi</div>
          <div class="value">${item.description}</div>
        </div>

      </body>
    </html>
  `);

    printWindow.document.close();

    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Riwayat Donasi</h1>
        <p className="text-sm text-gray-500 mt-1">
          Kelola dan lihat seluruh riwayat request donasi pengguna
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
        {/* Top Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 border-b">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Riwayat Request Donasi
            </h2>
            <p className="text-sm text-gray-500">
              Total Data:{" "}
              <span className="font-semibold text-emerald-600">
                {data.length}
              </span>
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            {!viewAll ? (
              <button
                onClick={handleViewAll}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition"
              >
                📋 View All Data
              </button>
            ) : (
              <button
                onClick={handleBackToPagination}
                className="px-4 py-2 rounded-lg bg-gray-600 hover:bg-gray-700 text-white text-sm font-medium transition"
              >
                ← Kembali
              </button>
            )}

            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition"
            >
              🖨 Print Riwayat
            </button>
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="h-10 w-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-3 text-sm text-gray-500">Memuat data riwayat...</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Nama Barang
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Requester
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Tanggal
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Status
                    </th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">
                      Aksi
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {data.length > 0 ? (
                    data.map((item, index) => (
                      <tr
                        key={item.id || index}
                        className="border-b hover:bg-gray-50 transition"
                      >
                        <td className="px-4 py-3 font-medium text-gray-800">
                          {item.name}
                        </td>

                        <td className="px-4 py-3 text-gray-600">
                          {item.requester}
                        </td>

                        <td className="px-4 py-3 text-gray-600">{item.date}</td>

                        <td className="px-4 py-3">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                              item.status,
                            )}`}
                          >
                            {item.status}
                          </span>
                        </td>

                        <td className="px-4 py-3">
                          <button
                            onClick={() => {
                              setSelectedItem(item);
                              setShowDetail(true);
                            }}
                            className="px-3 py-1.5 rounded-md border border-blue-200 text-blue-600 hover:bg-blue-50 text-xs font-medium transition"
                          >
                            Detail
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan={5}
                        className="text-center py-12 text-gray-500"
                      >
                        Tidak ada data riwayat donasi
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {!viewAll && (
              <div className="flex justify-center items-center gap-3 p-5 border-t">
                <button
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                >
                  ← Prev
                </button>

                <div className="px-4 py-2 rounded-lg bg-emerald-50 text-emerald-700 font-semibold">
                  {page}
                </div>

                <button
                  onClick={() => setPage((prev) => prev + 1)}
                  className="px-4 py-2 rounded-lg border hover:bg-gray-100 transition"
                >
                  Next →
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {showDetail && selectedItem && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center p-6 border-b">
              <h2 className="text-2xl font-bold text-gray-800">
                Detail Barang
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrintDetail}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-sm font-medium"
                >
                  🖨 Print Detail
                </button>

                <button
                  onClick={() => setShowDetail(false)}
                  className="text-gray-400 hover:text-gray-700 text-2xl"
                ></button>
              </div>
              <button
                onClick={() => setShowDetail(false)}
                className="text-gray-400 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div id="detail-barang-print" className="p-6">
              <div className="grid md:grid-cols-2 gap-8">
                {/* Gambar */}
                <div>
                  <img
                    src={
                      selectedItem.image ||
                      "https://via.placeholder.com/600x400"
                    }
                    alt={selectedItem.name}
                    className="w-full h-[320px] object-cover rounded-2xl border"
                  />
                </div>

                {/* Informasi */}
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">Nama Barang</p>
                    <p className="font-semibold text-lg">{selectedItem.name}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Kondisi</p>
                    <p className="font-medium">{selectedItem.condition}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Lokasi</p>
                    <p className="font-medium">{selectedItem.location}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Status</p>

                    <span
                      className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                        selectedItem.status,
                      )}`}
                    >
                      {selectedItem.status}
                    </span>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Requester</p>
                    <p className="font-medium">{selectedItem.requester}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Tanggal Request</p>
                    <p className="font-medium">{selectedItem.date}</p>
                  </div>
                </div>
              </div>

              {/* Deskripsi */}
              <div className="mt-8">
                <h3 className="font-semibold text-gray-700 mb-3">
                  Deskripsi Barang
                </h3>

                <div className="bg-gray-50 border rounded-xl p-4 text-gray-700">
                  {selectedItem.description}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
