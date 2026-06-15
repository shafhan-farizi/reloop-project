import { useEffect, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import {
  getUserNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "../../_service/notif";

const STATUS_OPTIONS = [
  { value: "", label: "Semua" },
  { value: "unread", label: "Belum Dibaca" },
  { value: "read", label: "Dibaca" },
];

const mapStatusLabel = (isRead) => {
  if (isRead)
    return { label: "Dibaca", className: "bg-emerald-100 text-emerald-700" };
  return { label: "Belum Dibaca", className: "bg-amber-100 text-amber-800" };
};

export default function NotificationPenerima() {
  const [notifications, setNotifications] = useState([]);
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [meta, setMeta] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 15,
    total: 0,
    unread_count: 0,
  });

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

      const response = await getUserNotifications(params);
      const data = response.data?.data;
      setNotifications(data?.notifications || []);
      setMeta((prev) => ({
        ...prev,
        current_page: data?.meta?.current_page ?? prev.current_page,
        last_page: data?.meta?.last_page ?? prev.last_page,
        total: data?.meta?.total ?? prev.total,
        unread_count: data?.meta?.unread_count ?? prev.unread_count,
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

  const handleMarkAllRead = async () => {
    try {
      await markAllNotificationsAsRead();
      loadNotifications(meta.current_page);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menandai semua notifikasi sebagai dibaca.");
    }
  };

  const handleMarkRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      loadNotifications(meta.current_page);
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal menandai notifikasi sebagai dibaca.");
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#f8fafc] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Notifikasi</h1>
            <p className="mt-2 text-slate-500">
              Lihat semua notifikasi yang dikirim admin ke akun Anda.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleMarkAllRead}
              disabled={!notifications.length || loading}
              className="rounded-2xl bg-teal-600 px-4 py-2 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
            >
              Tandai Semua Dibaca
            </button>
          </div>
        </div>
      </div>

      {error && (
        <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}

      <div className="space-y-3">
        {loading ? (
          <div className="rounded-3xl bg-white p-8 text-center">
            <p className="text-slate-500">Memuat notifikasi...</p>
          </div>
        ) : notifications.length > 0 ? (
          notifications.map((notif) => {
            const status = mapStatusLabel(notif.is_read);
            return (
              <div
                key={notif.id}
                className="rounded-3xl bg-white p-4 shadow-sm hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-900">{notif.title}</h3>
                    <p className="mt-1 text-sm text-slate-600">{notif.message}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <span className={`rounded-full px-3 py-1 text-xs font-medium ${status.className}`}>
                        {status.label}
                      </span>
                      <span className="text-xs text-slate-500">
                        {new Date(notif.created_at).toLocaleDateString("id-ID")}
                      </span>
                    </div>
                  </div>
                  {!notif.is_read && (
                    <button
                      onClick={() => handleMarkRead(notif.id)}
                      className="ml-auto text-sm text-teal-600 hover:text-teal-700 font-medium"
                    >
                      Tandai Dibaca
                    </button>
                  )}
                </div>
              </div>
            );
          })
        ) : (
          <div className="rounded-3xl bg-white p-8 text-center">
            <p className="text-slate-500">Tidak ada notifikasi</p>
          </div>
        )}
      </div>

      {meta.last_page > 1 && (
        <div className="flex items-center justify-between rounded-3xl bg-white p-4 shadow-sm">
          <span className="text-sm text-slate-600">
            Halaman {meta.current_page} dari {meta.last_page}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => loadNotifications(meta.current_page - 1)}
              disabled={meta.current_page === 1}
              className="rounded-2xl border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-50"
            >
              <FiChevronLeft size={18} />
            </button>
            <button
              onClick={() => loadNotifications(meta.current_page + 1)}
              disabled={meta.current_page === meta.last_page}
              className="rounded-2xl border border-slate-200 p-2 hover:bg-slate-100 disabled:opacity-50"
            >
              <FiChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
