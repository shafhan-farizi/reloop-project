import { Routes, Route } from "react-router-dom";

/* components */
import ProtectedRoute from "../components/ProtectedRoute";

/* layouts */
import PublicLayout from "../layouts/public";
import DashboardLayout from "../layouts/DashboardLayout";

/* public */
import Home from "../pages/public";
import Catalog from "../pages/public/Catalog";
import RoleSelectionDashboard from "../pages/RoleSelectionDashboard";

/* auth */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Logout from "../pages/auth/Logout";

/* dashboard */
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Management from "../pages/admin/Management";
import TrackingStatus from "../pages/admin/TrackingStatus";
import Notification from "../pages/admin/Notification";
import DonationHistory from "../pages/admin/HistoryDonation";

/* pengguna */
import PenggunaLayout from "../layouts/PenggunaLayout";
import PenggunaDashboard from "../pages/pengguna/Dashboard";
import TambahDonasi from "../pages/pengguna/TambahDonasi";
import TambahDonasiDetail from "../pages/pengguna/TambahDonasiDetail";
import TambahDonasiForm from "../pages/pengguna/TambahDonasiForm";
import RequestMasuk from "../pages/pengguna/RequestMasuk";
import Pengiriman from "../pages/pengguna/Pengiriman";
import Profile from "../pages/pengguna/Profile";
import Pengaturan from "../pages/pengguna/Pengaturan";
import RiwayatDonasi from "../pages/pengguna/RiwayatDonasi";
import NotificationPengguna from "../pages/pengguna/Notification";

/* penerima */
import PenerimaLayout from "../layouts/PenerimaLayout";
import Beranda from "../pages/penerima/Beranda";
import CariBarang from "../pages/penerima/CariBarang";
import RequestSaya from "../pages/penerima/RequestSaya";
import TrackingPengiriman from "../pages/penerima/TrackingPengiriman";
import TrackingDetail from "../pages/penerima/TrackingDetail";
import RiwayatPenerima from "../pages/penerima/RiwayatPenerima";
import NotificationPenerima from "../pages/penerima/Notification";
import ProfilePenerima from "../pages/penerima/Profile";
import PengaturanPenerima from "../pages/penerima/Pengaturan";

export default function AppRoutes() {
  return (
    <Routes>
      {/* PUBLIC */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
      </Route>

      {/* ROLE SELECTION - after login */}
      <Route path="/pilih-peran" element={<ProtectedRoute><RoleSelectionDashboard /></ProtectedRoute>} />

      {/* auth  */}
      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/logout" element={<Logout />} />

      {/* ADMIN */}
      <Route path="/admin" element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />

        <Route path="users" element={<Users />} />

        <Route path="categories" element={<Categories />} />

        <Route path="management" element={<Management />} />

        <Route path="tracking" element={<TrackingStatus />} />

        <Route path="riwayat" element={<DonationHistory />} />

        <Route path="notifications" element={<Notification />} />
      </Route>

      {/* PENGGUNA */}
      <Route path="/pengguna" element={<ProtectedRoute><PenggunaLayout /></ProtectedRoute>}>
        <Route index element={<PenggunaDashboard />} />
        <Route path="tambah-donasi" element={<TambahDonasi />} />
        <Route path="tambah-donasi/form" element={<TambahDonasiForm />} />
        <Route path="tambah-donasi/:id" element={<TambahDonasiDetail />} />
        <Route path="tambah-donasi/:id/edit" element={<TambahDonasiForm />} />
        <Route path="request-masuk" element={<RequestMasuk />} />
        <Route path="pengiriman" element={<Pengiriman />} />
        <Route path="profile" element={<Profile />} />
        <Route path="pengaturan" element={<Pengaturan />} />
        <Route path="notifikasi" element={<NotificationPengguna />} />
        <Route path="riwayat" element={<RiwayatDonasi />} />
      </Route>

      {/* PENERIMA */}
      <Route path="/penerima" element={<ProtectedRoute><PenerimaLayout /></ProtectedRoute>}>
        <Route index element={<Beranda />} />
        <Route path="cari" element={<CariBarang />} />
        <Route path="request-saya" element={<RequestSaya />} />
        <Route path="tracking" element={<TrackingPengiriman />} />
        <Route path="tracking/:id" element={<TrackingDetail />} />
        <Route path="riwayat" element={<RiwayatPenerima />} />
        <Route path="notifikasi" element={<NotificationPenerima />} />
        <Route path="profile" element={<ProfilePenerima />} />
        <Route path="pengaturan" element={<PengaturanPenerima />} />
      </Route>
    </Routes>
  );
}
