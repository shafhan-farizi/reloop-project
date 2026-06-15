import { Link, useNavigate } from "react-router-dom";
import { useEffect } from "react";

export default function RoleSelectionDashboard() {
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!token || !user) {
      navigate("/login");
      return;
    }

    // If user already has a specific dashboard preference or role, they can navigate
    // But we'll show this page to let them choose
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Selamat datang di ReLoop! 👋
          </h1>
          <p className="mt-4 text-lg text-slate-600">
            Pilih peran Anda untuk melanjutkan
          </p>
        </div>

        {/* Choice Cards */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Donasi Card */}
          <Link
            to="/pengguna"
            className="group rounded-3xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-emerald-100/50 p-8 shadow-sm transition hover:shadow-lg"
          >
            <div className="space-y-6">
              <div className="text-6xl">🎁</div>
              <div>
                <h2 className="text-2xl font-bold text-emerald-900">Saya Ingin Berdonasi</h2>
                <p className="mt-2 text-sm text-emerald-800">
                  Bagikan barang yang masih layak pakai untuk membantu sesama yang membutuhkan.
                </p>
              </div>
              <button className="w-full rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition group-hover:bg-emerald-700">
                Mulai Berdonasi
              </button>
            </div>
          </Link>

          {/* Cari Barang Card */}
          <Link
            to="/penerima"
            className="group rounded-3xl border-2 border-blue-300 bg-gradient-to-br from-blue-50 to-blue-100/50 p-8 shadow-sm transition hover:shadow-lg"
          >
            <div className="space-y-6">
              <div className="text-6xl">🔍</div>
              <div>
                <h2 className="text-2xl font-bold text-blue-900">Saya Ingin Mencari Barang</h2>
                <p className="mt-2 text-sm text-blue-800">
                  Temukan dan minta barang yang Anda butuhkan dari donasi yang tersedia.
                </p>
              </div>
              <button className="w-full rounded-full bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition group-hover:bg-blue-700">
                Lihat Barang
              </button>
            </div>
          </Link>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <Link
            to="/"
            className="text-sm text-slate-600 transition hover:text-slate-900"
          >
            ← Kembali ke beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
