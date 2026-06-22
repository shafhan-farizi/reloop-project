import { Link } from "react-router-dom";

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-emerald-700 text-white">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.18),_transparent_35%)]" />
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
      <div className="absolute left-0 top-1/2 h-96 w-96 -translate-y-1/2 rounded-full bg-white/5 blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 md:px-8 md:py-20 lg:px-8 lg:py-28">
        <div className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="space-y-6 sm:space-y-8">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 sm:px-4 sm:py-2 text-xs uppercase tracking-[0.3em] text-white/90">
              <span className="inline-flex h-2.5 w-2.5 rounded-full bg-white" />
              Platform Donasi Online Amanah
            </span>
            <h1 className="max-w-3xl text-3xl font-extrabold leading-tight tracking-tight sm:text-4xl md:text-5xl lg:text-6xl">
              Ubah barang tak terpakai menjadi berkah untuk keluarga dan lingkungan.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-white/85 sm:text-lg sm:leading-8 md:text-xl">
              Reloop membantu menghubungkan donatur dan penerima dalam satu platform yang mudah digunakan, transparan, dan cepat.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <a
                href="#fitur"
                className="inline-flex items-center justify-center rounded-full border border-white/40 bg-white/10 px-6 py-2.5 sm:px-7 sm:py-3 text-sm font-semibold text-white transition hover:bg-white/20"
              >
                Pelajari Selengkapnya
              </a>
            </div>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">Total Donasi</p>
                <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold">19.000+</p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">Donasi Tersalurkan</p>
                <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold">99%</p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">Keluarga Terbantu</p>
                <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold">25.000+</p>
              </div>
              <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-4 sm:p-5">
                <p className="text-xs uppercase tracking-[0.25em] text-white/70">Amanah</p>
                <p className="mt-2 sm:mt-3 text-xl sm:text-2xl font-bold">Terpercaya</p>
              </div>
            </div>
          </div>

          <div className="relative mt-8 lg:mt-0">
            <div className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-white/15 bg-white/10 p-4 sm:p-5 shadow-2xl backdrop-blur-xl">
              <img
                className="h-56 sm:h-72 md:h-80 lg:h-96 w-full rounded-[1rem] sm:rounded-[1.5rem] object-cover"
                src="https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=900&q=80"
                alt="Donasi barang bekas"
              />
              <div className="mt-4 sm:mt-6 grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
                <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-3 sm:p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-100/80">Jadikan</p>
                  <p className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold">Barangmu Berguna</p>
                </div>
                <div className="rounded-2xl sm:rounded-3xl bg-white/10 p-3 sm:p-4">
                  <p className="text-xs uppercase tracking-[0.25em] text-slate-100/80">Proses</p>
                  <p className="mt-1 sm:mt-2 text-lg sm:text-xl font-bold">Cepat & Mudah</p>
                </div>
              </div>
            </div>
            <div className="pointer-events-none absolute -bottom-10 left-8 hidden h-24 w-24 rounded-full bg-white/10 blur-3xl lg:block" />
          </div>
        </div>
      </div>
    </section>
  );
}
