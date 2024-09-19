import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormGroup, Form, Input, InputGroup } from "reactstrap";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import usePersistedUser from "../../store/usePersistedUser";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [, setUser] = usePersistedUser();
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
        if (res.data.status === 1) {
          showToast(res.data.msg);
          setUser(res.data.user);
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));

          if (res.data.user.role === "admin") navigate("/admin/index");
          else navigate("/user/index");
        } else showToast(res.data.msg, "error");
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <div className="w-full md:w-2/5 mx-auto rounded-lg bg-white shadow border-0 my-5">
      <div className="px-lg-5 py-lg-5">
        <div className="text-center mb-5 font-bold text-3xl">
          {t("sign_in")}
        </div>
        <Form role="form">
          <FormGroup className="mb-3">
            <InputGroup className="input-group-alternative">
              {/* <InputGroupAddon addonType="prepend">
                <InputGroupText className="p-3 text-gray-500 rounded-r-none">
                  <i className="fa-solid fa-envelope"></i>
                </InputGroupText>
              </InputGroupAddon> */}
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
              {/* <InputGroupAddon addonType="prepend">
                <InputGroupText className="p-3 text-gray-500 rounded-r-none">
                  <i className="fa-solid fa-unlock-keyhole"></i>
                </InputGroupText>
              </InputGroupAddon> */}
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
          <div className="flex justify-between items-center my-2">
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
          <div className="text-center mt-10">
            <button
              className="button-22 m-auto w-full"
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
              <div className="text-lg my-3 text-blue-500 hover:text-blue-700 outline outline-2 rounded-sm py-1">
                {t("create_account")}
              </div>
            </a>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Login;
