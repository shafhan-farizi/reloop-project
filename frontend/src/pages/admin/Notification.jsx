import { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi";
import {
  getNotif,
  sendNotif,
  broadcastNotif,
} from "../../_service/notif";

const STATUS_OPTIONS = [
  { value: "", label: "Semua Status" },
  { value: "read", label: "Dibaca" },
  { value: "unread", label: "Belum Dibaca" },
];

const mapStatusLabel = (isRead) => {
  if (isRead)
    return { label: "Dibaca", className: "bg-emerald-100 text-emerald-700" };
  return { label: "Belum Dibaca", className: "bg-amber-100 text-amber-800" };
};

export default function Notification() {
  const [searchParams] = useSearchParams();
  const [notifications, setNotifications] = useState([]);
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
  }, [statusFilter]);

  const handleReset = () => {
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

  const renderRecipient = (user) => {
    if (!user) return "Semua User";
    return user.name || user.email || `User #${user.id}`;
  };

  const filteredNotifications = useMemo(() => {
    const query = searchParams.get("search")?.trim().toLowerCase() || "";
    if (!query) return notifications;

    return notifications.filter((item) => {
      const title = item.title?.toLowerCase() || "";
      const message = item.message?.toLowerCase() || "";
      return title.includes(query) || message.includes(query);
    });
  }, [notifications, searchParams]);

  return (
    <div className="space-y-6 p-4 sm:p-6">
      <div className="rounded-xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Tambah Notifikasi
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Kirim notifikasi manual ke user tertentu atau broadcast ke semua
              user.
            </p>
          </div>
          <button
            onClick={handleSend}
            disabled={sending}
            className="inline-flex items-center gap-2 rounded-full bg-[#FB923C] px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#ea7d1f] disabled:opacity-50 whitespace-nowrap"
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
                className="w-full rounded-2xl border border-[#d1fae5] bg-white px-4 py-3 text-sm text-[#0f172a] focus:border-[#FB923C] focus:outline-none focus:ring-2 focus:ring-[#FB923C]/20"
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

      <div className="rounded-xl sm:rounded-3xl bg-white p-4 sm:p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-semibold text-slate-900">
              Daftar Notifikasi
            </h2>
            <p className="mt-1 text-xs sm:text-sm text-slate-500">
              Total {meta.total} notifikasi.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="min-w-[160px] rounded-full border border-slate-200 bg-white py-2 sm:py-3 px-3 sm:px-4 text-xs sm:text-sm text-slate-700 shadow-sm focus:border-[#14B8A6] focus:outline-none focus:ring-2 focus:ring-[#14B8A6]/20"
            >
              {STATUS_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => loadNotifications(meta.current_page)}
              className="inline-flex flex-shrink-0 items-center gap-1 sm:gap-2 rounded-full bg-[#14B8A6] px-3 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm font-semibold text-white hover:bg-[#0f766e] whitespace-nowrap"
            >
              Refresh
            </button>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div className="hidden sm:block overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200 text-left text-xs sm:text-sm">
            <thead className="bg-slate-50 text-slate-600">
              <tr>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">ID</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Judul notifikasi</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Tujuan</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Jenis</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Status</th>
                <th className="px-4 sm:px-6 py-3 sm:py-4 font-semibold">Tanggal Kirim</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#d1fae5]">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 sm:px-6 py-4 text-center text-slate-500 text-xs sm:text-sm"
                  >
                    Memuat notifikasi...
                  </td>
                </tr>
              ) : filteredNotifications.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-4 sm:px-6 py-4 text-center text-slate-500 text-xs sm:text-sm"
                  >
                    Tidak ada notifikasi.
                  </td>
                </tr>
              ) : (
                filteredNotifications.map((notification) => {
                  const status = mapStatusLabel(notification.is_read);
                  return (
                    <tr key={notification.id} className="hover:bg-[#ecfdf5]">
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#0f172a]">
                        {notification.id}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#0f172a] truncate">
                        {notification.title}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#0f172a]">
                        {renderRecipient(notification.user)}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#0f172a]">
                        {notification.type || "In-App"}
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <span
                          className={`inline-flex rounded-full px-2 sm:px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      </td>
                      <td className="px-4 sm:px-6 py-3 sm:py-4 text-[#475569] text-xs sm:text-sm">
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
                      <td className="px-4 sm:px-6 py-3 sm:py-4">
                        <div className="flex items-center gap-2">
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
          </div>

          {/* Mobile list */}
          <div className="block sm:hidden p-3 space-y-3">
            {loading ? (
              <div className="text-center py-6 text-slate-500 text-sm">Memuat notifikasi...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="text-center py-6 text-slate-500 text-sm">Tidak ada notifikasi.</div>
            ) : (
              filteredNotifications.map((notification) => {
                const status = mapStatusLabel(notification.is_read);
                return (
                  <div key={notification.id} className="bg-white border rounded-lg p-3 shadow-sm">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-slate-900 truncate text-sm">{notification.title}</div>
                        <div className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message}</div>
                        <div className="mt-2">
                          <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                        </div>
                      </div>

                      <div className="text-right text-xs text-slate-500 shrink-0 whitespace-nowrap">
                        <div>{notification.created_at ? new Date(notification.created_at).toLocaleDateString('id-ID', {day: '2-digit', month: 'short'}) : '-'}</div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs sm:text-sm text-slate-500">
            Halaman {meta.current_page} dari {meta.last_page}
          </p>
          <div className="flex items-center gap-2">
            <button
              disabled={meta.current_page <= 1 || loading}
              onClick={() => loadNotifications(meta.current_page - 1)}
              className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
            >
              <FiChevronLeft size={16} /> Previous
            </button>
            <button
              disabled={meta.current_page >= meta.last_page || loading}
              onClick={() => loadNotifications(meta.current_page + 1)}
              className="inline-flex items-center gap-1 sm:gap-2 rounded-full border border-slate-200 bg-white px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50 whitespace-nowrap"
            >
              Next <FiChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
