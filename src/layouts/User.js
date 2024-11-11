import { useState, useEffect } from "react";
import { useAtom } from "jotai";
import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import routes from "../routes.js";

import api from "../utils/api.js";
import useAffiliateID from "../utils/useAffiliateID.js";
import useAxiosInterceptor from "../utils/AxiosInterceptors.js";

import UserNavbar from "../components/Navbars/UserNavbar.js";
import Footer from "../components/Footers/Footer.js";
import ScrollToTop from "../components/Others/ScrollTop.js";
import iniLogoImg from "../assets/img/brand/oripa-logo.png";

import usePersistedUser from "../store/usePersistedUser.js";
import { bgColorAtom, logoAtom } from "../store/theme.js";

const User = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedOut } = useAxiosInterceptor();
  const [user] = usePersistedUser();
  const [, setBgColor] = useAtom(bgColorAtom);
  const [, setLogo] = useAtom(logoAtom);

  const [, setAffId] = useState("");
  const [isOpenToggleMenu, setIsOpenToggleMenu] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);

  // check the URL parameters on page load to see if the affiliate ID is present.
  const handleAffiliateID = (affiliateID) => {
    setAffId(affiliateID);
  };
  useAffiliateID(handleAffiliateID);

  useEffect(() => {
    getThemeData();

    if (isLoggedOut) {
      setIsNavigating(true);
      navigate("/auth/login");
    } else if (user?.role === "admin") {
      setIsNavigating(true);
      navigate("/admin/index");
    }
  }, [isLoggedOut, user, navigate]);

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");

    if (res.data.status === 1 && res.data.theme) {
      if (res.data.theme.logoUrl) {
        setLogo(process.env.REACT_APP_SERVER_ADDRESS + res.data.theme.logoUrl);
      } else {
        setLogo(iniLogoImg);
      }

      if (res.data.theme.bgColor) {
        setBgColor(res.data.theme.bgColor);
      } else {
        setBgColor("#ff0000");
      }
    } else {
      setLogo(iniLogoImg);
      setBgColor("#ff0000");
    }
  };

  if (isNavigating || user?.role === "admin") {
    return null;
  }

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/user") {
        const token = localStorage.getItem("token");

        if (
          prop.path !== "/index" &&
          prop.path !== "/gachaDetail" &&
          prop.path !== "/blog" &&
          !token
        )
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
      {location.pathname !== "/user/gachaDetail" && <Footer />}
    </div>
  );
};

export default User;
