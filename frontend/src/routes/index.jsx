import { Routes, Route } from "react-router-dom";

/* layouts */
import PublicLayout from "../layouts/public";
import DashboardLayout from "../layouts/DashboardLayout";

/* public */
import Home from "../pages/public";

/* auth */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Logout from "../pages/auth/Logout";

/* dashboard */
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Management from "../pages/admin/Management";
import InputResi from "../pages/admin/InputResi";
import TrackingStatus from "../pages/admin/TrackingStatus";
import Notification from "../pages/admin/Notification";

/* pengguna */
import PenggunaLayout from "../layouts/PenggunaLayout";
import PenggunaDashboard from "../pages/pengguna/Dashboard";
import TambahDonasi from "../pages/pengguna/TambahDonasi";
import TambahDonasiDetail from "../pages/pengguna/TambahDonasiDetail";
import TambahDonasiForm from "../pages/pengguna/TambahDonasiForm";
import RequestMasuk from "../pages/pengguna/RequestMasuk";
import Pengiriman from "../pages/pengguna/Pengiriman";
import RiwayatDonasi from "../pages/pengguna/RiwayatDonasi";

/* penerima */
import PenerimaLayout from "../layouts/PenerimaLayout";
import Beranda from "../pages/penerima/Beranda";
import CariBarang from "../pages/penerima/CariBarang";
import RequestSaya from "../pages/penerima/RequestSaya";
import TrackingPengiriman from "../pages/penerima/TrackingPengiriman";
import RiwayatPenerima from "../pages/penerima/RiwayatPenerima";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
      </Route>

      {/* auth  */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/logout" element={<Logout />} />

      {/* ADMIN */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="users" element={<Users />} />

        <Route path="categories" element={<Categories />} />

        <Route path="management" element={<Management />} />

        <Route path="input-resi" element={<InputResi />} />

        <Route path="tracking" element={<TrackingStatus />} />

        <Route path="notifications" element={<Notification />} />
      </Route>

      {/* PENGGUNA */}
      <Route path="/pengguna" element={<PenggunaLayout />}>
        <Route index element={<PenggunaDashboard />} />
        <Route path="tambah-donasi" element={<TambahDonasi />} />
        <Route path="tambah-donasi/form" element={<TambahDonasiForm />} />
        <Route path="tambah-donasi/:id" element={<TambahDonasiDetail />} />
        <Route path="tambah-donasi/:id/edit" element={<TambahDonasiForm />} />
        <Route path="request-masuk" element={<RequestMasuk />} />
        <Route path="pengiriman" element={<Pengiriman />} />
        <Route path="riwayat" element={<RiwayatDonasi />} />
      </Route>

      {/* PENERIMA */}
      <Route path="/penerima" element={<PenerimaLayout />}>
        <Route index element={<Beranda />} />
        <Route path="cari" element={<CariBarang />} />
        <Route path="request-saya" element={<RequestSaya />} />
        <Route path="tracking" element={<TrackingPengiriman />} />
        <Route path="riwayat" element={<RiwayatPenerima />} />
      </Route>
    </Routes>
  );
}
