import React from "react";
import { useTranslation } from "react-i18next";
function ChangeLanguage() {
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;  //current language

  const changeLanguage = (lng) => {
    // console.log("changelanguage lng--->", lng);
    i18n.changeLanguage(lng);
  };
  return (
    <div className="flex">
      <div class="flex form-group">
        
        <label htmlFor="selLanguage"><i className="fa-solid fa-language text-2xl mr-2"></i></label>
        <select
          class="form-control form-control-sm w-32"
          name="selLanguage"
          id="selLanguage"
          onChange={(e) => changeLanguage(e.currentTarget.value)}
        >
          <option value="en" className="p-2" selected={currentLanguage === "en"}>
            English
          </option>
          <option value="jp" className="p-2" selected={currentLanguage === "jp"}>
            Japanese
          </option>
        </select>
      </div>
    </div>
  );
}

export default ChangeLanguage;
