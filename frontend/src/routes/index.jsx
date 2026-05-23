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
      </Route>

    </Routes>
  );
}