import { Link, useNavigate } from "react-router-dom";
import { register } from "../../_service/auth";
import { useState } from "react";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    username: "",
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    password: "",
    password_confirmation: "",
  });
  const [errors, setErrors] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setErrors({});

    try {
      await register(form);
      navigate("/login");
    } catch (error) {
      console.log(error);
      if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrorMessage(error.response?.data?.message || "Pendaftaran gagal. Periksa kembali data Anda.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.1fr_0.9fr] lg:px-8">
        <section className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-600 to-rose-600 p-10 text-white shadow-2xl">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.16),_transparent_38%)]" />
          <div className="relative space-y-8">
            <div className="space-y-4">
              <span className="inline-flex rounded-full bg-white/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/90">
                Reloop Register
              </span>
              <h1 className="text-4xl font-black sm:text-5xl">
                Buat akun donasimu dengan cepat.
              </h1>
              <p className="max-w-xl text-base leading-7 text-white/90 sm:text-lg">
                Isi data dengan lengkap untuk mulai donasi barang layak pakai dan membantu keluarga yang membutuhkan.
              </p>
            </div>
            <div className="grid gap-4 rounded-[1.5rem] bg-white/10 p-6 text-sm text-white/85 shadow-inner">
              <div>
                <p className="font-semibold">Dengan registrasi ini kamu bisa:</p>
                <ul className="mt-4 space-y-3">
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-200" />
                    Mengelola donasi barang secara profesional.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-200" />
                    Melacak permintaan bantuan dan pengiriman.
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="mt-1 inline-flex h-2.5 w-2.5 rounded-full bg-emerald-200" />
                    Membangun profil terpercaya untuk donasi.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-10 shadow-xl">
          <div className="mb-8 space-y-3 text-center">
            <h2 className="text-3xl font-bold text-slate-900">Daftar Akun Baru</h2>
            <p className="text-sm text-slate-500">
              Lengkapi data pribadi dan mulai membantu lewat platform Reloop.
            </p>
          </div>

          {errorMessage && (
            <div className="mb-6 rounded-3xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Masukkan nama lengkap"
                  required
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {errors.name && <p className="text-sm text-red-600">{errors.name[0]}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  placeholder="Masukkan username"
                  required
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {form.username && !/^[a-z0-9_]+$/.test(form.username) && (
                  <p className="text-sm text-red-600">Username hanya boleh huruf kecil, angka, dan underscore.</p>
                )}
                {errors.username && <p className="text-sm text-red-600">{errors.username[0]}</p>}
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="contoh@mail.com"
                required
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
              {errors.email && <p className="text-sm text-red-600">{errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">No. Telepon</label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                placeholder="Opsional"
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-slate-700">Alamat</label>
              <input
                type="text"
                value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                placeholder="Opsional"
                className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Password</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Minimal 8 karakter"
                  required
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
                {errors.password && <p className="text-sm text-red-600">{errors.password[0]}</p>}
              </div>
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Konfirmasi Password</label>
                <input
                  type="password"
                  value={form.password_confirmation}
                  onChange={(e) => setForm({ ...form, password_confirmation: e.target.value })}
                  placeholder="Ulangi password"
                  required
                  className="w-full rounded-3xl border border-slate-300 bg-slate-50 px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-3xl bg-orange-500 px-6 py-3 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
            >
              Buat Akun
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-500">
            Sudah punya akun?{' '}
            <Link to="/login" className="font-semibold text-orange-500 hover:text-orange-600">
              Masuk sekarang
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
