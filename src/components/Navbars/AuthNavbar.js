import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "reactstrap";

import ChangeLanguage from "../Others/ChangeLanguage";

import "../../assets/css/index.css";

const AuthNavbar = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-theme_color px-4 py-2">
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <div className="w-full flex justify-between items-center">
          <div>
            <Link className="h4 mb-0 text-white text-uppercase" to="/">
              <div className="flex items-center">
                <img
                  alt="..."
                  src={require("../../assets/img/brand/oripa-logo.png")}
                  width="50"
                  height="50"
                />
                <div className="text-lg font-NanumGothic hidden xxsm:block">
                  Oripa
                </div>
              </div>
            </Link>
          </div>
          <div toggler="#navbar-collapse-main">
            <div className="flex items-center">
              {/* <Link
                className="flex xsm:ruby text-white nav-link-icon px-2  items-center"
                to="/"
                tag={Link}
              >
                <i className="fa-solid fa-globe"></i>
                <span className="text-sm text-white px-2 hidden xsm:block">
                  {t("dashboard")}
                </span>
              </Link> */}
              <Link
                className="flex xsm:ruby text-white nav-link-icon px-2 items-center"
                to="/auth/register"
                tag={Link}
              >
                <i className="fa-solid fa-user-plus"></i>
                <span className="nav-link-inner--text text-white px-2 hidden xsm:block">
                  {t("register")}
                </span>
              </Link>
              <Link
                className="flex xsm:ruby text-white nav-link-icon px-2  items-center"
                to="/auth/login"
                tag={Link}
              >
                <i className="fa-solid fa-key"></i>
                <span className="nav-link-inner--text text-white px-2 hidden xsm:block">
                  {t("login")}
                </span>
              </Link>
              <ChangeLanguage />
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default AuthNavbar;
