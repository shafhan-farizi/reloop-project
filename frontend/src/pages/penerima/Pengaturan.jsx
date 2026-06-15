import { useEffect, useState } from "react";
import { changePassword } from "../../_service/auth";

export default function PengaturanPenerima() {
  const [form, setForm] = useState({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true,
  });
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [theme]);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");
    setMessage("");

    try {
      await changePassword(form);
      setMessage("Password berhasil diperbarui. Silakan login kembali jika diperlukan.");
      setForm({ current_password: "", password: "", password_confirmation: "" });
    } catch (err) {
      setError(err?.response?.data?.message || "Gagal mengubah password.");
    } finally {
      setSaving(false);
    }
  };

  const toggleNotification = (name) => {
    setNotifications((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#f8fafc] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Pengaturan Akun</h1>
            <p className="mt-2 text-slate-500">Atur keamanan, notifikasi, dan preferensi tampilan akun Anda.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Keamanan Akun</h2>
              <p className="text-sm text-slate-500">Ubah password untuk menjaga keamanan akun Anda.</p>
            </div>

            <form onSubmit={handlePasswordSubmit} className="mt-6 space-y-4">
              {error ? <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div> : null}
              {message ? <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div> : null}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Password Saat Ini</label>
                <input
                  type="password"
                  value={form.current_password}
                  onChange={(e) => setForm((prev) => ({ ...prev, current_password: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Password Baru</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Konfirmasi Password</label>
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm((prev) => ({ ...prev, password_confirmation: e.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={saving}
                className="w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-medium text-white hover:bg-teal-700 disabled:opacity-50"
              >
                {saving ? "Mengubah..." : "Ubah Password"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Notifikasi</h2>
              <p className="text-sm text-slate-500">Kelola preferensi notifikasi Anda.</p>
            </div>

            <div className="mt-6 space-y-4">
              {["email", "sms", "app"].map((type) => (
                <label key={type} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={notifications[type]}
                    onChange={() => toggleNotification(type)}
                    className="h-4 w-4 rounded border-slate-300 text-teal-600 focus:ring-teal-500"
                  />
                  <span className="text-sm capitalize text-slate-900">
                    Notifikasi {type === "sms" ? "SMS" : type === "app" ? "Aplikasi" : "Email"}
                  </span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm h-fit">
          <div className="flex flex-col gap-2">
            <h2 className="text-xl font-semibold text-slate-900">Tampilan</h2>
            <p className="text-sm text-slate-500">Atur preferensi tema tampilan.</p>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-900">Mode Gelap</span>
              <button
                onClick={toggleTheme}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  theme === "dark" ? "bg-teal-600" : "bg-slate-300"
                }`}
              >
                <span
                  className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    theme === "dark" ? "translate-x-6" : "translate-x-1"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-6 rounded-2xl bg-slate-50 p-4">
            <p className="text-xs text-slate-600">
              <strong>Tema saat ini:</strong> {theme === "dark" ? "Gelap" : "Terang"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
