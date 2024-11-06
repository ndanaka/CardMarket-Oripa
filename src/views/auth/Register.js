import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CardBody, FormGroup, Form, Input, InputGroup } from "reactstrap";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import { bgColorAtom } from "../../store/theme";

import Spinner from "../../components/Others/Spinner";

const Register = () => {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const navigate = useNavigate();
  const [bgColor] = useAtom(bgColorAtom);
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const [strength, setStrength] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [showErrMessage, setShowErrMessage] = useState(false);
  const [checkTerms, setCheckTerms] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    email: "",
    password: "",
  });

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isFormValidate = () => {
    if (
      formData.name &&
      formData.email &&
      formData.password &&
      formData.country &&
      emailRegex.test(formData.email)
    )
      return true;
    else return false;
  };

  const handleChangeFormData = (e) => {
    if (e.target.name === "password") checkPasswordStrength(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    isFormValidate();
  };

  const emailVerify = () => {
    setShowErrMessage(true);
    if (!isFormValidate()) return;
    handleSubmit();
  };

  const handleSubmit = async () => {
    if (!isFormValidate()) return;
    if (!checkTerms) {
      showToast(t("termsWarnning"), "error");
      return;
    }

    const affId = localStorage.getItem("affId");
    if (affId) formData.affId = affId;
    const linkId = localStorage.getItem("linkId");
    if (linkId) formData.linkId = linkId;

    setSpinFlag(true);
    const res = await api.post("/user/register", formData);
    setSpinFlag(false);

    if (res.data.status === 1) {
      showToast(t(res.data.msg, "success"));
      navigate("/auth/login");
      localStorage.removeItem("affId");
      localStorage.removeItem("linkId");
      localStorage.removeItem("first");
    } else showToast(t(res.data.msg), "error");
  };

  const checkPasswordStrength = (password) => {
    let strengthLevel = "";

    if (password.length < 6) {
      strengthLevel = "weak";
    } else if (password.length >= 6 && password.length < 8) {
      const hasLetters = /[a-zA-Z]/.test(password);
      const hasNumbers = /\d/.test(password);
      if (hasLetters && hasNumbers) {
        strengthLevel = "medium";
      } else {
        strengthLevel = "weak";
      }
    } else {
      const hasUpperCase = /[A-Z]/.test(password);
      const hasLowerCase = /[a-z]/.test(password);
      const hasNumbers = /\d/.test(password);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(password);

      if (hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChars) {
        strengthLevel = "strong";
      } else {
        strengthLevel = "medium";
      }
    }

    setStrength(strengthLevel);
  };

  const changeCheckTerms = () => {
    setCheckTerms(!checkTerms);
  };

  return (
    <>
      {spinFlag && <Spinner />}
      <div>
        <div className="text-center m-3 font-bold text-2xl">{t("sign_up")}</div>
        <div className="w-full bg-white shadow border-0 my-4 mx-auto rounded-lg">
          <CardBody className="px-md-4 py-md-4 px-2 py-2">
            <div className="text-center mb-1 mt-3 font-bold text-xl">
              {t("sign_up_desc1")}
            </div>
            <div className="text-center mb-5 mt-3 text-lg">
              {t("sign_up_desc2")}
            </div>
            <Form role="form">
              <FormGroup>
                <p className="p-1 font-bold text-xs">{t("name")} *</p>
                <InputGroup className="input-group-alternative mb-1">
                  <Input
                    placeholder={t("name")}
                    type="text"
                    name="name"
                    className={`border-[1px] ${
                      showErrMessage && !formData.name ? "is-invalid" : ""
                    }`}
                    value={formData.name}
                    autoComplete="name"
                    onChange={handleChangeFormData}
                  />
                </InputGroup>
                {showErrMessage && !formData.name ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("requiredName")}
                  </span>
                ) : null}
              </FormGroup>
              <FormGroup>
                <p className="p-1 font-bold text-xs">{t("country")} *</p>
                <InputGroup className="input-group-alternative mb-1">
                  <Input
                    placeholder={t("country")}
                    type="text"
                    name="country"
                    className={`border-[1px] ${
                      showErrMessage && !formData.country ? "is-invalid" : ""
                    }`}
                    value={formData.country}
                    autoComplete="country"
                    onChange={handleChangeFormData}
                  />
                </InputGroup>
                {showErrMessage && !formData.country ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                    {t("country") + t("isRequired")}
                  </span>
                ) : null}
              </FormGroup>
              <FormGroup className="mb-3">
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
                    autoComplete="new-password"
                    onChange={handleChangeFormData}
                  />
                  <div
                    onClick={togglePasswordVisibility}
                    className="cursor-pointer"
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
                <div className="flex items-center text-muted font-italic justify-end">
                  <p
                    className={`font-bold ${
                      strength === "weak"
                        ? "text-red-500"
                        : strength === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {strength && `${t("strength")} : ${t(strength)}`}
                  </p>
                </div>
              </FormGroup>
              <div className="grid">
                <div className="form-check form-check-inline">
                  <label
                    htmlFor="checkboxTerms"
                    className="form-check-label flex items-center space-x-2"
                  >
                    <input
                      className="form-check-input text-lg cursor-pointer mr-2"
                      type="checkbox"
                      name="checkboxTerms"
                      id="checkboxTerms"
                      autoComplete="name"
                      value={checkTerms}
                      onChange={changeCheckTerms}
                    />
                    {currentLanguage === "en" ? (
                      <>
                        {t("accept")}{" "}
                        <button
                          className="text-blue-500"
                          onClick={() => navigate("/auth/terms")}
                        >
                          {t("terms")}
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          className="text-blue-500"
                          onClick={() => navigate("/auth/terms")}
                        >
                          {t("terms")}
                        </button>{" "}
                        {t("accept")}
                      </>
                    )}
                  </label>
                </div>
              </div>
              <div className="text-center mt-4 bt">
                <button
                  className="px-10 py-2 text-white rounded-md mx-auto mb-4 hover:opacity-50"
                  type="button"
                  onClick={emailVerify}
                  style={{ backgroundColor: bgColor }}
                >
                  {t("create_account")}
                </button>
                <hr className="my-1"></hr>
                <div className="flex flex-col mt-3">
                  <span className="text-lg">{t("haveAccount")}</span>
                  <button
                    className="text-light cursor-pointer"
                    onClick={() => navigate("/auth/signin")}
                  >
                    <div className="text-lg my-3 text-blue-500 hover:text-blue-700 py-1">
                      {t("sign_in")}
                    </div>
                  </button>
                </div>
              </div>
            </Form>
          </CardBody>
        </div>
      </div>
    </>
  );
};

export default Register;
