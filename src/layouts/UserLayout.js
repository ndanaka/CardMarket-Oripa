import { useRef, useState, useEffect } from "react";
import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import useAxiosInterceptor from "../utils/AxiosInterceptors.js";

import routes from "../routes.js";

// core components
import UserNavbar from "../components/Navbars/UserNavbar.js";
import Footer from "../components/Footers/Footer.js";
import ScrollToTop from "../components/Others/ScrollTop.js";

const UserLayout = (props) => {
  const mainContent = useRef(null);
  const [, setShow] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedOut } = useAxiosInterceptor();

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedOut) navigate("/auth/login");
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

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

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/user") {
        const token = localStorage.getItem("token");
        if (prop.path === "/user-profile" && !token)
          return (
            <Route
              path={prop.path}
              key={key}
              element={<Navigate to="/auth/login" replace />}
            />
          );
        else
          return (
            <Route path={prop.path} element={prop.component} key={key} exact />
          );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <div
      className="relative flex flex-col justify-between h-auto w-full min-h-full main-content bg-[#f3f4f6]"
      ref={mainContent}
    >
      <UserNavbar
        {...props}
        brandText={getBrandText(props?.location?.pathname)}
      />
      <div className="w-full h-full">
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/user/index" replace />} />
        </Routes>
        <ScrollToTop />
      </div>
      <Footer />
    </div>
  );
};

export default UserLayout;
