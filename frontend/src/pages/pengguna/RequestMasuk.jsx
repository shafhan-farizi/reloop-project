import { useEffect, useState } from "react";
import { getIncomingRequests, approveRequest, rejectRequest } from "../../_service/request";

const BASE_URL = "http://localhost:8000";

export default function RequestMasuk() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

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
      await load();
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

  return (
    <div className="space-y-8">
      <section className="rounded-[2rem] bg-white p-8 shadow-sm">
        <h1 className="text-4xl font-bold text-slate-900">Request Masuk</h1>
        <p className="mt-2 text-slate-600">Kelola permintaan donasi yang masuk dari pengguna lain.</p>
      </section>

      <section className="rounded-[2rem] bg-white p-8 shadow-[0_32px_80px_rgba(15,23,42,0.08)]">
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm text-slate-600">
            <thead className="border-b border-slate-200 uppercase text-slate-500">
              <tr>
                <th className="px-6 py-4 font-semibold tracking-wider">Nama barang</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Requester</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Tanggal</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Status</th>
                <th className="px-6 py-4 font-semibold tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr><td colSpan={5} className="p-10 text-center">Memuat...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center">Belum ada request.</td></tr>
              ) : (
                requests.map((r) => (
                  <tr key={r.id}>
                    <td className="px-6 py-5 flex items-center gap-4">
                      <div className="h-12 w-12 overflow-hidden rounded-2xl bg-slate-100">
                        <img 
                          src={r.item?.images?.[0] ? `${BASE_URL}/storage/${r.item.images[0]}` : "/placeholder.png"} 
                          className="h-full w-full object-cover" 
                          alt="item" 
                          onError={(e) => { e.target.src = "/placeholder.png"; }}
                        />
                      </div>
                      <span className="font-semibold text-slate-900">{r.item?.title}</span>
                    </td>
                    <td className="px-6 py-5">{r.requester?.name || "-"}</td>
                    <td className="px-6 py-5">{new Date(r.created_at).toLocaleDateString("id-ID")}</td>
                    <td className="px-6 py-5">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        r.status === 'approved' ? 'bg-emerald-100 text-emerald-700' : 
                        r.status === 'rejected' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {r.status === 'approved' ? 'Disetujui' : r.status === 'rejected' ? 'Ditolak' : 'Menunggu'}
                      </span>
                    </td>
                    <td className="px-6 py-5 flex gap-2">
                      {r.status === 'pending' ? (
                        <>
                          <button onClick={() => handleApprove(r.id)} disabled={actionLoading} className="bg-emerald-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-emerald-600">Approve</button>
                          <button onClick={() => handleReject(r.id)} disabled={actionLoading} className="bg-rose-500 text-white px-4 py-2 rounded-full font-semibold hover:bg-rose-600">Reject</button>
                        </>
                      ) : (
                        <span className="text-slate-400 font-medium">Selesai</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}