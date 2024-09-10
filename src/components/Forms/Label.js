import React from "react";
import { useTranslation } from "react-i18next";
function Label({ text, classname = "" }) {
  const {t} = useTranslation();
  return (
    <label
      className={`text-base text-gray-500 text-center font-Lexend ${classname}`}
    >
      {t(text)+":"}
    </label>
  );
}

export default Label;
