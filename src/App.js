import { useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Navigate } from "react-router-dom";

import AdminLayout from "./layouts/Admin.js";
import AuthLayout from "./layouts/Auth.js";
import UserLayout from "./layouts/User.js";

import { initializeToast } from "./utils/toastUtil.js";
import "../src/utils/i18next.js"; // Import i18n configuration

export default function App() {
  useEffect(() => {
    initializeToast();
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/admin/*" element={<AdminLayout />} />
        <Route path="/user/*" element={<UserLayout />} />
        <Route path="/auth/*" element={<AuthLayout />} />
        <Route path="*" element={<Navigate to="/user/index" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
