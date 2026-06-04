import { useEffect, useState } from "react";
import api from "../../api/xios";

export default function RiwayatDonasi(){
  const [items, setItems] = useState([]);

  const load = async ()=>{
    try{
      const res = await api.get('/items');
      const data = Array.isArray(res.data?.data) ? res.data.data : Array.isArray(res.data) ? res.data : [];
      setItems(data);
    }catch(err){
      console.error(err);
      setItems([]);
    }
  }

  useEffect(()=>{ load(); },[]);

  return (
    <div>
      <h2 className="text-xl font-semibold">Riwayat Donasi</h2>
      <div className="mt-4 bg-white rounded-lg p-4 shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-slate-600">
                <th className="py-3">Barang</th>
                <th>Penerima</th>
                <th>Tanggal Donasi</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {(items || []).map(i => (
                <tr key={i.id} className="border-t">
                  <td className="py-3">{i.title}</td>
                  <td>{i.receiver_name || '-'}</td>
                  <td>{i.created_at ? new Date(i.created_at).toLocaleDateString() : '-'}</td>
                  <td><span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs">{i.status || 'Selesai'}</span></td>
                  <td><button className="px-3 py-1 border rounded">Lihat Detail</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
