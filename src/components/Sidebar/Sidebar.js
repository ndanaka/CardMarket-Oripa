import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import GetUser from "../../utils/getUserAtom";
import { useTranslation } from "react-i18next";
// reactstrap components
import { NavbarBrand, Nav } from "reactstrap";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = GetUser();
  const currentPath = location.pathname;
  const { t, i18n } = useTranslation();
  console.log("sideuser", user);
  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin" && user.authority[prop.name] > 0) {
        // console.log(" User.authority[prop.name]",  User.authority[prop.name])
        return (
          <div
            key={key}
            className={`group py-2 px-4 flex justify-between hover:bg-[#1e3a6b] dark:text-gray-300 text-gray-200 hover:text-white cursor-pointer select-none border-b-[1px] border-gray-300 ${
              currentPath === prop.layout + prop.path
                ? "bg-[#1e3a6b] text-white"
                : ""
            }`}
            onClick={() => navigate(prop.layout + prop.path)}
          >
            <div className="w-full flex justify-between items-center py-1">
              <i className={prop.icon + " pr-3 group-hover:text-white"} />
              <div className="text-base w-4/6  font-Lexend text-left font-semibold">
                {t(prop.name)}
              </div>
            </div>
          </div>
        );
      } else return null;
    });
  };

  const { bgColor, routes, logo } = props;
  let navbarBrandProps;
  if (logo && logo.innerLink) {
    navbarBrandProps = {
      to: logo.innerLink,
      tag: Link,
    };
  } else if (logo && logo.outterLink) {
    navbarBrandProps = {
      href: logo.outterLink,
      target: "_blank",
    };
  }

  return (
    <div className="absolute top-0 left-0 z-10 bg-admin_theme_color border-r-2 border-gray-300 min-h-full hidden xxsm:block xxsm:relative transition-all duration-300">
      {logo ? (
        <NavbarBrand className="py-3" {...navbarBrandProps}>
          <img
            alt={logo.imgAlt}
            className="navbar-brand-img"
            src={logo.imgSrc}
          />
        </NavbarBrand>
      ) : null}
      {/* <div className="flex flex-col">
        <Row>
          <Col className="collapse-close" xs="6">
            <button className="navbar-toggler" type="button">
              <span />
              <span />
            </button>
          </Col>
        </Row>
      </div> */}
      <Nav navbar className="mt-3">
        {createLinks(routes)}
      </Nav>
    </div>
  );
};

export default Sidebar;
