import { useRef, useState, useEffect } from "react";
import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";

import useAxiosInterceptor from "../utils/AxiosInterceptors.js";
import api from "../utils/api.js";

import routes from "../routes.js";

// core components
import UserNavbar from "../components/Navbars/UserNavbar.js";
import Footer from "../components/Footers/Footer.js";
import ScrollToTop from "../components/Others/ScrollTop.js";
import iniLogoImg from "../assets/img/brand/oripa-logo.png";

const UserLayout = (props) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [logoImg, setLogoImg] = useState(iniLogoImg);
  const [brand, setBrand] = useState("Oripa");
  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor"));

  const mainContent = useRef(null);

  const { isLoggedOut } = useAxiosInterceptor();

  const [, setShow] = useState(false);
  const [isOpenToggleMenu, setIsOpenToggleMenu] = useState(false);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (isLoggedOut) navigate("/auth/login");
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
    getThemeData();
  }, [location]);

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");
    if (res.data.status === 1) {
      setBrand(res.data.theme.brand);
      setBgColor(res.data.theme.bgColor);
      setLogoImg(process.env.REACT_APP_SERVER_ADDRESS + res.data.theme.logoUrl);

      localStorage.setItem("bgColor", JSON.stringify(res.data.theme.bgColor));
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

  return (
    <div className="flex flex-col h-auto min-h-screen" ref={mainContent}>
      <UserNavbar
        {...props}
        brandText={getBrandText(props?.location?.pathname)}
        isOpenToggleMenu={isOpenToggleMenu}
        setIsOpenToggleMenu={setIsOpenToggleMenu}
        logoImg={logoImg}
        brand={brand}
        bgColor={bgColor}
      />
      <Routes>
        {getRoutes(routes)}
        <Route path="*" element={<Navigate to="/user/index" replace />} />
      </Routes>
      <ScrollToTop />
      {!isLoggedOut && location.pathname !== "/user/gacha-detail" && <Footer />}
    </div>
  );
};

export default UserLayout;
