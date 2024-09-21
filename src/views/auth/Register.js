import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { CardBody, FormGroup, Form, Input, InputGroup } from "reactstrap";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import EmailVerification from "../../components/Others/EamilVerification";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [strength, setStrength] = useState(""); //password strength
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailVerifyPanel, setIsEmailVerifyPanel] = useState(false);
  const [showErrMessage, setShowErrMessage] = useState(false);

  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const navigate = useNavigate();

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const togglePasswordVisibility = () => {
    setIsVisible(!isVisible);
  };

  const isFormValidate = () => {
    if (
      formData.name &&
      formData.email &&
      formData.password &&
      emailRegex.test(formData.email)
    )
      return true;
    else return false;
  };

  const handleChangeFormData = (e) => {
    if (e.target.name == "password") checkPasswordStrength(e.target.value);
    setFormData({ ...formData, [e.target.name]: e.target.value });
    isFormValidate();
  };

  const emailVerify = () => {
    setShowErrMessage(true);
    if (!isFormValidate()) return;
    handleSubmit();
    // setIsEmailVerifyPanel(true);
  };

  const handleSubmit = () => {
    if (!isFormValidate()) return;
    api
      .post("/user/register", formData)
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Registered successfully.");
          navigate("/auth/login");
        } else showToast(res.data.msg, "error");
      })
      .catch((error) => {
        error = new Error();
      });
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

  return (
    <>
      {isEmailVerifyPanel ? (
        <EmailVerification
          email={formData.email}
          setIsEmailVerifyPanel={setIsEmailVerifyPanel}
        />
      ) : (
        <div>
          <div className="text-center m-3 font-bold text-2xl">
            {t("sign_up")}
          </div>
          <div className="w-full md:w-2/5 bg-white shadow border-0 my-4 mx-auto rounded-lg">
            <CardBody className="px-lg-4 py-lg-4">
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
                      <i class="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      Name is Required
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
                      "Email is Requried"
                    </span>
                  ) : showErrMessage && !emailRegex.test(formData.email) ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      "Email is Requried"
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
                      Password is Required
                    </span>
                  ) : null}
                  <div className="flex items-center text-muted font-italic">
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
                  <div className="form-check form-check-inline m-1">
                    <label htmlFor="checkboxTerms" className="form-check-label">
                      <input
                        className="form-check-input text-lg"
                        type="checkbox"
                        name="checkboxTerms"
                        id="checkboxTerms"
                        autoComplete="name"
                        value="checkedValue"
                      />
                      {currentLanguage === "en" ? (
                        <>
                          {t("accept")}{" "}
                          <a href="/terms" className="text-blue-500">
                            {t("terms")}
                          </a>
                        </>
                      ) : (
                        <>
                          <a href="/terms" className="text-blue-500">
                            {t("terms")}
                          </a>{" "}
                          {t("accept")}
                        </>
                      )}
                    </label>
                  </div>
                  <div className="form-check form-check-inline m-1">
                    <label
                      htmlFor="checkboxPolicy"
                      className="form-check-label"
                    >
                      <input
                        className="form-check-input text-lg"
                        type="checkbox"
                        name="checkboxPolicy"
                        id="checkboxPolicy"
                        autoComplete="name"
                        value="checkedValue"
                      />
                      {currentLanguage === "en" ? (
                        <>
                          {t("agree")}{" "}
                          <a href="/privacy" className="text-blue-500">
                            {t("privacy")}
                          </a>
                        </>
                      ) : (
                        <>
                          <a href="/privacy" className="text-blue-500">
                            {t("privacy")}
                          </a>{" "}
                          {t("agree")}
                        </>
                      )}
                    </label>
                  </div>
                </div>
                <div className="text-center mt-4 bt">
                  <button
                    className="button-22 mx-auto mt-2 mb-4"
                    type="button"
                    onClick={emailVerify}
                  >
                    {t("create_account")}
                  </button>
                  <hr className="my-1"></hr>
                  <div className="mt-3">
                    <span className="text-lg">{t("haveAccount")}</span>
                    <a
                      className="text-light cursor-pointer"
                      onClick={() => navigate("/auth/signin")}
                    >
                      <div className="text-lg my-3 text-blue-500 hover:text-blue-700 py-1">
                        {t("sign_in")}
                      </div>
                    </a>
                  </div>
                </div>
              </Form>
            </CardBody>
          </div>
        </div>
      )}
    </>
  );
};

export default Register;
