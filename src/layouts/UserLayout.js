import { useState, useEffect } from "react";
import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import routes from "../routes.js";
import usePersistedUser from "../store/usePersistedUser.js";
import useAffiliateID from "../utils/useAffiliateID.js";
import useAxiosInterceptor from "../utils/AxiosInterceptors.js";

// core components
import UserNavbar from "../components/Navbars/UserNavbar.js";
import Footer from "../components/Footers/Footer.js";
import ScrollToTop from "../components/Others/ScrollTop.js";

const UserLayout = (props) => {
  const { isLoggedOut } = useAxiosInterceptor();

  const location = useLocation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();

  const [affId, setAffId] = useState("");
  const [isOpenToggleMenu, setIsOpenToggleMenu] = useState(false);

  // Add state to track if navigation is in progress
  const [isNavigating, setIsNavigating] = useState(false);

  // check the URL parameters on page load to see if the affiliate ID is present.
  const handleAffiliateID = (affiliateID) => {
    setAffId(affiliateID);
    // Here, you can call your API or any other logic
  };
  useAffiliateID(handleAffiliateID);

  useEffect(() => {
    if (isLoggedOut) {
      setIsNavigating(true);
      navigate("/auth/login");
    } else if (user?.role === "admin") {
      setIsNavigating(true);
      navigate("/admin/index");
    }
  }, [isLoggedOut, user, navigate]);

  // Stop rendering UserLayout if navigation is in progress
  if (isNavigating || user?.role === "admin") {
    return null;
  }

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
    <div className="flex flex-col h-auto min-h-screen">
      <UserNavbar
        {...props}
        brandText={getBrandText(props?.location?.pathname)}
        isOpenToggleMenu={isOpenToggleMenu}
        setIsOpenToggleMenu={setIsOpenToggleMenu}
      />
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/user/index" replace />} />
      </Routes>
      <ScrollToTop />
      {location.pathname !== "/user/gacha-detail" && <Footer />}
    </div>
  );
};

export default UserLayout;
