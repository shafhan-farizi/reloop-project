import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto flex max-w-screen-2xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-3 text-2xl font-bold text-slate-900">
          <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-orange-500 text-white">R</div>
          <span>Reloop</span>
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link to="/" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Beranda
          </Link>
          <Link to="/register" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Daftar
          </Link>
          <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-slate-900">
            Masuk
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden rounded-full border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-900 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 lg:inline-flex"
          >
            Masuk
          </Link>
          <Link
            to="/register"
            className="inline-flex rounded-full bg-orange-500 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:bg-orange-600"
          >
            Bergabung
          </Link>
        </div>
      </nav>
    </header>
  );
}
