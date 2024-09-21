import { useNavigate } from "react-router-dom";
import { Row, Col, Nav, NavItem } from "reactstrap";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="w-full bg-theme_color py-3 px-4 relative z-10">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-white float-left">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1 text-red-900"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="text-gray-200">Operating Company</span>
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end text-white">
            <NavItem>
              <div className="py-1 px-3 hover:cursor-pointer">
                <span
                  className="text-white"
                  onClick={() => navigate("/auth/guide")}
                >
                  {t("user") + " " + t("guide")}
                </span>
              </div>
            </NavItem>

            <NavItem>
              <div className="py-1 px-3 hover:cursor-pointer">
                <span
                  className="text-white"
                  onClick={() => navigate("/auth/about-us")}
                >
                  {t("aboutus")}
                </span>
              </div>
            </NavItem>

            <NavItem>
              <div className="py-1 px-3 hover:cursor-pointer">
                <span
                  className="text-white"
                  onClick={() => navigate("/auth/blog")}
                >
                  {t("blog")}
                </span>
              </div>
            </NavItem>

            <NavItem>
              <div className="py-1 px-3 hover:cursor-pointer">
                <span
                  className="text-white hover:underline-offset-2"
                  onClick={() => navigate("/auth/lisence")}
                >
                  {t("license")}
                </span>
              </div>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
