import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
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
  const [searchParams] = useSearchParams();
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

  const searchQuery = searchParams.get("search")?.trim().toLowerCase() || "";

  const filteredNotifications = useMemo(() => {
    if (!searchQuery) return notifications;
    return notifications.filter((notif) =>
      (notif.title || "").toLowerCase().includes(searchQuery) ||
      (notif.message || "").toLowerCase().includes(searchQuery)
    );
  }, [notifications, searchQuery]);

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
              onClick={() => loadNotifications(1)}
              disabled={loading}
              className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-900 hover:bg-slate-50 disabled:opacity-50"
            >
              Refresh
            </button>
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

      <div className="rounded-3xl bg-white p-6 shadow-sm">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Daftar Notifikasi</h2>
            <p className="mt-1 text-sm text-slate-500">
              Total {meta.total} notifikasi, {meta.unread_count} belum dibaca.
            </p>
          </div>
        </div>

        {error ? (
          <div className="mb-6 rounded-2xl bg-red-50 p-4 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <div>
          <div className="hidden sm:block overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="px-4 py-4 font-semibold">Judul</th>
                  <th className="px-4 py-4 font-semibold">Pesan</th>
                  <th className="px-4 py-4 font-semibold">Status</th>
                  <th className="px-4 py-4 font-semibold">Tanggal</th>
                  <th className="px-4 py-4 font-semibold">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#d1fae5]">
                {loading ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Memuat notifikasi...
                    </td>
                  </tr>
                ) : filteredNotifications.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-slate-500">
                      Tidak ada notifikasi yang cocok.
                    </td>
                  </tr>
                ) : (
                  filteredNotifications.map((notification) => {
                    const status = mapStatusLabel(notification.is_read);
                    return (
                      <tr key={notification.id} className="hover:bg-[#ecfdf5]">
                        <td className="px-4 py-4 text-[#0f172a] font-semibold">
                          {notification.title}
                        </td>
                        <td className="px-4 py-4 text-[#475569]">
                          {notification.message || "-"}
                        </td>
                        <td className="px-4 py-4">
                          <span
                            className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-[#475569]">
                          {notification.created_at
                            ? new Date(notification.created_at).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              })
                            : "-"}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            disabled={notification.is_read}
                            onClick={() => handleMarkRead(notification.id)}
                            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {notification.is_read ? "Sudah Dibaca" : "Tandai Dibaca"}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="block sm:hidden">
            {loading ? (
              <div className="p-4 text-center text-sm text-slate-500">Memuat notifikasi...</div>
            ) : filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-sm text-slate-500">Tidak ada notifikasi yang cocok.</div>
            ) : (
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const status = mapStatusLabel(notification.is_read);
                  return (
                    <div key={notification.id} className="bg-white rounded-lg p-3 shadow-sm">
                      <div className="flex justify-between">
                        <div className="min-w-0">
                          <div className="font-semibold text-slate-900 text-sm truncate">{notification.title}</div>
                          <div className="text-xs text-slate-500 mt-1 line-clamp-2">{notification.message || '-'}</div>
                        </div>
                        <div className="ml-3 text-xs text-slate-400">{notification.created_at ? new Date(notification.created_at).toLocaleDateString('id-ID') : '-'}</div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}>{status.label}</span>
                        <button
                          type="button"
                          disabled={notification.is_read}
                          onClick={() => handleMarkRead(notification.id)}
                          className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-100 disabled:opacity-50"
                        >
                          {notification.is_read ? 'Sudah Dibaca' : 'Tandai Dibaca'}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
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
