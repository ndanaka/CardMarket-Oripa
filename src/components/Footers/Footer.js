import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Nav, NavItem } from "reactstrap";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor"));

  useEffect(() => {
    getThemeData();
  }, []);

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");
    if (res.data.status === 1) {
      setBgColor(res.data.theme.bgColor);
      localStorage.setItem("bgColor", JSON.stringify(res.data.theme.bgColor));
    }
  };

  return (
    <div
      className="w-full p-2 py-3 xsm:px-4 relative bottom-0 z-10 flex flex-wrap justify-between"
      style={{ backgroundColor: bgColor }}
    >
      <div className="copyright text-white px-3 py-1">
        © {new Date().getFullYear()}{" "}
        <button
          className="font-weight-bold text-red-900"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="text-gray-200 text-md">Operating Company</span>
        </button>
      </div>
      <Nav className="nav-footer text-white">
        <NavItem>
          <div className="py-1 px-3 hover:cursor-pointer">
            <span
              className="text-white"
              onClick={() => navigate("/auth/terms")}
            >
              {t("userterms")}
            </span>
          </div>
        </NavItem>

        <NavItem>
          <div className="py-1 px-3 hover:cursor-pointer">
            <span className="text-white" onClick={() => navigate("/user/blog")}>
              {t("blog")}
            </span>
          </div>
        </NavItem>

        <NavItem>
          <div className="py-1 px-3 hover:cursor-pointer">
            <span
              className="text-white hover:underline-offset-2"
              onClick={() => navigate("/auth/lisence")}
            >
              {t("license")}
            </span>
          </div>
        </NavItem>

        <NavItem>
          <div className="py-1 px-3 hover:cursor-pointer">
            <span
              className="text-white"
              onClick={() => navigate("/auth/about-us")}
            >
              {t("aboutus")}
            </span>
          </div>
        </NavItem>
      </Nav>
    </div>
  );
};

export default Footer;
