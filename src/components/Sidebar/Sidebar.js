import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Nav } from "reactstrap";

const Sidebar = (props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const createLinks = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/admin") {
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

  const { routes, logo } = props;
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
      <Link
        className="text-[#e0e1e2] font-bold text-2xl text-uppercase hidden xxsm:block text-center py-[20px]"
        to="/admin/index"
      >
        {t("admin")}
      </Link>
      <Nav navbar className="border-t-[1px] border-gray-300">
        {createLinks(routes)}
      </Nav>
    </div>
  );
};

export default Sidebar;
