import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../../_service/auth";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errorMessage, setErrorMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    try {
      const result = await login(form);

      if (!result.user.is_active) {
        setErrorMessage("Akun Anda telah dinonaktifkan oleh admin.");
        return;
      }

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      if (result.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/pilih-peran");
      }
    } catch (error) {
      console.error(error.response || error);
      const message =
        error.response?.data?.message ||
        error.message ||
        "Login gagal. Periksa email/username dan password Anda.";
      setErrorMessage(message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.18),_transparent_36%)]" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                Reloop Auth
              </span>
              <h1 className="text-4xl font-black sm:text-5xl">
                Masuk cepat, donasi lancar.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/90 sm:text-lg">
                Akses dashboard donasi Anda dengan aman. Pantau permintaan, kirimkan barang, dan bantu penerima dengan satu platform.
              </p>
            </div>
            <div className="grid gap-4 rounded-[1.5rem] bg-white/10 p-6 text-sm text-white/80 shadow-inner">
              <div>
                <p className="font-semibold">Keuntungan Login</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-200" />
                    Akses dashboard donor responsif.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-200" />
                    Pantau permintaan dan kirim barang dengan mudah.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-200" />
                    Semua data disimpan aman dan transparan.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="mb-8 space-y-3 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Masuk ke Akun Anda</h2>
            <p className="text-sm text-slate-500">
              Masukkan email atau username dan password untuk melanjutkan.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email atau Username</label>
              <input
                type="text"
                value={form.email}
                onChange={(e) =>
                  setForm({
                    ...form,
                    email: e.target.value,
                  })
                }
                placeholder="contoh@mail.com atau username"
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Password</label>
              <input
                type="password"
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
                placeholder="Masukkan password"
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between text-sm text-slate-600">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="h-4 w-4 rounded border-slate-300 text-orange-500 focus:ring-orange-500" />
                Ingat saya
              </label>
              <button type="button" className="text-orange-500 hover:text-orange-600">
                Lupa Password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full rounded-3xl bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Masuk Sekarang
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Belum punya akun?{' '}
            <Link to="/register" className="font-semibold text-orange-500 hover:text-orange-600">
              Daftar sekarang
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
