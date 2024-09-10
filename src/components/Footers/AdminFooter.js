import { Container, Row, Col, Nav, NavItem, NavLink } from "reactstrap";

const Footer = () => {
  return (
    <div className="w-full p-3 bg-theme_color">
      <Row className="align-items-center justify-content-xl-between">
        <Col xl="6">
          <div className="copyright text-center text-xl-left text-white">
            © {new Date().getFullYear()}{" "}
            <a
              className="font-weight-bold ml-1 text-red-900"
              href="#"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="text-white text-lg underline hover:text-red-200 font-NanumGothic">
                Oripa Company
              </span>
            </a>
          </div>
        </Col>

        <Col xl="6">
          <Nav className="nav-footer justify-content-center justify-content-xl-end text-white">
            <NavItem>
              <NavLink href="#" rel="noopener noreferrer" target="_blank">
                <span className="text-white">Simple Guide</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" rel="noopener noreferrer" target="_blank">
                <span className="text-white">About Us</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" rel="noopener noreferrer" target="_blank">
                <span className="text-white">Blog</span>
              </NavLink>
            </NavItem>

            <NavItem>
              <NavLink href="#" rel="noopener noreferrer" target="_blank">
                <span className="text-white">MIT License</span>
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
    </div>
  );
};

export default Footer;
