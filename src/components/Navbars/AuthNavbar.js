import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Navbar } from "reactstrap";

import ChangeLanguage from "../Others/ChangeLanguage";
import "../../assets/css/index.css";

const AuthNavbar = ({ logoImg, brand }) => {
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    setBgColor(localStorage.getItem("bgColor"));
  });

  return (
    <div
      className="w-full p-2 fixed z-10 max-h-[100px] z-20"
      style={{ backgroundColor: bgColor }}
    >
      <Navbar className="w-full navbar-dark">
        <div className="w-full lg:w-3/4 mx-auto flex flex-wrap justify-between items-center content-end md:content-between xsm:px-[28px]">
          <div>
            <Link className="h4 mb-0 text-white text-uppercase" to="/">
              <div className="flex items-center">
                <img
                  alt="..."
                  src={logoImg}
                  width="50"
                  height="50"
                  className="px-1"
                />
                <div className="text-lg font-NanumGothic hidden xxsm:block">
                  {brand}
                </div>
              </div>
            </Link>
          </div>
          <div toggler="#navbar-collapse-main">
            <div className="flex items-center">
              <ChangeLanguage />
            </div>
          </div>
        </div>
      </Navbar>
    </div>
  );
};

export default AuthNavbar;
