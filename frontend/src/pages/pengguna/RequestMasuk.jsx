import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getIncomingRequests, approveRequest, rejectRequest } from "../../_service/request";

const BASE_URL = "http://localhost:8000";

export default function RequestMasuk() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

  const filteredRequests = useMemo(() => {
    if (!searchQuery) return requests;
    return requests.filter((request) =>
      (request.item?.title || "").toLowerCase().includes(searchQuery)
    );
  }, [requests, searchQuery]);

  const load = async () => {
    setLoading(true);
    try {
      const res = await getIncomingRequests({ page: 1 });
      setRequests(res.requests || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    setActionLoading(true);
    try {
      await approveRequest(id);
      navigate(`/pengguna/pengiriman?request_id=${id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menyetujui request.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Yakin ingin menolak request ini?")) return;
    setActionLoading(true);
    try {
      await rejectRequest(id, "Request ditolak oleh donatur.");
      await load();
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menolak request.");
    } finally {
      setActionLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  // Fungsi pembantu untuk menentukan URL gambar
  const getImageUrl = (item) => {
    const firstImage = Array.isArray(item?.images) ? item.images[0] : null;
    if (!firstImage) return "/placeholder.png";

    const resolvePath = (path) => {
      if (typeof path !== 'string') return "/placeholder.png";
      if (path.startsWith("http://") || path.startsWith("https://")) return path;
      if (path.startsWith("/")) return `${BASE_URL}${path}`;
      return `${BASE_URL}/storage/${path}`;
    };

    if (typeof firstImage === 'string') {
      return resolvePath(firstImage);
    }

    if (typeof firstImage === 'object' && firstImage !== null) {
      return resolvePath(firstImage.url || firstImage.path || firstImage.file_path);
    }

    return "/placeholder.png";
  };

  return (
    <div className="space-y-6 sm:space-y-8 md:space-y-8">
      <section className="rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 shadow-sm">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900">Request Masuk</h1>
        <p className="mt-2 text-xs sm:text-sm text-slate-600">Kelola permintaan donasi yang masuk dari pengguna lain.</p>
      </section>

      <section className="rounded-xl sm:rounded-2xl md:rounded-[2rem] bg-white p-4 sm:p-6 md:p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div>
          {/* Desktop / tablet: table view */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full text-left text-xs sm:text-sm text-slate-600">
            <thead className="border-b border-slate-200 uppercase text-slate-500">
              <tr>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold tracking-wider">Barang</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold tracking-wider hidden sm:table-cell">Requester</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold tracking-wider hidden md:table-cell">Tanggal</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold tracking-wider">Status</th>
                <th className="px-3 sm:px-4 md:px-6 py-3 sm:py-4 font-semibold tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={5} className="p-6 sm:p-10 text-center text-xs sm:text-sm">Memuat...</td></tr>
              ) : filteredRequests.length === 0 ? (
                <tr><td colSpan={5} className="p-6 sm:p-10 text-center text-xs sm:text-sm">Tidak ada request yang cocok.</td></tr>
              ) : (
                filteredRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 flex items-center gap-2 sm:gap-4">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-lg sm:rounded-2xl bg-slate-100 flex-shrink-0">
                        <img 
                          src={getImageUrl(r.item)}
                          className="h-full w-full object-cover" 
                          alt={r.item?.title || "item"}
                          onError={(e) => { 
                            e.target.onerror = null; 
                            e.target.src = "/placeholder.png"; 
                          }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900 text-xs sm:text-sm truncate">{r.item?.title}</span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 hidden sm:table-cell text-xs sm:text-sm">{r.requester?.name || "-"}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5 hidden md:table-cell text-xs">{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5">
                      <span className={`px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs font-semibold inline-block ${
                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        r.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="px-3 sm:px-4 md:px-6 py-3 sm:py-5">
                      {r.status === 'pending' ? (
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2">
                          <button onClick={() => handleApprove(r.id)} disabled={actionLoading} className="bg-emerald-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-emerald-600 disabled:opacity-50">Approve</button>
                          <button onClick={() => handleReject(r.id)} disabled={actionLoading} className="bg-rose-500 text-white px-2.5 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-semibold hover:bg-rose-600 disabled:opacity-50">Reject</button>
                        </div>
                      ) : (
                        <span className="text-slate-400 font-medium text-xs sm:text-sm">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
            </table>
          </div>

          {/* Mobile: card list view */}
          <div className="block sm:hidden">
            {loading ? (
              <div className="p-4 text-center text-xs">Memuat...</div>
            ) : filteredRequests.length === 0 ? (
              <div className="p-4 text-center text-xs">Tidak ada request yang cocok.</div>
            ) : (
              <div className="space-y-3">
                {filteredRequests.map((r) => (
                  <div key={r.id} className="bg-white rounded-lg p-3 shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="h-12 w-12 rounded-md overflow-hidden bg-slate-100 flex-shrink-0">
                        <img src={getImageUrl(r.item)} className="h-full w-full object-cover" alt={r.item?.title || 'item'} onError={(e)=>{e.target.onerror=null;e.target.src='/placeholder.png'}} />
                      </div>
                      <div className="flex-1">
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-semibold text-slate-900 text-sm truncate">{r.item?.title}</div>
                            <div className="text-xs text-slate-500 mt-0.5">{r.requester?.name || '-'}</div>
                          </div>
                          <div className="text-xs text-slate-400">{new Date(r.created_at).toLocaleDateString('id-ID')}</div>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <span className={`px-2 py-0.5 rounded-full text-xs font-semibold inline-block ${
                              r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                              r.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                            }`}>
                              {r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                            </span>
                          </div>

                          <div className="flex gap-2">
                            {r.status === 'pending' ? (
                              <>
                                <button onClick={() => handleApprove(r.id)} disabled={actionLoading} className="bg-emerald-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-emerald-600 disabled:opacity-50">Approve</button>
                                <button onClick={() => handleReject(r.id)} disabled={actionLoading} className="bg-rose-500 text-white px-3 py-1 rounded-full text-xs font-semibold hover:bg-rose-600 disabled:opacity-50">Reject</button>
                              </>
                            ) : (
                              <span className="text-slate-400 font-medium text-xs">Selesai</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}