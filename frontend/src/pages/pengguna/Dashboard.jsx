import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getIncomingRequests, approveRequest, rejectRequest } from "../../_service/request";
import donation1 from "../../assets/donation-1.jpg";
import donation2 from "../../assets/donation-2.jpg";
import donation3 from "../../assets/donation-3.jpg";
import donation4 from "../../assets/donation-4.jpg";

function getUserData() {
  if (typeof window === "undefined") return { name: "Donatur" };
  try {
    const raw = localStorage.getItem("user");
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      name: parsed.name || parsed.full_name || parsed.username || "Donatur",
      role: parsed.role,
    };
  } catch {
    return { name: "Donatur" };
  }
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const user = getUserData();

  const loadRequests = async () => {
    setLoading(true);
    try {
      const data = await getIncomingRequests({ page: 1, per_page: 5 });
      const incoming = Array.isArray(data) ? data : data?.requests;
      setRequests(incoming || []);
    } catch (err) {
      console.error(err);
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await approveRequest(id);
      await loadRequests();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal approve request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    setActionLoading(true);
    try {
      await rejectRequest(id, "Request ditolak oleh donatur.");
      await loadRequests();
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || "Gagal reject request.");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="space-y-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Dashboard Donatur
            </p>
            <h1 className="mt-3 text-5xl font-bold uppercase tracking-[-0.03em] text-slate-900">
              Halo Donatur !!!
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-600">
              Terimakasih telah berbagi kebaikan hari ini. Pantau request masuk dan progress pengiriman donasi Anda dalam satu tampilan.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation1} alt="Donasi" className="h-44 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation2} alt="Donasi" className="h-44 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation3} alt="Donasi" className="h-44 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation4} alt="Donasi" className="h-44 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">Request Masuk Terbaru</p>
            <h2 className="mt-3 text-2xl font-bold text-slate-900">Request Masuk</h2>
          </div>
          <button
            onClick={() => navigate("/pengguna/request-masuk")}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Lihat Semua
          </button>
        </div>

        <div className="mt-6 overflow-hidden rounded-[2rem] border border-slate-200 bg-white">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.2em]">Nama barang</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.2em]">Requester</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.2em]">Tanggal Request</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.2em]">Status</th>
                  <th className="px-6 py-4 text-left font-semibold uppercase tracking-[0.2em]">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      Memuat request...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                      Belum ada request masuk.
                    </td>
                  </tr>
                ) : (
                  requests.map((r, index) => (
                    <tr key={r.id} className={index < requests.length - 1 ? "border-b border-slate-200" : ""}>
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <div className="h-14 w-14 overflow-hidden rounded-3xl bg-slate-200">
                            <img
                              src={r.item?.images?.[0] || "https://via.placeholder.com/80"}
                              alt={r.item?.title || "Item"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div>
                            <p className="font-semibold text-slate-900">{r.item?.title || '-'}</p>
                            <p className="text-xs text-slate-500">{r.item?.category?.name || 'Kategori tidak tersedia'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-slate-700">{r.requester?.name || r.requester_name || "-"}</td>
                      <td className="px-6 py-5 text-slate-700">{r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID") : "-"}</td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                          r.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : r.status === "approved"
                            ? "bg-emerald-100 text-emerald-700"
                            : r.status === "rejected"
                            ? "bg-rose-100 text-rose-700"
                            : "bg-slate-100 text-slate-700"
                        }`}>
                          {r.status === "pending"
                            ? "Pending"
                            : r.status === "approved"
                            ? "Terkirim"
                            : r.status === "rejected"
                            ? "Ditolak"
                            : r.status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        {r.status === "pending" ? (
                          <div className="flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(r.id)}
                              disabled={actionLoading}
                              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(r.id)}
                              disabled={actionLoading}
                              className="rounded-full bg-rose-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}
