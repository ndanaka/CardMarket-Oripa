import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import ChangeLanguage from "../Others/ChangeLanguage";

import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Nav,
  Media,
} from "reactstrap";

import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import api from "../../utils/api";

import usePersistedUser from "../../store/usePersistedUser";

import LoginImg from "../../assets/img/icons/login.png";
import "../../assets/css/index.css";

const AdminNavbar = (props) => {
  const [user, setUser] = usePersistedUser();
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    updateAdminData();
  }, [location]);

  const updateAdminData = () => {
    setAuthToken();
    if (user) {
      api
        .get(`/admin/get_admin/${user.user_id}`)
        .then((res) => {
          if (res.data.status === 1) {
            setUser(res.data.admin);
          }
        })
        .catch((err) => {
          showToast("Try to login again", "error");
        });
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    navigate("/auth/login");
  };

  const nav_login = () => {
    navigate("/auth/login");
  };

  return (
    <div className="w-full bg-admin_theme_color py-2 px-4">
      <div className="w-full navbar-dark">
        <div className="w-full flex justify-between items-center content-end md:content-between">
          <Link
            className="h4 mb-0 text-[#e0e1e2] text-uppercase hidden xxsm:block"
            to="/admin/index"
          >
            {""}
          </Link>
          <div className="text-white text-2xl xxsm:hidden cursor-pointer">
            <i className="fa fa-navicon"></i>
          </div>
          <div className="flex justify-between">
            <div className="flex items-center">
              <ChangeLanguage />
            </div>
            <Nav navbar>
              {user ? (
                <div className="flex items-center px-2">
                  <UncontrolledDropdown nav>
                    <DropdownToggle className="pr-0" nav>
                      <div className="flex items-center text-[#121c2c]">
                        <span className="w-10 h-10 rounded-full">
                          <img
                            alt="..."
                            src={LoginImg}
                            className="w-10 h-10 rounded-full"
                          />
                        </span>
                      </div>
                    </DropdownToggle>
                    <DropdownMenu className="dropdown-menu-arrow">
                      <DropdownItem onClick={() => logout()}>
                        <i className="ni ni-user-run" />
                        <span>{t("logout")}</span>
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
              ) : (
                <Media>
                  <img src={LoginImg} alt="img" onClick={nav_login}></img>
                </Media>
              )}
            </Nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
