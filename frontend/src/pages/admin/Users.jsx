import { useEffect, useState } from "react";
import { getUsers, toggleUserStatus } from "../../_service/user";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");

const fetchUsers = async () => {
  try {
    const res = await getUsers({
      search,
    });

    console.log("GET USERS:", res);

    setUsers(res.data.users);
  } catch (error) {
    console.log("ERROR:", error.response?.data);
  }
};

  useEffect(() => {
    const timeout = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(timeout);
  }, [search]);

const handleToggle = async (id) => {
  try {
    const res = await toggleUserStatus(id);

    alert(res.message);

    fetchUsers();
  } catch (error) {
    console.log(error);
  }
};

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Kelola User</h1>
        <p className="text-gray-500 mt-1">
          Daftar seluruh pengguna yang terdaftar pada sistem.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h2 className="font-semibold text-lg text-gray-700">Data User</h2>

          <input
            type="text"
            placeholder="Cari nama, email, username..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-80 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-sm uppercase">
              <tr>
                <th className="px-6 py-3 text-left">No</th>
                <th className="px-6 py-3 text-left">Nama</th>
                <th className="px-6 py-3 text-left">Email</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-6 py-4">{index + 1}</td>

                    <td className="px-6 py-4 font-medium text-gray-800">
                      {user.name}
                    </td>

                    <td className="px-6 py-4 text-gray-600">{user.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleToggle(user.id)}
                        className={`px-4 py-2 rounded-lg text-white text-sm font-medium transition ${
                          user.is_active
                            ? "bg-red-500 hover:bg-red-600"
                            : "bg-green-500 hover:bg-green-600"
                        }`}
                      >
                        {user.is_active ? "Nonaktifkan" : "Aktifkan"}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
