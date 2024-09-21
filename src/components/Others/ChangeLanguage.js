import React from "react";
import { useTranslation } from "react-i18next";

function ChangeLanguage() {
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language; //current language

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex">
      <div className="flex form-group">
        <label htmlFor="selLanguage">
          <i className="fa-solid fa-language text-2xl mr-2"></i>
        </label>
        <select
          className="form-control form-control-sm w-32 cursor-pointer"
          name="selLanguage"
          id="selLanguage"
          onChange={(e) => changeLanguage(e.currentTarget.value)}
          value={currentLanguage}
        >
          <option value="en" className="p-2">
            English
          </option>
          <option value="jp" className="p-2">
            Japanese
          </option>
        </select>
      </div>
    </div>
  );
}

export default ChangeLanguage;
