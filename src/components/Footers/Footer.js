import { useNavigate } from "react-router-dom";
import { Row, Col, Nav, NavItem } from "reactstrap";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="w-full bg-theme_color p-2 py-3 xsm:px-4 relative bottom-0 z-10 flex flex-wrap justify-between">
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
