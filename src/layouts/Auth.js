import { useEffect, useState } from "react";
import { Container } from "reactstrap";
import {
  Route,
  Routes,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthNavbar from "../components/Navbars/AuthNavbar.js";
import AuthFooter from "../components/Footers/Footer.js";

import api from "../utils/api.js";
import routes from "../routes.js";
import useAffiliateID from "../utils/useAffiliateID.js";
import usePersistedUser from "../store/usePersistedUser.js";

import iniLogoImg from "../assets/img/brand/oripa-logo.png";

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();

  const [logoImg, setLogoImg] = useState(iniLogoImg);
  const [brand, setBrand] = useState("Oripa");
  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor"));
  const [affId, setAffId] = useState(null);

  useEffect(() => {
    if (localStorage.getItem("token") && user) {
      if (user?.role === "admin") navigate("/admin/index");
      if (user?.role !== "admin") navigate("/user/index");
    }
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
    if (res.data.status === 1 && res.data.theme) {
      if (res.data.theme.bgColor) {
        setBgColor(res.data.theme.bgColor);
        localStorage.setItem("bgColor", JSON.stringify(res.data.theme.bgColor));
      }
      if (res.data.theme.logoUrl) {
        setLogoImg(
          process.env.REACT_APP_SERVER_ADDRESS + res.data.theme.logoUrl
        );
      }
    }
  };

  // check the URL parameters on page load to see if the affiliate ID is present.
  const handleAffiliateID = (affiliateID) => {
    setAffId(affiliateID);
    // Here, you can call your API or any other logic
  };
  useAffiliateID(handleAffiliateID);

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
