import React from "react";
import { useEffect } from "react";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import ImailVerifyImg from "../../assets/img/icons/common/check-email.svg";

const EmailVerification = ({ email, password, setIsEmailVerifyPanel }) => {
  useEffect(() => {
    // sendEmail();
  }, []);

  const sendEmail = () => {
    api
      .post("mail/gmail-send", { email: email, password: password })
      .then((res) => {
        if (res.data.status === 1) showToast("Email send success.");
        else showToast("Email send Failed");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full flex flex-col items-center justify-center py-5 bg-white">
      <img
        src={ImailVerifyImg}
        alt="Verification"
        className="w-32 h-auto mb-6"
      />
      <h1 className="text-red-600 text-3xl font-bold mb-4">
        Email Verification
      </h1>
      <p className="text-gray-700 text-lg text-center mb-6">
        Please check your email and click the verification link to verify your
        account.
      </p>
      <p className="py-3 text-gray-700 text-lg text-center">{email}</p>
      <button
        className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
        onClick={sendEmail}
      >
        Resend Verification Email
      </button>
      <p
        className="text-blue-500 text-base text-center py-3 cursor-pointer"
        onClick={() => setIsEmailVerifyPanel(false)}
      >
        Choose another email
      </p>
    </div>
  );
};

export default EmailVerification;
