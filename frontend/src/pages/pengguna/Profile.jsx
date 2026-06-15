import { useEffect, useState } from "react";
import { getProfile, updateProfile } from "../../_service/auth";

export default function Profile() {
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
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Email</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.email || "-"}</p>
              </div>
              <div className="rounded-3xl border border-slate-200 p-5">
                <p className="text-sm text-slate-500">Role</p>
                <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.role || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-3xl bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="h-20 w-20 overflow-hidden rounded-3xl bg-slate-100">
                  <img
                    src={profile?.profile_photo || "/placeholder.png"}
                    alt="Profil"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div>
                  <p className="text-sm uppercase tracking-[0.3em] text-slate-500">Akun</p>
                  <h3 className="text-xl font-semibold text-slate-900">{profile?.name || "-"}</h3>
                  <p className="text-sm text-slate-500">{profile?.created_at ? new Date(profile.created_at).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" }) : "-"}</p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsEditing((prev) => !prev);
                  setMessage("");
                  setError("");
                }}
                className="rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 shadow-sm hover:bg-slate-50"
              >
                {isEditing ? "Batal" : "Edit Profil"}
              </button>
            </div>

            {error ? (
              <div className="rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</div>
            ) : null}
            {message ? (
              <div className="rounded-2xl bg-emerald-50 p-4 text-sm text-emerald-700">{message}</div>
            ) : null}

            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Nama Lengkap</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Username</label>
                  <input
                    type="text"
                    value={form.username}
                    onChange={(e) => setForm((prev) => ({ ...prev, username: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Email</label>
                  <input
                    type="email"
                    value={form.email}
                    disabled
                    className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Telepon</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm((prev) => ({ ...prev, phone: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Alamat</label>
                  <textarea
                    rows={3}
                    value={form.address}
                    onChange={(e) => setForm((prev) => ({ ...prev, address: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-600">Bio singkat</label>
                  <textarea
                    rows={3}
                    value={form.bio}
                    onChange={(e) => setForm((prev) => ({ ...prev, bio: e.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-100"
                  />
                </div>

                <button
                  type="submit"
                  disabled={saving}
                  className="w-full rounded-2xl bg-teal-600 px-4 py-3 text-sm font-semibold text-white hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving ? "Menyimpan..." : "Simpan Profil"}
                </button>
              </form>
            ) : (
              <div className="space-y-4">
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Nama Lengkap</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.name || "-"}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Username</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.username || "-"}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Telepon</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.phone || "-"}</p>
                </div>
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5">
                  <p className="text-sm text-slate-500">Alamat</p>
                  <p className="mt-2 text-lg font-semibold text-slate-900">{profile?.address || "-"}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
