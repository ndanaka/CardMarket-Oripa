import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import EmailVerification from "../../components/Others/EamilVerification";

import {
  CardBody,
  FormGroup,
  Form,
  Input,
  InputGroup,
} from "reactstrap";

const Register = () => {
  const [formData, setFormData] = useState({});
  const [strength, setStrength] = useState(""); //password strength
  const [isVisible, setIsVisible] = useState(false);
  const [isEmailVerifyPanel, setIsEmailVerifyPanel] = useState(false);
  const [showErrMessage, setShowErrMessage] = useState(false);

  const { t } = useTranslation();
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
        <div className="w-full md:w-2/5 bg-white shadow border-0 my-5 mx-auto rounded-lg">
          <CardBody className="px-lg-5 py-lg-5">
            <div className="text-center mb-5 font-bold text-3xl">
              {t("sign_up")}
            </div>
            <Form role="form">
              <FormGroup>
                <InputGroup className="input-group-alternative mb-1">
                  {/* <InputGroupAddon addonType="prepend">
                    <InputGroupText className="p-3 text-gray-500 rounded-r-none">
                      <i class="fa-solid fa-graduation-cap"></i>
                    </InputGroupText>
                  </InputGroupAddon> */}
                  <Input
                    placeholder={t("name")}
                    type="text"
                    name="name"
                    className={`border-[1px] ${
                      showErrMessage && !formData.name ? "is-invalid" : ""
                    }`}
                    value={formData.name}
                    onChange={handleChangeFormData}
                  />
                </InputGroup>
                {showErrMessage && !formData.name ? (
                  <span className="flex text-sm text-red-600">
                    <i class="fa-solid fa-triangle-exclamation text-red-600 mr-2"></i>
                    Name is Required
                  </span>
                ) : null}
              </FormGroup>
              <FormGroup className="mb-3">
                <InputGroup className="input-group-alternative mb-1">
                  {/* <InputGroupAddon addonType="prepend">
                    <InputGroupText className="p-3 text-gray-500 rounded-r-none">
                      <i className="fa-solid fa-envelope"></i>
                    </InputGroupText>
                  </InputGroupAddon> */}
                  <Input
                    placeholder={t("email")}
                    type="email"
                    name="email"
                    className={`border-[1px] ${
                      showErrMessage && !formData.email ? "is-invalid" : ""
                    }`}
                    value={formData.email}
                    autoComplete="new-email"
                    onChange={handleChangeFormData}
                  />
                </InputGroup>
                {showErrMessage && !formData.email ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2"></i>
                    "Email is Requried"
                  </span>
                ) : showErrMessage && !emailRegex.test(formData.email) ? (
                  <span className="flex text-sm text-red-600">
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2"></i>
                    "Email is Requried"
                  </span>
                ) : null}
              </FormGroup>
              <FormGroup>
                <InputGroup className="input-group-alternative mb-1">
                  {/* <InputGroupAddon addonType="prepend">
                    <InputGroupText className="p-3 text-gray-500 rounded-r-none">
                      <i className="fa-solid fa-unlock-keyhole"></i>
                    </InputGroupText>
                  </InputGroupAddon> */}
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
                    style={{ position: "absolute", right: "20px", top: "10px" }}
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
                    <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2"></i>
                    Password is Required
                  </span>
                ) : null}
              </FormGroup>

              <div className="flex justify-between items-center my-2">
                <div className="form-check form-check-inline">
                  <label className="form-check-label">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      name=""
                      id=""
                      value="checkedValue"
                    />
                    {t("policy_agree")}
                  </label>
                </div>
                <div className="flex items-center text-muted font-italic p-2 ">
                  <small>{t("password") + " " + t("strength")}:</small>
                  <p
                    className={`font-bold ml-2 ${
                      strength === "weak"
                        ? "text-red-500"
                        : strength === "medium"
                        ? "text-yellow-500"
                        : "text-green-500"
                    }`}
                  >
                    {strength && ` ${t(strength)}`}
                  </p>
                </div>
              </div>
              <div className="text-center mt-4">
                <button
                  className="button-22 mx-auto mt-2 w-full"
                  type="button"
                  onClick={emailVerify}
                >
                  {t("create_account")}
                </button>
                <a
                  className="text-light"
                  href="#pablo"
                  onClick={() => navigate("/auth/signin")}
                >
                  <div className="text-lg my-3 text-blue-500 hover:text-blue-700 outline outline-2 rounded-sm py-1">
                    {t("sign_in")}
                  </div>
                </a>
              </div>
            </Form>
          </CardBody>
        </div>
      )}
    </>
  );
};

export default Register;
