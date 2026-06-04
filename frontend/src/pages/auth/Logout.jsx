import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { logout } from "../../_service/auth";

export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const doLogout = async () => {
      try {
        await logout();
      } catch (error) {
        console.error("Logout error", error);
      } finally {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login", { replace: true });
      }
    };

    doLogout();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-10 shadow-lg">
        <p className="text-lg font-semibold text-slate-900">Sedang keluar...</p>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Permintaan logout sedang diproses. Anda akan segera diarahkan ke halaman login.
        </p>
      </div>
    </div>
  );
}
