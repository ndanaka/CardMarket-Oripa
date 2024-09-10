import { Link } from "react-router-dom";
import "../../assets/css/index.css";
// reactstrap components
import {
  NavbarBrand,
  Navbar,
} from "reactstrap";
import { useTranslation } from "react-i18next";
const AdminNavbar = () => {
  const {t} = useTranslation();
  return (
    <div className="w-full bg-theme_color px-4 py-2">
      <Navbar className="navbar-top navbar-horizontal navbar-dark" expand="md">
        <div className="w-full flex justify-between items-center">
          <NavbarBrand to="/" tag={Link}>
            <img
              alt="..."
              src={require("../../assets/img/brand/oripa-logo.png")}
              width="50"
              height={50}
            />
          </NavbarBrand>

          <div toggler="#navbar-collapse-main">
            <div className="flex">
              <Link className="text-white nav-link-icon px-2" to="/" tag={Link}>
              <i class="fa-solid fa-globe"></i>
                <span className="text-sm text-white px-2">{t('dashboard')}</span>
              </Link>
              <Link
                className="text-white nav-link-icon px-2"
                to="/auth/register"
                tag={Link}
              >
                <i class="fa-solid fa-user-plus"></i>
                <span className="nav-link-inner--text text-white px-2">
                  {t("register")}
                </span>
              </Link>
              <Link
                className="text-white nav-link-icon px-2"
                to="/auth/login"
                tag={Link}
              >
                <i class="fa-solid fa-key"></i>
                <span className="nav-link-inner--text text-white px-2">
                  {t('login')}
                </span>
              </Link>
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default AdminNavbar;
