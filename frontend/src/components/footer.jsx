import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 py-12">
      <div className="mx-auto grid max-w-screen-2xl gap-10 px-4 sm:px-6 lg:grid-cols-[1.3fr_0.7fr] lg:px-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-900">Reloop</h2>
          <p className="max-w-xl text-sm leading-6 text-slate-600">
            Platform donasi yang menghubungkan barang layak pakai dengan keluarga dan organisasi yang membutuhkan.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <Link to="/" className="text-sm text-slate-600 hover:text-slate-900">
            Beranda
          </Link>
          <Link to="/register" className="text-sm text-slate-600 hover:text-slate-900">
            Daftar
          </Link>
          <Link to="/login" className="text-sm text-slate-600 hover:text-slate-900">
            Masuk
          </Link>
        </div>
      </div>
      <div className="mt-10 border-t border-slate-200 pt-6 text-center text-sm text-slate-500">
        Copyright 2026 Reloop. Semua hak cipta dilindungi.
      </div>
    </footer>
  );
}
