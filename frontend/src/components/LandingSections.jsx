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
    <main className="space-y-16 sm:space-y-20 md:space-y-24 px-4 py-12 sm:py-16 md:py-20 mx-auto max-w-7xl sm:px-6 md:px-8">
      <section id="fitur" className="grid gap-8 sm:gap-10 md:gap-12 lg:grid-cols-2 lg:items-center">
        <div className="space-y-4 sm:space-y-6">
          <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">
            Tentang Reloop
          </p>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight lg:leading-tight">
            Mengubah barang layak pakai menjadi bantuan nyata untuk keluarga dan komunitas.
          </h2>
          <p className="max-w-2xl text-sm sm:text-base leading-7 sm:leading-8 text-slate-600">
            Reloop adalah platform donasi dan permintaan bantuan yang menghubungkan donatur, penerima, dan relawan dalam satu alur transparan.
            Kami mempermudah proses pengajuan kebutuhan, penyaluran barang, dan pelaporan agar setiap bantuan sampai ke tujuan dengan aman.
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Misi Kami</h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
                Memastikan barang bekas berguna mendapat manfaat dan semua orang bisa menerima bantuan tanpa ribet.
              </p>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-slate-900">Cara Kerja</h3>
              <p className="mt-2 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">
                Daftar, unggah barang atau kebutuhan, lalu pantau proses validasi dan pengiriman secara real time.
              </p>
            </div>
          </div>
        </div>

        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          {campaigns.map((campaign) => (
            <div key={campaign.title} className="rounded-2xl sm:rounded-3xl border border-slate-200 p-4 sm:p-6 shadow-sm">
              <p className="text-xs sm:text-sm font-medium text-emerald-700">{campaign.title}</p>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">{campaign.description}</p>
              <p className="mt-3 sm:mt-4 text-base sm:text-lg font-semibold text-slate-900">{campaign.amount}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[1.5rem] sm:rounded-[2rem] bg-slate-950 px-6 sm:px-8 md:px-12 py-8 sm:py-12 text-white shadow-2xl">
        <div className="grid gap-8 sm:gap-10 lg:grid-cols-3 lg:items-center">
          <div className="space-y-3 sm:space-y-4">
            <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-emerald-300">Dampak nyata</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold">Angka yang berbicara.</h3>
            <p className="text-sm sm:text-base leading-6 sm:leading-7 text-slate-300">
              Setiap donasi dikawal sampai penerima yang tepat dengan laporan lengkap.
            </p>
          </div>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:col-span-2">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl sm:rounded-3xl bg-white/5 p-4 sm:p-6">
                <p className="text-xs sm:text-sm uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                <p className="mt-3 sm:mt-4 text-2xl sm:text-3xl font-bold text-white">{stat.value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 sm:gap-8 md:gap-10 lg:grid-cols-3">
        {steps.map((step, index) => (
          <div key={step.title} className="rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/70 bg-white p-6 sm:p-8 shadow-sm">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl sm:rounded-3xl bg-emerald-600 text-white">
              <span className="text-base sm:text-lg font-bold">{index + 1}</span>
            </div>
            <h4 className="mt-4 sm:mt-6 text-lg sm:text-xl font-bold text-slate-900">{step.title}</h4>
            <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 sm:leading-7 text-slate-600">{step.description}</p>
          </div>
        ))}
      </section>

      <section className="space-y-6 sm:space-y-8">
        <div className="flex flex-col gap-4 sm:gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Barang tersedia</p>
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Pilihan donasi dan kebutuhan populer.</h3>
          </div>
          <Link
            to="/catalog"
            className="inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-700 whitespace-nowrap"
          >
            Jelajahi Sekarang
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          {loading ? (
            <div className="col-span-full rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/70 bg-white p-6 sm:p-8 text-center text-sm text-slate-500">
              Memuat item...
            </div>
          ) : items.length === 0 ? (
            <div className="col-span-full rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200/70 bg-white p-6 sm:p-8 text-center text-sm text-slate-500">
              Belum ada item yang dapat ditampilkan saat ini.
            </div>
          ) : (
            items.slice(0, 8).map((item) => (
              <div key={item.id} className="overflow-hidden rounded-[1.5rem] sm:rounded-[2rem] border border-slate-200 bg-white shadow-sm hover:shadow-md transition">
                <img
                  className="h-40 sm:h-44 md:h-48 w-full object-cover"
                  src={item.images?.[0] || "https://images.unsplash.com/photo-1599532816932-9efa22f2c0eb?auto=format&fit=crop&w=900&q=80"}
                  alt={item.name || "Item donasi"}
                />
                <div className="p-4 sm:p-5">
                  <p className="text-xs uppercase tracking-[0.3em] text-emerald-700">{item.category?.name || "Barang"}</p>
                  <h4 className="mt-2 sm:mt-3 text-base sm:text-lg font-semibold text-slate-900">{item.name}</h4>
                  <p className="mt-1.5 sm:mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-slate-600 line-clamp-3">{item.description || "Deskripsi singkat tentang barang ini."}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      <section className="rounded-[1.5rem] sm:rounded-[2rem] border border-emerald-600/20 bg-emerald-50 px-6 sm:px-8 md:px-12 py-8 sm:py-12 text-slate-900 shadow-lg">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1.5fr_1fr] lg:items-center">
          <div>
            <p className="text-xs sm:text-sm font-semibold uppercase tracking-[0.3em] text-emerald-700">Siap ikut berkontribusi?</p>
            <h3 className="mt-3 text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">Satu klik untuk mulai bantu dan berbagi.</h3>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-full bg-emerald-700 px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold text-white transition hover:bg-emerald-800"
            >
              Mulai Sekarang
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
