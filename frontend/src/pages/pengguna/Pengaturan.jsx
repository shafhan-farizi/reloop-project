import { useEffect, useState } from "react";
import { changePassword } from "../../_service/auth";

export default function Pengaturan() {
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
                <label className="mb-2 block text-sm font-medium text-slate-600">Konfirmasi Password Baru</label>
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
                className="rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Menyimpan..." : "Ubah Password"}
              </button>
            </form>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Preferensi Notifikasi</h2>
              <p className="text-sm text-slate-500">Pilih notifikasi apa saja yang ingin Anda terima.</p>
            </div>

            <div className="mt-6 space-y-4">
              {Object.entries(notifications).map(([key, value]) => (
                <button
                  type="button"
                  key={key}
                  onClick={() => toggleNotification(key)}
                  className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4 text-left hover:bg-slate-100"
                >
                  <div>
                    <h3 className="font-semibold text-slate-900 capitalize">{key === "app" ? "Aplikasi" : key === "email" ? "Email" : "SMS"}</h3>
                    <p className="text-sm text-slate-500">{key === "app" ? "Notifikasi di aplikasi." : key === "email" ? "Notifikasi via email." : "Notifikasi via SMS."}</p>
                  </div>
                  <span className={`inline-flex h-8 w-16 items-center justify-center rounded-full text-sm font-semibold ${value ? "bg-emerald-500 text-white" : "bg-slate-200 text-slate-600"}`}>
                    {value ? "ON" : "OFF"}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="space-y-6">
          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Preferensi Tampilan</h2>
              <p className="text-sm text-slate-500">Atur mode tampilan sesuai kenyamanan Anda.</p>
            </div>

            <div className="mt-6 space-y-4">
              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm text-slate-500">Mode Tema</p>
                    <p className="mt-2 text-lg font-semibold text-slate-900">{theme === "light" ? "Terang" : "Gelap"}</p>
                  </div>
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-2xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
                  >
                    Ubah ke {theme === "light" ? "Gelap" : "Terang"}
                  </button>
                </div>
              </div>

              <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                <p className="text-sm text-slate-500">Reset Setelan</p>
                <p className="mt-2 text-sm text-slate-700">Perubahan tampilan dan preferensi notifikasi hanya disimpan sementara di browser demo ini.</p>
              </div>
            </div>
          </section>

          <section className="rounded-3xl bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2">
              <h2 className="text-xl font-semibold text-slate-900">Informasi Tambahan</h2>
              <p className="text-sm text-slate-500">Halaman ini bisa dikembangkan dengan lebih banyak pengaturan khusus pengguna.</p>
            </div>

            <ul className="mt-6 space-y-3 text-sm text-slate-600">
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Ubah password dan keamanan akun.</li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Kelola preferensi notifikasi.</li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Atur tampilan aplikasi.</li>
              <li className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">Nantinya bisa ditambah fitur hapus akun atau ubah bahasa.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
}
