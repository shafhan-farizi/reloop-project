import { useCallback, useEffect, useState } from "react";
import { createShipment } from "../../_service/shipment";
import { getApprovedRequests } from "../../_service/request";

export default function InputResi() {
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [requests, setRequests] = useState([]);

  const [form, setForm] = useState({
    request_id: "",
    courier: "",
    cod_amount: "",
  });

  const loadRequests = useCallback(async () => {
    try {
      setLoading(true);

      const response = await getApprovedRequests();

      console.log("APPROVED REQUESTS:", response);

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

      setRequests(requestsData);
    } catch (error) {
      console.error("LOAD REQUEST ERROR:", error);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchInitialRequests = async () => {
      await loadRequests();
    };

    fetchInitialRequests();
  }, [loadRequests]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.request_id) {
      alert("Pilih request terlebih dahulu");
      return;
    }

    // if (!form.courier) {
    //   alert("Pilih kurir");
    //   return;
    // }

    // Nomor resi tidak diisi di form ini. Jika ingin, dapat ditambahkan
    // nanti dari halaman detail shipment.

    try {
      setSubmitLoading(true);

      const normalizedCodAmount = String(form.cod_amount)
        .replace(/\./g, '')
        .replace(/,/g, '.')
        .replace(/[^\d.-]/g, '');

      const payload = {
        request_id: Number(form.request_id),
        courier: form.courier,
        cod_amount: Number(normalizedCodAmount) || 0,
      };

      // Jika ada tracking_number (mis. di masa depan), sertakan saja
      if (form.tracking_number) payload.tracking_number = form.tracking_number;

      console.log("SHIPMENT PAYLOAD:", payload);

      const result = await createShipment(payload);

      console.log("SHIPMENT RESULT:", result);

      alert(result?.message || "Shipment berhasil dibuat");

      setForm({
        request_id: "",
        courier: "",
        cod_amount: "",
      });

      await loadRequests();
    } catch (error) {
      console.error(error);

      alert(error?.response?.data?.message || "Gagal membuat shipment");
    } finally {
      setSubmitLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 sm:p-6">
      <div className="mb-6 sm:mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">
          Input Pengiriman
        </h1>

        <p className="mt-1 sm:mt-2 text-xs sm:text-sm text-slate-500">
          Pilih request yang sudah disetujui lalu masukkan informasi pengiriman.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* FORM */}
        <div className="lg:col-span-2">
          <div className="bg-white border rounded-lg sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-4 sm:mb-6">Form Pengiriman</h2>

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div>
                <label className="block mb-2 text-xs sm:text-sm font-medium">
                  Request ID
                </label>

                <input
                  type="text"
                  value={form.request_id}
                  readOnly
                  placeholder="Pilih request dari daftar"
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl bg-slate-100 text-sm"
                />
              </div>

              <div>
                <label className="block mb-2 text-xs sm:text-sm font-medium">
                  COD Amount (Opsional)
                </label>

                <input
                  type="text"
                  value={form.cod_amount}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      cod_amount: e.target.value,
                    }))
                  }
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 border rounded-lg sm:rounded-xl text-sm"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={submitLoading}
                  className="px-4 sm:px-6 py-2 sm:py-3 bg-[#14B8A6] text-white rounded-lg sm:rounded-xl hover:bg-[#14B8A6]/90 disabled:opacity-50 text-sm sm:text-base font-medium whitespace-nowrap"
                >
                  {submitLoading ? "Menyimpan..." : "Simpan Shipment"}
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* LIST REQUEST */}
        <div>
          <div className="bg-white border rounded-lg sm:rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4">Request Approved</h2>

            {loading ? (
              <div className="text-center py-6 sm:py-8 text-slate-500 text-sm">
                Memuat data...
              </div>
            ) : requests.length === 0 ? (
              <div className="text-center py-6 sm:py-8 text-slate-500 text-sm">
                Tidak ada request approved
              </div>
            ) : (
              <div className="space-y-3 sm:space-y-4">
                {requests.map((req) => {
                  console.log(req);
                  const selected = Number(form.request_id) === req.id;

                  return (
                    <div
                      key={req.id}
                      className={`border rounded-lg sm:rounded-xl p-3 sm:p-4 transition text-sm ${
                        selected
                          ? "border-blue-500 bg-blue-50"
                          : "hover:border-slate-300"
                      }`}
                    >
                      <h3 className="font-semibold text-sm">{`Request #${req.id}`}</h3>

                      <p className="text-xs sm:text-sm text-gray-500 mt-1 truncate">
                        {req?.item?.title ||
                          req?.title ||
                          req?.donation?.title ||
                          "Donasi"}
                      </p>

                      <span className="inline-block mt-2 px-2 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        {req.status}
                      </span>

                      <button
                        type="button"
                        onClick={() =>
                          setForm((prev) => ({
                            ...prev,
                            request_id: req.id,
                          }))
                        }
                        className="mt-2 sm:mt-3 w-full py-2 bg-[#14B8A6] text-white rounded-lg hover:bg-[#14B8A6]/90 text-xs sm:text-sm font-medium"
                      >
                        Pilih Request
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
