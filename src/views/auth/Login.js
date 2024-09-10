// reactstrap components
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import Cookies from "universal-cookie";
import { useAtom } from "jotai";
import { UserAtom } from "../../store/user";
import { showToast } from "../../utils/toastUtil";
import { useTranslation } from "react-i18next";
import {
  FormGroup,
  Form,
  Input,
  InputGroupAddon,
  InputGroupText,
  InputGroup,
} from "reactstrap";

const cookies = new Cookies();

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = useAtom(UserAtom);
  const [isVisible, setIsVisible] = useState(false);
  const { t } = useTranslation();

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
  };
  const navigate = useNavigate();
  const handleSubmit = (e) => {
    api
      .post("/user/login", {
        email,
        password,
      })
      .then((res) => {
        cookies.set("TOKEN", res.data.token, {
          path: "/",
        });
        if (res.data.status === 1) {
          showToast(res.data.msg);
          console.log("Login user----->", res.data.user);
          setUser(res.data.user);
          if (res.data.user.role == "admin") navigate("/admin/index");
          else navigate("/user/index");
        } else showToast(res.data.msg, "error");
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <>
      <div className="w-full md:w-3/6 mx-auto rounded-lg bg-white shadow border-0 my-5">
        
        <div className="bg-transparent py-3 mt-2">
          <div className="text-muted text-center pb-2">
            <small>{t("sign_in")}</small>
          </div>
          <div className="flex justify-center items-center text-center">
            {/* <div
              className="flex justify-center items-center rounded-md shadow-sm bg-gray-50 hover:bg-white shadow-gray-300 btn-neutral btn-icon mr-4 p-2"
              onClick={(e) => e.preventDefault()}
            >
              <span className="btn-inner--icon">
                <img
                  alt="..."
                  src={
                    require("../../assets/img/icons/common/github.svg").default
                  }
                />
              </span>
              <span className="btn-inner--text">Github</span>
            </div> */}
            <div
              className="flex justify-center items-center rounded-md shadow-sm bg-gray-50 hover:bg-white shadow-gray-300  btn-neutral btn-icon mr-4 p-2"
              color="default"
              href="#pablo"
              onClick={(e) => e.preventDefault()}
            >
              <span className="btn-inner--icon">
                <img
                  alt="..."
                  src={
                    require("../../assets/img/icons/common/google.svg").default
                  }
                />
              </span>
              <span className="btn-inner--text">Google</span>
            </div>
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="px-lg-5 py-lg-3">
          <div className="text-center text-muted mb-4">{t("sign_in")}</div>
          <Form role="form">
            <FormGroup className="mb-3">
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="p-3 text-gray-500 rounded-r-none">
                    <i className="fa-solid fa-envelope"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder={t("email")}
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </InputGroup>
            </FormGroup>
            <FormGroup>
              <InputGroup className="input-group-alternative">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText className="p-3 text-gray-500 rounded-r-none">
                    <i className="fa-solid fa-unlock-keyhole"></i>
                  </InputGroupText>
                </InputGroupAddon>
                <Input
                  placeholder={t("password")}
                  type={isVisible ? "text" : "password"}
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <div
                  onClick={togglePasswordVisibility}
                  style={{ position: "absolute", right: "20px", top: "10px" }}
                >
                  {isVisible ? (
                    <i className="fa fa-eye text-gray-500" />
                  ) : (
                    <i className="fa fa-eye-slash text-gray-500" />
                  )}
                </div>
              </InputGroup>
            </FormGroup>
            <div className="flex justify-between items-center mx-2 py-2">
              <div className="custom-control custom-control-alternative custom-checkbox">
                <input
                  className="custom-control-input"
                  id=" customCheckLogin"
                  type="checkbox"
                />
                <label
                  className="custom-control-label px-2"
                  htmlFor=" customCheckLogin"
                >
                  <span className="text-muted">{t("remember_me")}</span>
                </label>
              </div>
              <a
                className="text-gray-400"
                href="#pablo"
                onClick={(e) => e.preventDefault()}
              >
                <div className="text-base text-gray-500 underline-offset-1">
                  {t("forgot") + " " + t("password")}?
                </div>
              </a>
            </div>
            <div className="text-center">
              <button
                className="button-22 m-auto"
                type="button"
                onClick={(e) => handleSubmit(e)}
              >
                {t("sign_in")}
              </button>
              <a
                className="text-light"
                href="#pablo"
                onClick={() => navigate("/auth/register")}
              >
                <div className="text-lg my-2 text-blue-500 hover:text-blue-700 decoration-solid decoration-slate-600 decoration-1">
                  {t("create_account")}
                </div>
              </a>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
};

export default Login;
