import { useEffect } from "react";
import { Container, Row } from "reactstrap";

import { Route, Routes, Navigate } from "react-router-dom";

// core components
import AuthNavbar from "../components/Navbars/AuthNavbar.js";
import AuthFooter from "../components/Footers/Footer.js";

import routes from "../routes.js";

const Auth = () => {
  useEffect(() => {
    document.body.classList.add("bg-default");
    return () => {
      document.body.classList.remove("bg-default");
    };
  }, []);

  const getRoutes = (routes) => {
    return routes.map((prop, key) => {
      if (prop.layout === "/auth") {
        return (
          <Route path={prop.path} element={prop.component} key={key} exact />
        );
      } else {
        return null;
      }
    });
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-gray-100">
      <AuthNavbar />
      <Container className="flex-grow bg-[#f3f4f6] py-3 mx-auto md:w-3/5 lg:w-2/5 mt-16">
        <Routes>
          {getRoutes(routes)}
          <Route path="*" element={<Navigate to="/auth/login" replace />} />
        </Routes>
      </Container>
      <AuthFooter />
    </div>
  );
};

export default Auth;
