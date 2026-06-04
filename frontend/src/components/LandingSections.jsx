import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getPublicItems } from "../_service/item";

export default function LandingSections() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadItems = async () => {
      try {
        const data = await getPublicItems({ per_page: 8 });
        setItems(data.items || []);
      } catch (error) {
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    loadItems();
  }, []);

  const campaigns = [
    {
      title: "Kebutuhan Sekolah",
      description: "Bantu anak-anak memulai tahun ajaran dengan perlengkapan layak.",
      amount: "Rp 12.500.000",
    },
    {
      title: "Bantuan Pangan",
      description: "Distribusi paket bahan pokok untuk keluarga terdampak.",
      amount: "Rp 8.200.000",
    },
    {
      title: "Perlengkapan Kesehatan",
      description: "Sumbangkan obat dan alat kesehatan untuk yang membutuhkan.",
      amount: "Rp 5.875.000",
    },
  ];

  const steps = [
    {
      title: "Daftar Akun",
      description: "Buat akun pengajuan atau donasi dalam beberapa menit.",
    },
    {
      title: "Tambahkan Barang",
      description: "Isi detail barang atau kebutuhan yang ingin didonasikan.",
    },
    {
      title: "Tunggu Verifikasi",
      description: "Tim kami memproses dan menyalurkan donasi dengan cepat.",
    },
  ];

  const stats = [
    { label: "Donasi Tersalurkan", value: "99%" },
    { label: "Pengguna Terdaftar", value: "10.500+" },
    { label: "Paket Disalurkan", value: "18.000+" },
  ];

  return (
    <main className="space-y-24 px-4 py-16 mx-auto max-w-screen-xl lg:px-8">
      <section className="grid gap-8 lg:grid-cols-2 lg:items-center">
        <div className="space-y-6">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Reloop untuk semua
          </p>
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Donasi barang tak terpakai, bantu keluarga dalam kebutuhan sehari-hari.
          </h2>
          <p className="max-w-2xl text-base leading-8 text-slate-600">
            Reloop memudahkan workflow donasi dan permintaan bantuan. Mulai dari validasi, pengiriman, hingga pendistribusian secara transparan.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
            >
              Mulai Donasi
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-emerald-600 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Ajukan Bantuan
            </Link>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {campaigns.map((campaign) => (
            <div key={campaign.title} className="rounded-3xl border border-slate-200 p-6 shadow-sm">
              <p className="text-sm font-medium text-emerald-700">{campaign.title}</p>
              <p className="mt-3 text-sm leading-7 text-slate-600">{campaign.description}</p>
              <p className="mt-4 text-lg font-semibold text-slate-900">{campaign.amount}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[2rem] bg-slate-950 px-8 py-12 text-white shadow-2xl sm:px-12">
        <div className="grid gap-10 lg:grid-cols-3 lg:items-center">
          <div className="space-y-4">
            <p className="text-sm uppercase tracking-[0.3em] text-emerald-300">Dampak nyata</p>
            <h3 className="text-3xl font-bold sm:text-4xl">Angka yang berbicara.</h3>
            <p className="text-base leading-7 text-slate-300">
              Setiap donasi dikawal sampai penerima yang tepat dengan laporan lengkap.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:col-span-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-3xl bg-white/5 p-6">
                <p className="text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-4 text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-10 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-[2rem] border border-slate-200/70 bg-white p-8 shadow-sm">
            <div className="flex h-12 w-12 items-center justify-center rounded-3xl bg-emerald-600 text-white">
              <span className="text-base font-bold">{index + 1}</span>
            </div>
            <h4 className="mt-6 text-xl font-bold text-slate-900">{step.title}</h4>
            <p className="mt-3 text-sm leading-7 text-slate-600">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Barang tersedia</p>
            <h3 className="text-3xl font-bold tracking-tight sm:text-4xl">Pilihan donasi dan kebutuhan populer.</h3>
          </div>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Jelajahi Sekarang
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <div className="col-span-full rounded-[2rem] border border-slate-200/70 bg-white p-8 text-center text-slate-500">
              Memuat item...
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full rounded-[2rem] border border-slate-200/70 bg-white p-8 text-center text-slate-500">
              Belum ada item yang dapat ditampilkan saat ini.
            </div>
          ) : (
            items.slice(0, 8).map((item) => (
              <div key={item.id} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <img
                  className="h-44 w-full object-cover"
                  src={item.images?.[0] || "https://images.unsplash.com/photo-1599532816932-9efa22f2c0eb?auto=format&fit=crop&w=900&q=80"}
                  alt={item.name || "Item donasi"}
                />
                <div className="p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">{item.category?.name || "Barang"}</p>
                  <h4 className="mt-3 text-lg font-semibold text-slate-900">{item.name}</h4>
                  <p className="mt-2 text-sm leading-6 text-slate-600 line-clamp-3">{item.description || "Deskripsi singkat tentang barang ini."}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-[2rem] border border-emerald-600/20 bg-emerald-50 px-8 py-12 text-slate-900 shadow-lg">
        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Siap ikut berkontribusi?</p>
            <h3 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">Satu klik untuk mulai bantu dan berbagi.</h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-6 py-3 text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Daftar Sekarang
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center justify-center rounded-full border border-emerald-700 bg-white px-6 py-3 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-50"
            >
              Masuk
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
