import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { FormGroup, Form, Input, InputGroup } from "reactstrap";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import EmailVerification from "../../components/Others/EamilVerification";

import usePersistedUser from "../../store/usePersistedUser";

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [, setUser] = usePersistedUser();
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailVerifyPanel, setIsEmailVerifyPanel] = useState(false);
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [bgColor, setBgColor] = useState("");

  const { t } = useTranslation();
  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  useEffect(() => {
    setBgColor(localStorage.getItem("bgColor"));
  }, []);

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isFormValidate = () => {
    if (formData.email && formData.password && emailRegex.test(formData.email))
      return true;
    else return false;
  };

  const handleChangeFormData = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    isFormValidate();
  };

  const emailVerify = () => {
    setShowErrMessage(true);
    if (!isFormValidate()) return;
    handleSubmit();
    // setIsEmailVerifyPanel(true);
  };

  const handleSubmit = (e) => {
    api
      .post("/user/login", formData)
      .then((res) => {
        if (res.data.status === 1) {
          localStorage.setItem("token", res.data.token);
          localStorage.setItem("user", JSON.stringify(res.data.user));
          setUser(res.data.user);

          if (res.data.user.role === "admin") navigate("/admin/index");
          else navigate("/user/index");

          showToast(t(res.data.msg), "success");
        } else showToast(t(res.data.msg), "error");
      })
      .catch((error) => {
        error = new Error();
      });
  };

  return (
    <>
      {isEmailVerifyPanel ? (
        <EmailVerification
          email={formData.email}
          setIsEmailVerifyPanel={setIsEmailVerifyPanel}
        />
      ) : (
        <div className="w-full  mx-auto rounded-lg bg-white shadow border-0 my-5">
          <div className="p-lg-4 p-2">
            <div className="text-center mb-5 mt-3 font-bold text-2xl">
              {t("sign_in")}
            </div>
            <Form role="form">
              <FormGroup>
                <p className="p-1 font-bold text-xs">{t("email")} *</p>
                <InputGroup className="input-group-alternative mb-1">
                  <Input
                    placeholder={t("email")}
                    type="email"
                    name="email"
                    className={`border-[1px] ${
                      showErrMessage && !formData.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    autoComplete="email"
                    onChange={handleChangeFormData}
                  />
                </InputGroup>
                {showErrMessage && !formData.email ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("requiredEmail")}
                  </span>
                ) : showErrMessage && !emailRegex.test(formData.email) ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("requiredEmail")}
                  </span>
                ) : null}
              </FormGroup>
              <FormGroup>
                <p className="p-1 font-bold text-xs">{t("password")} *</p>
                <InputGroup className="input-group-alternative mb-1">
                  <Input
                    placeholder={t("password")}
                    type={isVisible ? "text" : "password"}
                    name="password"
                    className={`border-[1px] rounded-r-lg ${
                      showErrMessage && !formData.password ? "is-invalid" : ""
                    }`}
                    value={formData.password}
                    autoComplete="current-password"
                    onChange={handleChangeFormData}
                  />
                  <div
                    onClick={togglePasswordVisibility}
                    style={{
                      position: "absolute",
                      right: "20px",
                      top: "10px",
                    }}
                  >
                    {isVisible ? (
                      <i className="fa fa-eye text-gray-500" />
                    ) : (
                      <i className="fa fa-eye-slash text-gray-500" />
                    )}
                  </div>
                </InputGroup>
                {showErrMessage && !formData.password ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("requiredPwd")}
                  </span>
                ) : null}
              </FormGroup>
              <div className="flex flex-col text-center mt-10">
                <button
                  className="px-10 py-2 text-white rounded-md m-auto hover:opacity-50"
                  type="button"
                  onClick={emailVerify}
                  style={{ backgroundColor: bgColor }}
                >
                  {t("sign_in")}
                </button>
                <button
                  className="text-light"
                  onClick={() => navigate("/auth/forgotPass")}
                >
                  <div className="text-md my-3 text-blue-500 hover:text-blue-700 py-1">
                    {t("forgot_pass")}
                  </div>
                </button>
                <hr className="my-1"></hr>
                <div className="flex flex-col mt-3">
                  <span className="text-lg">{t("notHaveAccount")}</span>
                  <button
                    className="text-light cursor-pointer"
                    onClick={() => navigate("/auth/register")}
                  >
                    <div className="text-lg my-3 text-blue-500 hover:text-blue-700">
                      {t("sign_up_btn")}
                    </div>
                  </button>
                </div>
              </div>
            </Form>
          </div>
        </div>
      )}
    </>
  );
};

export default Login;
