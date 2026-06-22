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
    <div className="space-y-6 sm:space-y-8 md:space-y-8">
      <section className="rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="space-y-6 sm:space-y-8 md:space-y-10">
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-emerald-600">
              Dashboard Donatur
            </p>
            <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl md:text-5xl font-bold uppercase tracking-[-0.03em] text-slate-900">
              Halo Donatur !!!
            </h1>
            <p className="mt-2 sm:mt-4 max-w-2xl text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
              Terimakasih telah berbagi kebaikan hari ini. Pantau request masuk dan progress pengiriman donasi Anda dalam satu tampilan.
            </p>
          </div>

          <div className="grid gap-2 sm:gap-3 md:gap-4 grid-cols-2 sm:grid-cols-2 md:grid-cols-4">
            <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation1} alt="Donasi" className="h-32 sm:h-40 md:h-44 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation2} alt="Donasi" className="h-32 sm:h-40 md:h-44 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation3} alt="Donasi" className="h-32 sm:h-40 md:h-44 w-full object-cover" />
            </div>
            <div className="overflow-hidden rounded-lg sm:rounded-xl md:rounded-[2rem] bg-slate-100 shadow-sm">
              <img src={donation4} alt="Donasi" className="h-32 sm:h-40 md:h-44 w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="flex flex-col gap-4 sm:gap-6 md:gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-600">Request Masuk Terbaru</p>
            <h2 className="mt-2 sm:mt-3 text-lg sm:text-xl md:text-2xl font-bold text-slate-900">Request Masuk</h2>
          </div>
          <button
            onClick={() => navigate("/pengguna/request-masuk")}
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-4 sm:px-5 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-slate-900 transition hover:bg-slate-50 whitespace-nowrap"
          >
            Lihat Semua
          </button>
        </div>

        <div className="mt-4 sm:mt-6 overflow-hidden rounded-lg sm:rounded-xl md:rounded-[2rem] border border-slate-200 bg-white">
          <div>
            <div className="hidden sm:block overflow-x-auto">
              <table className="min-w-full text-left text-xs sm:text-sm text-slate-600">
              <thead className="bg-slate-50 text-slate-500">
                <tr>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold uppercase tracking-[0.2em]">Barang</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold uppercase tracking-[0.2em] hidden sm:table-cell">Requester</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold uppercase tracking-[0.2em] hidden md:table-cell">Tanggal</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold uppercase tracking-[0.2em]">Status</th>
                  <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 text-left font-semibold uppercase tracking-[0.2em]">Aksi</th>
                </tr>
              </thead>
              <tbody className="bg-white">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-3 sm:px-6 py-6 sm:py-10 text-center text-slate-500 text-xs sm:text-sm">
                      Memuat request...
                    </td>
                  </tr>
                ) : requests.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-3 sm:px-6 py-6 sm:py-10 text-center text-slate-500 text-xs sm:text-sm">
                      Belum ada request masuk.
                    </td>
                  </tr>
                ) : (
                  requests.map((r, index) => (
                    <tr key={r.id} className={index < requests.length - 1 ? "border-b border-slate-200" : ""}>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5">
                        <div className="flex items-center gap-2 sm:gap-4">
                          <div className="h-10 w-10 sm:h-14 sm:w-14 overflow-hidden rounded-2xl bg-slate-200 flex-shrink-0">
                            <img
                              src={r.item?.images?.[0] || "https://via.placeholder.com/80"}
                              alt={r.item?.title || "Item"}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{r.item?.title || '-'}</p>
                            <p className="text-xs text-slate-500">{r.item?.category?.name || 'Kategori'}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 text-slate-700 hidden sm:table-cell text-xs sm:text-sm">{r.requester?.name || r.requester_name || "-"}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 text-slate-700 hidden md:table-cell text-xs">{r.created_at ? new Date(r.created_at).toLocaleDateString("id-ID") : "-"}</td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5">
                        <span className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${
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
                            ? "Disetujui"
                            : r.status === "rejected"
                            ? "Ditolak"
                            : r.status}
                        </span>
                      </td>
                      <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5">
                        {r.status === "pending" ? (
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            <button
                              type="button"
                              onClick={() => handleApprove(r.id)}
                              disabled={actionLoading}
                              className="rounded-full bg-emerald-500 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-600 disabled:opacity-50"
                            >
                              Approve
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReject(r.id)}
                              disabled={actionLoading}
                              className="rounded-full bg-rose-500 px-2.5 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white transition hover:bg-rose-600 disabled:opacity-50"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-slate-500 text-xs">Selesai</span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
              </table>
            </div>

            <div className="block sm:hidden p-3">
              {loading ? (
                <div className="text-center text-xs text-slate-500">Memuat request...</div>
              ) : requests.length === 0 ? (
                <div className="text-center text-xs text-slate-500">Belum ada request masuk.</div>
              ) : (
                <div className="space-y-3">
                  {requests.map((r, index) => (
                    <div key={r.id} className="bg-white rounded-lg p-3 shadow-sm flex items-start gap-3">
                      <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100 flex-shrink-0">
                        <img src={r.item?.images?.[0] || 'https://via.placeholder.com/80'} alt={r.item?.title || 'Item'} className="h-full w-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-900 text-sm truncate">{r.item?.title || '-'}</div>
                            <div className="text-xs text-slate-500">{r.item?.category?.name || 'Kategori'}</div>
                          </div>
                          <div className="text-xs text-slate-400">{r.created_at ? new Date(r.created_at).toLocaleDateString('id-ID') : '-'}</div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${
                            r.status === 'pending' ? 'bg-amber-100 text-amber-700' : r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                          }`}>{r.status === 'pending' ? 'Pending' : r.status === 'approved' ? 'Disetujui' : 'Ditolak'}</span>

                          <div className="flex gap-2">
                            {r.status === 'pending' ? (
                              <>
                                <button onClick={() => handleApprove(r.id)} disabled={actionLoading} className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-emerald-600 disabled:opacity-50">Approve</button>
                                <button onClick={() => handleReject(r.id)} disabled={actionLoading} className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-rose-600 disabled:opacity-50">Reject</button>
                              </>
                            ) : (
                              <span className="text-slate-500 text-xs">Selesai</span>
                            )}
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
      </section>
    </div>
  );
}
