import { useEffect, useState } from "react";
import api from "../../api/xios";

export default function CariBarang() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  
  // State untuk Form Request
  const [selectedItem, setSelectedItem] = useState(null);
  const [form, setForm] = useState({
    purpose: "",
    urgency_level: "sedang",
    delivery_address: "",
    recipient_phone: "",
  });
  const [requesting, setRequesting] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const res = await api.get('/items', { params: { search: q } });
      const data = res.data?.data?.items || [];
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Gagal memuat:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [q]);

  const handleRequestSubmit = async (e) => {
    e.preventDefault();
    setRequesting(true);
    try {
      await api.post('/requests', {
        item_id: selectedItem.id,
        shipping_type: selectedItem.shipping_type,
        ...form
      });
      alert("Request berhasil dikirim!");
      setSelectedItem(null); // Tutup modal
    } catch (err) {
      alert(err.response?.data?.message || "Gagal mengirim request");
    } finally {
      setRequesting(false);
    }
  };

  return (
    <div className="space-y-8 p-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-bold">Cari Barang</h2>
          <p className="text-slate-600">Pilih barang yang tersedia.</p>
        </div>
      </div>

      {loading ? <div className="text-center py-10">Memuat...</div> : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((i) => (
            <div key={i.id} className="border rounded-2xl p-4 bg-white shadow-sm flex flex-col">
              <div className="h-40 mb-3 rounded-lg overflow-hidden bg-slate-100">
                <img src={i.images?.[0] || "/placeholder.png"} className="h-full w-full object-cover" />
              </div>
              <h3 className="font-semibold truncate">{i.title}</h3>
              <p className="text-xs text-slate-500 mb-4">{i.category?.name || "Lainnya"}</p>
              <button 
                onClick={() => setSelectedItem(i)} 
                className="mt-auto w-full py-2 border rounded-lg hover:bg-teal-600 hover:text-white transition"
              >
                Request
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Item + Request Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-4xl shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <div className="h-56 rounded-lg overflow-hidden bg-slate-100">
                  <img src={selectedItem.images?.[0] || "/placeholder.png"} alt={selectedItem.title} className="h-full w-full object-cover" />
                </div>
                <div className="mt-4 space-y-2">
                  <h3 className="text-lg font-semibold">{selectedItem.title}</h3>
                  <p className="text-sm text-slate-500">{selectedItem.category?.name || "Lainnya"}</p>
                  <div className="text-sm text-slate-600 mt-2">Ongkir: <span className="font-semibold">{selectedItem.shipping_type === 'free' ? 'Ongkir dibayar oleh pengirim' : selectedItem.shipping_type === 'paid' ? 'Ongkir dibayar oleh penerima' : 'Opsi pengiriman tidak tersedia'}</span></div>
                </div>
                <div className="mt-4 rounded-2xl border border-slate-200 p-4">
                  <h4 className="text-sm font-semibold text-slate-700">Donatur</h4>
                  <p className="mt-2 text-sm text-slate-900">{selectedItem.donor?.name || "-"}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedItem.donor?.email || ""}</p>
                  <p className="text-xs text-slate-500 mt-1">{selectedItem.donor?.phone || ""}</p>
                  <p className="text-xs text-slate-500 mt-2">{selectedItem.donor?.address || "Alamat tidak tersedia"}</p>
                </div>
              </div>

              <div className="md:col-span-2">
                <h2 className="text-2xl font-bold">{selectedItem.title}</h2>
                <p className="text-sm text-slate-500 mt-1">{selectedItem.condition || "Kondisi tidak diketahui"}</p>
                <div className="mt-4 text-sm text-slate-700">
                  <p className="whitespace-pre-line">{selectedItem.description || "Tidak ada deskripsi."}</p>
                </div>

                <hr className="my-4" />

                <form onSubmit={handleRequestSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Tujuan Penggunaan</label>
                    <textarea required className="w-full border rounded-lg p-2" value={form.purpose} onChange={(e) => setForm({...form, purpose: e.target.value})} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">Alamat Pengiriman</label>
                      <input required className="w-full border rounded-lg p-2" value={form.delivery_address} onChange={(e) => setForm({...form, delivery_address: e.target.value})} />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">No. HP</label>
                      <input required className="w-full border rounded-lg p-2" value={form.recipient_phone} onChange={(e) => setForm({...form, recipient_phone: e.target.value})} />
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button type="button" onClick={() => setSelectedItem(null)} className="flex-1 py-2 border rounded-lg">Batal</button>
                    <button type="submit" disabled={requesting} className="flex-1 py-2 bg-teal-600 text-white rounded-lg">
                      {requesting ? "Mengirim..." : "Kirim Request"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}