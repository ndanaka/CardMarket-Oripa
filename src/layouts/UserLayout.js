import { useRef, useState, useEffect } from "react";
import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import api from "../utils/api.js";
import routes from "../routes.js";
import usePersistedUser from "../store/usePersistedUser.js";
import useAffiliateID from "../utils/useAffiliateID.js";
import useAxiosInterceptor from "../utils/AxiosInterceptors.js";

// core components
import UserNavbar from "../components/Navbars/UserNavbar.js";
import Footer from "../components/Footers/Footer.js";
import ScrollToTop from "../components/Others/ScrollTop.js";
import iniLogoImg from "../assets/img/brand/oripa-logo.png";

const UserLayout = (props) => {
  const mainContent = useRef(null);
  const { isLoggedOut } = useAxiosInterceptor();

  const location = useLocation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();

  const [logoImg, setLogoImg] = useState(iniLogoImg);
  const [brand, setBrand] = useState("Oripa");
  const [bgColor, setBgColor] = useState("");
  const [affId, setAffId] = useState("");
  const [, setShow] = useState(false);
  const [isOpenToggleMenu, setIsOpenToggleMenu] = useState(false);

  useEffect(() => {
    if (isLoggedOut) navigate("/auth/login");
    if (user?.role === "admin") navigate("/admin/index");
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
    getThemeData();
  }, [location]);

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");
    if (res.data.status === 1 && res.data.theme) {
      if (res.data.theme.bgColor) {
        setBgColor(res.data.theme.bgColor);
        localStorage.setItem("bgColor", res.data.theme.bgColor);
      } else {
        setBgColor("#e50e0e");
      }
    } else {
      setBgColor("#e50e0e");
    }
  };

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

  // check the URL parameters on page load to see if the affiliate ID is present.
  const handleAffiliateID = (affiliateID) => {
    setAffId(affiliateID);
    // Here, you can call your API or any other logic
  };
  useAffiliateID(handleAffiliateID);

  return (
    <div className="flex flex-col h-auto min-h-screen" ref={mainContent}>
      <UserNavbar
        {...props}
        brandText={getBrandText(props?.location?.pathname)}
        isOpenToggleMenu={isOpenToggleMenu}
        setIsOpenToggleMenu={setIsOpenToggleMenu}
        logoImg={logoImg}
        brand={brand}
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
