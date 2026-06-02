export const statusOptions = [
  { value: "", label: "Semua Status" },
  { value: "available", label: "Tersedia" },
  { value: "reserved", label: "Sedang Diminta" },
  { value: "donated", label: "Sudah Disalurkan" },
];

export const conditionOptions = [
  { value: "", label: "Pilih Kondisi Barang" },
  { value: "baru", label: "Baru" },
  { value: "seperti baru", label: "Seperti Baru" },
  { value: "layak pakai", label: "Layak Pakai" },
];

export const statusLabel = (status) => {
  const map = {
    available: {
      label: "Tersedia",
      className: "bg-emerald-100 text-emerald-700",
    },
    reserved: {
      label: "Sedang Diminta",
      className: "bg-amber-100 text-amber-800",
    },
    donated: {
      label: "Sudah Disalurkan",
      className: "bg-sky-100 text-sky-700",
    },
  };

  return (
    map[status] || {
      label: "Tidak Diketahui",
      className: "bg-slate-100 text-slate-700",
    }
  );
};