import { useEffect, useState } from "react";
import {
  FiSearch,
  FiTrash2,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  getNotif,
  deleteNotif,
  sendNotif,
  broadcastNotif,
} from "../../_service/notif";

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "read", label: "Terkirim" },
  { value: "unread", label: "Terjadwal" },
];

const mapStatusLabel = (isRead) => {
  if (isRead)
    return { label: "Terkirim", className: "bg-emerald-100 text-emerald-700" };
  return { label: "Terjadwal", className: "bg-amber-100 text-amber-800" };
};

export default function Notification() {
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 20,
    total: 0,
  });
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [target, setTarget] = useState("all");
  const [userId, setUserId] = useState("");
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState(null);
  const [sendSuccess, setSendSuccess] = useState("");

  const loadNotifications = async (page = 1) => {
    setLoading(true);
    setError(null);

    try {
      const params = {
        page,
        per_page: meta.per_page,
      };

      if (search.trim()) params.keyword = search.trim();
      if (statusFilter === "read") params.is_read = 1;
      if (statusFilter === "unread") params.is_read = 0;

      const response = await getNotif(params);
      const data = response.data?.data;
      setNotifications(data?.notifications || []);
      setMeta((prev) => ({
        ...prev,
        current_page: data?.meta?.current_page ?? prev.current_page,
        last_page: data?.meta?.last_page ?? prev.last_page,
        total: data?.meta?.total ?? prev.total,
      }));
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal memuat notifikasi.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = window.setTimeout(() => loadNotifications(), 0);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = () => {
    loadNotifications(1);
  };

  const handleReset = () => {
    setSearch("");
    setStatusFilter("");
    setSendError(null);
    setSendSuccess("");
    loadNotifications(1);
  };

  const handleSend = async () => {
    if (!title.trim() || !message.trim()) {
      alert("Judul dan pesan harus diisi.");
      return;
    }

    if (target === "single" && !userId.trim()) {
      alert("Masukkan User ID untuk notifikasi ini.");
      return;
    }

    setSending(true);
    setSendError(null);
    setSendSuccess("");

    try {
      if (target === "single") {
        await sendNotif({
          user_id: userId.trim(),
          title: title.trim(),
          message: message.trim(),
        });
      } else {
        await broadcastNotif({
          target,
          title: title.trim(),
          message: message.trim(),
        });
      }

      setSendSuccess("Notifikasi berhasil dikirim.");
      setTitle("");
      setMessage("");
      setUserId("");
      setTarget("all");
      loadNotifications(1);
    } catch (err) {
      setSendError(
        err?.response?.data?.message || "Gagal mengirim notifikasi.",
      );
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Hapus notifikasi ini?")) return;

    try {
      await deleteNotif(id);
      setNotifications((prev) => prev.filter((item) => item.id !== id));
      setMeta((prev) => ({ ...prev, total: Math.max(prev.total - 1, 0) }));
    } catch (err) {
      alert(err?.response?.data?.message || "Gagal menghapus notifikasi.");
    }
  };

  const renderRecipient = (user) => {
    if (!user) return "Semua User";
    return user.name || user.email || `User #${user.id}`;
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifikasi</h1>
            <p className="mt-2 text-slate-500">
              Kelola notifikasi user dan cek status terkirim dalam satu halaman.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <FiSearch className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Search"
                className="w-full rounded-full border border-slate-200 bg-slate-50 py-3 pl-11 pr-4 text-sm text-slate-700 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100 md:w-80"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-full border border-slate-200 bg-white py-3 px-4 text-sm text-slate-700 shadow-sm focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleReset}
              className="rounded-full border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Tambah Notifikasi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Kirim notifikasi manual ke user tertentu atau broadcast ke semua
              user.
            </p>
          </div>
          <button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-full bg-orange-500 px-4 py-3 text-sm font-semibold text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {sending ? "Mengirim..." : "Kirim Notifikasi"}
          </button>
        </div>

        {sendError ? (
          <div className="mb-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {sendError}
          </div>
        ) : null}
        {sendSuccess ? (
          <div className="mb-4 rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">
            {sendSuccess}
          </div>
        ) : null}

        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Judul
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                placeholder="Judul notifikasi"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-600">
                Tujuan
              </label>
              <select
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
              >
                <option value="all">Semua User</option>
                <option value="donor">Semua Donatur</option>
                <option value="requester">Semua Requester</option>
                <option value="single">User ID Spesifik</option>
              </select>
            </div>

            {target === "single" ? (
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">
                  User ID
                </label>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
                  placeholder="Masukkan user id"
                />
              </div>
            ) : null}
          </div>

          <div className="space-y-4">
            <label className="mb-2 block text-sm font-medium text-slate-600">
              Pesan
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={7}
              className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 focus:border-orange-400 focus:outline-none focus:ring-2 focus:ring-orange-100"
              placeholder="Tulis pesan notifikasi di sini"
            />
          </div>
        </div>
      </div>

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Daftar Notifikasi
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Total {meta.total} notifikasi.
            </p>
          </div>
          <button
            onClick={() => loadNotifications(meta.current_page)}
            className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-3 text-sm font-semibold text-white hover:bg-slate-800"
          >
            Refresh
          </button>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 py-4 font-semibold">ID</th>
                <th className="px-4 py-4 font-semibold">Judul notifikasi</th>
                <th className="px-4 py-4 font-semibold">Tujuan</th>
                <th className="px-4 py-4 font-semibold">Jenis</th>
                <th className="px-4 py-4 font-semibold">Status</th>
                <th className="px-4 py-4 font-semibold">Tanggal Kirim</th>
                <th className="px-4 py-4 font-semibold">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Memuat notifikasi...
                  </td>
                </tr>
              ) : notifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Tidak ada notifikasi.
                  </td>
                </tr>
              ) : (
                notifications.map((notification) => {
                  const status = mapStatusLabel(notification.is_read);
                  return (
                    <tr key={notification.id} className="hover:bg-slate-50">
                      <td className="px-4 py-4 text-slate-700">
                        {notification.id}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {notification.title}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {renderRecipient(notification.user)}
                      </td>
                      <td className="px-4 py-4 text-slate-700">
                        {notification.type || "In-App"}
                      </td>
                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 py-4 text-slate-500">
                        {notification.created_at
                          ? new Date(
                              notification.created_at,
                            ).toLocaleDateString("id-ID", {
                              day: "2-digit",
                              month: "short",
                              year: "numeric",
                            })
                          : "-"}
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleDelete(notification.id)}
                            className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500 text-white hover:bg-red-600"
                            title="Hapus"
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-500">
            Halaman {meta.current_page} dari {meta.last_page}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.current_page <= 1 || loading}
              onClick={() => loadNotifications(meta.current_page - 1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FiChevronLeft /> Previous
            </button>
            <button
              disabled={meta.current_page >= meta.last_page || loading}
              onClick={() => loadNotifications(meta.current_page + 1)}
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next <FiChevronRight />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
