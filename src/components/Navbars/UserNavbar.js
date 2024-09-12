import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useAtom } from "jotai";
import { UserAtom } from "../../store/user";
import "../../assets/css/index.css";
import LoginImg from "../../assets/img/icons/login.png";
import { useTranslation } from "react-i18next";
// reactstrap components
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Nav,
  Media,
} from "reactstrap";

const UserNavbar = () => {
  const [user, setUser] = useAtom(UserAtom);
  const cookie = new Cookies();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const logout = () => {
    cookie.remove("TOKEN", { path: "/" });
    setUser({});
    navigate("/auth/login");
  };

  const nav_login = () => {
    navigate("/auth/login");
  };

  return (
    <div className="w-full bg-theme_color py-2 px-4 fixed z-10">
      <div className="w-full navbar-dark">
        <div className="w-full flex justify-between items-center content-end md:content-between">
          <div>
            <Link
              className="h4 mb-0 text-white text-uppercase hidden xxsm:block"
              to="/"
            >
              <div className="flex items-center">
                <img
                  alt="..."
                  src={require("../../assets/img/brand/oripa-logo.png")}
                  width="50"
                  height="50"
                />
                <div className="text-lg font-NanumGothic">Oripa</div>
              </div>
            </Link>
          </div>
          <Nav className="flex" navbar>
            {user.name ? (
              <div className="flex items-center px-2">
                {user.role === "admin" ? null : (
                  <div className="flex items-center mx-4">
                    <div className="text-base text-white text-left bg-red-600 border-[1px] border-red-700 rounded-full font-extrabold px-4">
                      {user.point_remain}
                    </div>
                    <img
                      src={require("../../assets/img/icons/coin.png")}
                      width="30px"
                      height="30px"
                      onClick={() => navigate("/user/pur-point")}
                      className="-translate-x-[50%]"
                    ></img>
                    {/* <i className="fa-solid fa-plus font-extrabold text-base text-white -translate-x-[170%]"></i> */}
                  </div>
                )}

                <UncontrolledDropdown nav>
                  <DropdownToggle className="pr-0" nav>
                    <div className="flex items-center">
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          src={require("../../assets/img/theme/avatar.jpg")}
                          className="w-8 h-8 rounded-full"
                        />
                      </span>

                      <span className="mb-0 text-md text-white hover:text-gray-100 font-weight-bold px-2 xs:hidden">
                        {user.name}
                      </span>
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow" right>
                    <DropdownItem className="" header tag="div">
                      <div className="text-base font-NanumGothic">
                        {t("welcome")}!
                      </div>
                    </DropdownItem>
                    <hr></hr>
                    {user.role === "admin" ? (
                      <DropdownItem
                        to="/admin/index"
                        tag={Link}
                        className="flex justify-between items-center"
                      >
                        <i className="fa-solid fa-user-secret" />
                        <span className="w-4/6 text-left font-Lexend font-bold">
                          {t("admin")}
                        </span>
                      </DropdownItem>
                    ) : (
                      <>
                        <DropdownItem
                          to="/user/user-profile"
                          tag={Link}
                          className="flex justify-between items-center"
                        >
                          <i className="fa fa-user-edit" />
                          <span className="w-4/6 text-left font-Lexend font-bold">
                            {t("profile")}
                          </span>
                        </DropdownItem>
                        <DropdownItem
                          to="/user/point-log "
                          tag={Link}
                          className="flex justify-between items-center"
                        >
                          <i className="fa-solid fa-magnifying-glass-dollar"></i>
                          <span className="w-4/6 text-left font-Lexend font-bold">
                            {t("point_log")}
                          </span>
                        </DropdownItem>
                        <DropdownItem
                          to="/user/Card"
                          tag={Link}
                          className="flex justify-between items-center"
                        >
                          <i className="fa-solid fa-award"></i>
                          <span className="w-4/6 text-left font-Lexend font-bold">
                            {t("my") + " " + t("cards")}
                          </span>
                        </DropdownItem>
                        <DropdownItem
                          to="/user/delivery"
                          tag={Link}
                          className="flex justify-between items-center"
                        >
                          <i className="fa-solid fa-truck"></i>
                          <span className="w-4/6 text-left font-Lexend font-bold">
                            {t("my") + " " + t("delivery")}
                          </span>
                        </DropdownItem>
                      </>
                    )}
                    <DropdownItem divider />
                    <DropdownItem
                      href="#pablo"
                      onClick={() => logout()}
                      className="flex justify-between items-center"
                    >
                      <i className="fa-solid fa-arrow-right-from-bracket"></i>
                      <span className="w-4/6 text-left font-bold font-NanumGothic">
                        {t("logout")}
                      </span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            ) : (
              <Media>
                <div>
                  <img
                    src={LoginImg}
                    width={50}
                    height={50}
                    onClick={nav_login}
                  ></img>
                </div>
              </Media>
            )}
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
