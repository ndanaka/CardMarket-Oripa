import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Navbar } from "reactstrap";

import ChangeLanguage from "../Others/ChangeLanguage";

import "../../assets/css/index.css";

const AuthNavbar = () => {
  const { t } = useTranslation();

  return (
    <div className="w-full bg-theme_color p-2 fixed z-10 max-h-[100px] z-20">
      <Navbar className="w-full navbar-dark">
        <div className="w-full lg:w-3/4 mx-auto flex flex-wrap justify-between items-center content-end md:content-between xsm:px-[28px]">
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
