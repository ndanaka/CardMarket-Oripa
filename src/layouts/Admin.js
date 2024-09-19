import React, { useState, useEffect } from "react";
import { useAtom } from "jotai";

import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import AdminNavbar from "../components/Navbars/AdminNavbar.js";
import Sidebar from "../components/Sidebar/Sidebar.js";
import ScrollToTop from "../components/Others/ScrollTop.js";

import routes from "../routes.js";
import useAxiosInterceptor from "../utils/AxiosInterceptors.js";

import { UserAtom } from "../store/user";
import usePersistedUser from "../store/usePersistedUser.js";

const Admin = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const [user] = usePersistedUser();
  const { isLoggedOut } = useAxiosInterceptor();
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  let flagShow = false;

  const handleScroll = () => {
    const doc = document.documentElement;
    const scroll = (window.pageYOffset || doc.scrollTop) - (doc.clientTop || 0);
    const newFlagShow = scroll > 500;
    if (flagShow !== newFlagShow) {
      setShow(newFlagShow);
      flagShow = newFlagShow;
    }
  };

  const scrollTop = () => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  React.useEffect(() => {
    if (user.role !== "admin") navigate("/user/index");
    if (isLoggedOut) navigate("/auth/login");
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

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

      <div
        className=" h-full w-full flex flex-col items-center  main-content"
        ref={mainContent}
      >
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
