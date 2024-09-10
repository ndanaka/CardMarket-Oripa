import React from "react";
import {
  useLocation,
  Route,
  Routes,
  Navigate,
  useNavigate,
} from "react-router-dom";
// reactstrap components
import { Container } from "reactstrap";
// core components
import UserNavbar from "../components/Navbars/UserNavbar.js";
import Footer from "../components/Footers/Footer.js";
import useAxiosInterceptor from "../utils/AxiosInterceptors.js";
import routes from "../routes.js";

import Cookies from "universal-cookie";
const cookies = new Cookies();

const UserLayout = (props) => {
  const mainContent = React.useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { isLoggedOut } = useAxiosInterceptor();

  React.useEffect(() => {
    if (isLoggedOut) navigate("/auth/login");
    document.documentElement.scrollTop = 0;
    document.scrollingElement.scrollTop = 0;
    mainContent.current.scrollTop = 0;
  }, [location]);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/user") {
        const token = cookies.get("TOKEN");
        if (prop.path === "/user-profile" && !token)
          return (
            <Route
              path={prop.path}
              element={<Navigate to="/auth/login" replace />}
            />
          );
        else
          return (
            <Route path={prop.path} element={prop.component} key={key} exact />
          );
      } else {
        return null;
      }
    });
  };

  const getBrandText = (path) => {
    for (let i = 0; i < routes.length; i++) {
      if (
        props?.location?.pathname.indexOf(routes[i].layout + routes[i].path) !==
        -1
      ) {
        return routes[i].name;
      }
    }
    return "Brand";
  };

  return (
    <>
      <div
        className="relative flex flex-col justify-between h-full w-full main-content"
        ref={mainContent}
      >
        <UserNavbar
          {...props}
          brandText={getBrandText(props?.location?.pathname)}
        />
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/user/index" replace />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
};

export default UserLayout;
