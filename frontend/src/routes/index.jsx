import { Routes, Route } from "react-router-dom";

/* layouts */
import PublicLayout from "../layouts/public";
import DashboardLayout from "../layouts/DashboardLayout";

/* public */
import Home from "../pages/public";

/* auth */
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

/* dashboard */
import Dashboard from "../pages/dashboard/Dashboard";
import Users from "../pages/admin/Users";
import Categories from "../pages/admin/Categories";
import Management from "../pages/admin/Management";
import InputResi from "../pages/admin/InputResi";
import TrackingStatus from "../pages/admin/TrackingStatus";
import Notification from "../pages/admin/Notification";
import DonationHistory from "../pages/admin/HistoryDonation";

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

      {/* ADMIN */}
      <Route path="/admin" element={<DashboardLayout />}>
        <Route index element={<Dashboard />} />

        <Route path="users" element={<Users />} />

        <Route path="categories" element={<Categories />} />

        <Route path="management" element={<Management />} />

        <Route path="input-resi" element={<InputResi />} />

        <Route path="tracking" element={<TrackingStatus />} />

        <Route path="riwayat" element={<DonationHistory />} />

        <Route path="notifications" element={<Notification />} />
      </Route>
    </Routes>
  );
}
