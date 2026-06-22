import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { getUsers, toggleUserStatus } from "../../_service/user";

export default function Users() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");

  useEffect(() => {
    const paramValue = searchParams.get("search") || "";
    if (paramValue !== search) {
      setSearch(paramValue);
    }
  }, [searchParams]);

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
      if (search) {
        setSearchParams({ search });
      } else {
        setSearchParams({});
      }
    }, 500);

    return () => clearTimeout(timeout);
  }, [search, setSearchParams]);

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
    <div className="p-4 sm:p-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-orange-400">Kelola User</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Daftar seluruh pengguna yang terdaftar pada sistem.
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-md overflow-hidden">
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-b">
          <h2 className="font-semibold text-base sm:text-lg text-gray-700">Data User</h2>
        </div>

        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 text-gray-600 text-xs sm:text-sm uppercase">
              <tr>
                <th className="px-4 sm:px-6 py-3 text-left">No</th>
                <th className="px-4 sm:px-6 py-3 text-left">Nama</th>
                <th className="px-4 sm:px-6 py-3 text-left">Email</th>
                <th className="px-4 sm:px-6 py-3 text-left">Role</th>
                <th className="px-4 sm:px-6 py-3 text-left">Status</th>
                <th className="px-4 sm:px-6 py-3 text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr
                    key={user.id}
                    className="border-b hover:bg-gray-50 transition text-sm"
                  >
                    <td className="px-4 sm:px-6 py-3 sm:py-4">{index + 1}</td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-gray-800">
                      {user.name}
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-gray-600">{user.email}</td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          user.role === "admin"
                            ? "bg-purple-100 text-purple-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4">
                      <span
                        className={`px-2 sm:px-3 py-1 rounded-full text-xs font-semibold ${
                          user.is_active
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {user.is_active ? "Aktif" : "Nonaktif"}
                      </span>
                    </td>

                    <td className="px-4 sm:px-6 py-3 sm:py-4 text-center">
                      <button
                        onClick={() => handleToggle(user.id)}
                        className={`px-3 py-2 rounded-lg text-white text-xs sm:text-sm font-medium transition ${
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
                  <td colSpan="6" className="text-center py-6 text-gray-500 text-sm">
                    Tidak ada data user.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
          </div>

          {/* Mobile cards */}
          <div className="block sm:hidden p-3 space-y-3">
            {users.length > 0 ? (
              users.map((user, index) => (
                <div
                  key={user.id}
                  className="border rounded-lg p-3 bg-white shadow-sm"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-800 truncate">{user.name}</div>
                      <div className="text-xs sm:text-sm text-gray-500 truncate">{user.email}</div>
                      <div className="mt-2 flex items-center gap-1 flex-wrap">
                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {user.role}
                        </span>

                        <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${user.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                          {user.is_active ? 'Aktif' : 'Nonaktif'}
                        </span>
                      </div>
                    </div>

                    <div className="shrink-0">
                      <button
                        onClick={() => handleToggle(user.id)}
                        className={`px-2 py-1.5 rounded-lg text-white text-xs font-medium transition whitespace-nowrap ${user.is_active ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
                      >
                        {user.is_active ? 'Non.' : 'Aktif'}
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-6 text-gray-500 text-sm">Tidak ada data user.</div>
            )}
          </div>
      </div>
    </div>
  );
}
