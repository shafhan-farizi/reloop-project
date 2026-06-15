import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../_service/auth";

export default function ProfilePenerima() {
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const loadProfile = async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      const user = response?.data?.user || response?.user || null;
      if (user) {
        setProfile(user);
        setForm({
          name: user.name || "",
          username: user.username || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          bio: user.bio || "",
        });
      }
    } catch (err) {
      console.error("Gagal memuat profil:", err);
      setError(err?.response?.data?.message || "Gagal memuat profil.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage("");
    setError("");

    try {
      const payload = {
        name: form.name,
        username: form.username,
        phone: form.phone,
        address: form.address,
        bio: form.bio,
      };
      await updateProfile(payload);
      setProfile((prev) => ({ ...prev, ...payload }));
      setMessage("Profil berhasil diperbarui.");
      setIsEditing(false);
      loadProfile();
    } catch (err) {
      console.error("Gagal memperbarui profil:", err);
      setError(err?.response?.data?.message || "Gagal memperbarui profil.");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="rounded-3xl bg-[#f8fafc] p-6 shadow-sm">
          <p className="text-slate-500">Memuat profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="rounded-3xl bg-[#f8fafc] p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Profil Saya</h1>
            <p className="mt-2 text-slate-500">Perbarui informasi akun dan detail profil Anda.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Data Profil</h2>
              <p className="mt-2 text-sm text-slate-500">Informasi akun yang dapat dilihat oleh sistem.</p>
            </div>
          </div>

          <div className="mt-6 space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Nama Lengkap</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.name || "-"}</p>
              </div>

              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Username</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.username || "-"}</p>
              </div>

              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.email || "-"}</p>
              </div>

              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Nomor Telepon</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.phone || "-"}</p>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Alamat</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.address || "-"}</p>
            </div>

            <div className="rounded-3xl border border-slate-200 p-5">
              <p className="text-sm text-slate-500">Bio</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.bio || "-"}</p>
            </div>
          </div>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-6 rounded-2xl bg-teal-600 px-6 py-2 font-medium text-white hover:bg-teal-700"
            >
              Edit Profil
            </button>
          )}
        </div>

        {isEditing && (
          <div className="rounded-3xl bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-slate-900">Edit Profil</h2>
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              {error && <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>}
              {message && <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>}

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Nama Lengkap</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Username</label>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Nomor Telepon</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Alamat</label>
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-600">Bio</label>
                <textarea
                  value={form.bio}
                  onChange={(e) => setForm({ ...form, bio: e.target.value })}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  rows="3"
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 rounded-2xl bg-teal-600 px-4 py-2 font-medium text-white hover:bg-teal-700 disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan"}
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="flex-1 rounded-2xl border border-slate-200 px-4 py-2 font-medium text-slate-900 hover:bg-slate-100"
                >
                  Batal
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
