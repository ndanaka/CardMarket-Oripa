import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Nav } from "reactstrap";

import { setAuthToken } from "../../utils/setHeader";
import api from "../../utils/api";

import usePersistedUser from "../../store/usePersistedUser";
import ChangeLanguage from "../Others/ChangeLanguage";

import "../../assets/css/index.css";
import formatPrice from "../../utils/formatPrice";

const UserNavbar = ({ isOpenToggleMenu, setIsOpenToggleMenu }) => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = usePersistedUser();

  useEffect(() => {
    updateUserData();
  }, [location]);

  const updateUserData = () => {
    setAuthToken();

    if (user) {
      api
        .get(`/user/get_user/${user._id}`)
        .then((res) => {
          if (res.data.status === 1) {
            setUser(res.data.user);
          }
        })
        .catch((err) => {
          console.log(err);
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
    <div className="w-full bg-theme_color p-2 fixed z-10 max-h-[100px] z-20">
      <div className="w-full navbar-dark">
        <div className="w-full lg:w-3/4 mx-auto flex flex-wrap justify-between items-center content-end md:content-between py-[8px] xsm:px-[28px]">
          <Link className="h4 mb-0 text-white text-uppercase xxsm:block" to="/">
            <div className="flex flex-wrap justify-between">
              {location.pathname === "/user/gacha-detail" ? (
                <button
                  className="flex xsm:ruby px-2 py-[4px] rounded-lg bg-red-500 border-[1px] border-red-700 text-center text-white text-sm"
                  onClick={() => navigate("/user/index")}
                >
                  <i className="fa fa-chevron-left mt-1"></i>
                  <span className="ml-1 hidden xsm:block">
                    {" " + t("return")}
                  </span>
                </button>
              ) : (
                <>
                  <img
                    alt="..."
                    src={require("../../assets/img/brand/oripa-logo.png")}
                    width="50"
                    height="50"
                  />
                  <div className="text-lg font-NanumGothic hidden xxsm:block">
                    Oripa
                  </div>
                </>
              )}
            </div>
          </Link>
          <div className="flex flex-wrap justify-between">
            <Nav navbar>
              {user ? (
                <div className="flex items-center">
                  {user.role !== "admin" && (
                    <button className="flex items-center">
                      <div
                        className="flex flex-wrap text-base text-white font-extrabold items-center"
                        onClick={() => navigate("/user/pur-point")}
                      >
                        <img
                          alt=""
                          src={require("../../assets/img/icons/coin.png")}
                          width="30px"
                          height="30px"
                          className="-translate-x-[-50%]"
                        />
                        <span className="bg-red-600 border-[1px] border-red-700 rounded-full px-4 py-1">
                          {user.point_remain
                            ? formatPrice(user.point_remain)
                            : 0}{" "}
                          pt
                        </span>
                        <i className="fa-solid fa-plus font-extrabold text-base text-white -translate-x-[70%]"></i>
                      </div>
                    </button>
                  )}
                  <div className="relative">
                    <button
                      className="flex items-center"
                      onClick={() => setIsOpenToggleMenu(!isOpenToggleMenu)}
                    >
                      <span className="avatar avatar-sm rounded-circle">
                        <img
                          alt="..."
                          src={require("../../assets/img/icons/login.png")}
                          className="w-8 h-8 rounded-full"
                        />
                      </span>
                    </button>

                    <div
                      className={`pt-4 pb-24 overflow-y-auto h-full shadow-md shadow-gray-400 fixed top-0 right-0 h-full w-80 bg-gray-100 text-gray-800 transform transition-transform duration-300 ease-in-out ${
                        isOpenToggleMenu ? "translate-x-0" : "translate-x-full"
                      }`}
                    >
                      <div className="top-0">
                        <h2 className="pb-2 text-xl font-bold text-center">
                          {t("my") + " " + t("status")}
                        </h2>
                        <button
                          onClick={() => setIsOpenToggleMenu(!isOpenToggleMenu)}
                          className="font-bold absolute top-4 right-4 text-gray-800 py-1 px-3 bg-gray-200 rounded-md"
                        >
                          X
                        </button>
                      </div>
                      <hr></hr>
                      <div className="p-2">
                        <ul>
                          <li
                            className="text-center shadow-md shadow-gray-300 cursor-pointer flex flex-col justify-center mx-2 my-2 p-3 border-solid border-4 border-gray-400 rounded-lg"
                            style={{
                              backgroundImage:
                                "url('assets/img/prize/gold.png')",
                              backgroundSize: "cover",
                              backgroundPosition: "center",
                            }}
                          >
                            <span className="text-gray-800 text-lg font-bold">
                              {t("rank")}
                            </span>
                            <hr className="h-1 w-full my-2 border-3 border-gray-400"></hr>
                            <span
                              className="text-gray-800 text-5xl font-bold uppercase"
                              style={{ fontFamily: "serif" }}
                            >
                              {t("silver")}
                            </span>
                            <span className="text-gray-800 text-lg">
                              0 / {formatPrice("400000")}
                            </span>
                          </li>
                          <li className="mx-2 mt-4 mb-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg">
                            <span className="font-bold text-lg">
                              {t("point")}
                            </span>
                            <div className="flex flex-wrap justify-start items-center">
                              <img
                                alt=""
                                src={require("../../assets/img/icons/coin.png")}
                                width="30px"
                                height="30px"
                                className="py-2"
                              />
                              <span className="px-2 text-lg font-bold">
                                {user.point_remain
                                  ? formatPrice(user.point_remain)
                                  : 0}{" "}
                                pt
                              </span>
                            </div>

                            <hr className="w-full border-solid border-1 border-gray-800 mb-2"></hr>
                            <button
                              id="closeBtn"
                              className="bg-theme_color rounded-md text-center hover:bg-red-500 text-white outline-none w-full py-2"
                              onClick={() => {
                                setIsOpenToggleMenu(!isOpenToggleMenu);
                                navigate("/user/pur-point");
                              }}
                            >
                              {t("purchagePoints")}
                            </button>
                          </li>
                          <li
                            className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                            onClick={() => {
                              setIsOpenToggleMenu(!isOpenToggleMenu);
                              navigate("/user/point-log");
                            }}
                          >
                            <span>{t("pointHistory")}</span>
                            <i className="fa fa-chevron-right"></i>
                          </li>
                          <li
                            className="cursor-pointer flex flex-wrap justify-between items-center mx-2 mb-2 mt-4 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                            onClick={() => {
                              setIsOpenToggleMenu(!isOpenToggleMenu);
                              navigate("/user/user-profile");
                            }}
                          >
                            <span>{t("profile")}</span>
                            <i className="fa fa-chevron-right"></i>
                          </li>
                          <li
                            className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                            onClick={() => {
                              setIsOpenToggleMenu(!isOpenToggleMenu);
                              navigate("/user/userShiping");
                            }}
                          >
                            <span>{t("shipAddress")}</span>
                            <i className="fa fa-chevron-right"></i>
                          </li>
                          <li
                            className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                            onClick={() => {
                              setIsOpenToggleMenu(!isOpenToggleMenu);
                              navigate("/user/delivery");
                            }}
                          >
                            <span>{t("deliveryHistory")}</span>
                            <i className="fa fa-chevron-right"></i>
                          </li>
                          <li
                            className="cursor-pointer flex flex-wrap justify-between items-center mx-2 my-2 p-3 text-gray-600 border-solid border-1 border-gray-400 rounded-lg"
                            onClick={() => {
                              setIsOpenToggleMenu(!isOpenToggleMenu);
                              navigate("/user/card");
                            }}
                          >
                            <span>{t("my") + " " + t("cards")}</span>
                            <i className="fa fa-chevron-right"></i>
                          </li>
                          <li className="p-2 my-3 flex flex-wrap justify-end">
                            <ChangeLanguage type="menu" />
                          </li>
                          <li
                            className="px-2 flex flex-wrap justify-end items-center"
                            onClick={() => logout()}
                          >
                            <button className="underline underline-offset-4 font-bold text-lg cursor-pointer">
                              {t("logout")}
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="flex flex-wrap justify-between">
                  <ChangeLanguage />
                  <button
                    className="flex items-center px-2 py-1 border rounded-lg text-white ml-2"
                    onClick={nav_login}
                  >
                    {t("register")} / {t("login")}
                  </button>
                </div>
              )}
            </Nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserNavbar;
