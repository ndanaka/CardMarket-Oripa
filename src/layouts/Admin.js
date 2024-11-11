import { useEffect } from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";

import routes from "../routes.js";
import usePersistedUser from "../store/usePersistedUser.js";
import useAxiosInterceptor from "../utils/AxiosInterceptors.js";

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import ScrollToTop from "../components/Others/ScrollTop.js";

const Admin = (props) => {
  const [user] = usePersistedUser();
  const navigate = useNavigate();
  const { isLoggedOut } = useAxiosInterceptor();

  useEffect(() => {
    if (isLoggedOut) navigate("/auth/login");
    if (user?.role !== "admin") navigate("/user/index");
  }, []);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" || prop.layout === "/admin/sub") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="relative min-w-full min-h-full flex">
      <div className="bg-alert_success hover:bg-alert_error hidden"></div>
      <div className="bg-alert_error hidden"></div>
      <div>
        <Sidebar
          {...props}
          routes={routes}
          logo={{
            innerLink: "/user/index",
            imgSrc: require("../assets/img/icons/logo/admin-logo.png"),
            imgAlt: "...",
          }}
        />
      </div>

      <div className=" h-full w-full flex flex-col items-center main-content">
        <AdminNavbar {...props} />
        <div className="w-full h-full">
          <Routes>
            {getRoutes(routes)}
            <Route path="*" element={<Navigate to="/admin/index" replace />} />
          </Routes>
          <ScrollToTop />
        </div>
      </div>
    </div>
  );
};

export default Admin;
