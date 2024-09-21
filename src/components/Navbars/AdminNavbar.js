import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownItem,
  UncontrolledDropdown,
  DropdownToggle,
  Nav,
  Media,
} from "reactstrap";

import { setAuthToken } from "../../utils/setHeader";
import api from "../../utils/api";

import usePersistedUser from "../../store/usePersistedUser";

import LoginImg from "../../assets/img/icons/login.png";
import "../../assets/css/index.css";
import { showToast } from "../../utils/toastUtil";

const AdminNavbar = (props) => {
  const [user, setUser] = usePersistedUser();
  const navigate = useNavigate();

  useEffect(() => {
    updateUserData();
  }, []);

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
          <div>
            <Link
              className="h4 mb-0 text-[#e0e1e2] text-uppercase hidden xxsm:block"
              to="/"
            >
              Dashboard
            </Link>
            <div className="text-white text-2xl xxsm:hidden">
              <i className="fa fa-navicon"></i>
            </div>
          </div>
          <Nav className="flex" navbar>
            {user.name ? (
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
                      <span className="mb-0 text-sm font-weight-bold px-2">
                        {user.name}
                      </span>
                    </div>
                  </DropdownToggle>
                  <DropdownMenu className="dropdown-menu-arrow" end>
                    <DropdownItem className="noti-title" header tag="div">
                      <h6 className="text-overflow m-0">Welcome!</h6>
                    </DropdownItem>
                    <DropdownItem to="/admin/index" tag={Link}>
                      <i className="ni ni-single-02" />
                      <span>Admin Panel</span>
                    </DropdownItem>

                    <DropdownItem divider />
                    <DropdownItem href="#pablo" onClick={() => logout()}>
                      <i className="ni ni-user-run" />
                      <span>Logout</span>
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              </div>
            ) : (
              <Media>
                <img src={LoginImg} onClick={nav_login}></img>
              </Media>
            )}
          </Nav>
        </div>
      </div>
    </div>
  );
};

export default AdminNavbar;
