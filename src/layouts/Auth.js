import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import { Route, Routes, Navigate, useLocation } from "react-router-dom";

import api from "../utils/api.js";

// core components
import AuthNavbar from "../components/Navbars/AuthNavbar.js";
import AuthFooter from "../components/Footers/Footer.js";

import iniLogoImg from "../assets/img/brand/oripa-logo.png";

import routes from "../routes.js";

const Auth = () => {
  const location = useLocation();

  const [logoImg, setLogoImg] = useState(iniLogoImg);
  const [brand, setBrand] = useState("Oripa");
  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor"));

  useEffect(() => {
    document.body.classList.add("bg-default");
    getThemeData();

    return () => {
      document.body.classList.remove("bg-default");
    };
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");
    if (res.data.status === 1) {
      setBrand(res.data.theme.brand);
      setBgColor(res.data.theme.bgColor);
      setLogoImg(process.env.REACT_APP_SERVER_ADDRESS + res.data.theme.logoUrl);
      localStorage.setItem("bgColor", JSON.stringify(res.data.theme.bgColor));
    }
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <AuthNavbar logoImg={logoImg} brand={brand} bgColor={bgColor} />
      <Container className="flex-grow bg-[#f3f4f6] py-3 mx-auto md:w-3/5 lg:w-2/5 mt-16">
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Container>
      <AuthFooter />
    </div>
  );
};

export default Auth;
