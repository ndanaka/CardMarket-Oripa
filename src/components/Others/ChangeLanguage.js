import { useState } from "react";
import { useTranslation } from "react-i18next";

import usePersistedUser from "../../store/usePersistedUser";

import enFlag from "../../assets/img/icons/en.png";
import jpFlag from "../../assets/img/icons/jp.png";

function ChangeLanguage() {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = usePersistedUser();
  const currentLanguage = i18n.language; //current language

  const languages = [
    { code: "jp", name: "日本語", flag: jpFlag },
    { code: "en", name: "English", flag: enFlag },
  ];

  const changeLanguage = (lang) => {
    setIsOpen(false);
    i18n.changeLanguage(lang);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const getCurrentFlag = () => {
    const currentLang = languages.find((lang) => lang.code === currentLanguage);
    return currentLang ? currentLang.flag : enFlag;
  };

  return (
    <div className="relative inline-block">
      <button
        onClick={toggleDropdown}
        className="flex items-center px-2 py-1 border rounded-lg cursor-pointer"
      >
        <img
          src={getCurrentFlag()}
          alt="current flag"
          className="w-5 h-5 mr-2"
        />
        <span className="text-white hidden xsm:block">
          {currentLanguage === "en" ? "English" : "日本語"}
        </span>
        {isOpen ? (
          <i className="fa fa-caret-up ml-2 mt-2 text-white"></i>
        ) : (
          <i className="fa fa-caret-down ml-2 text-white"></i>
        )}
      </button>

      {isOpen && (
        <ul
          className={`absolute top-full right-0 mt-1 border rounded-lg ${
            user?.role === "admin" ? "bg-[#32629e]" : "bg-[#c30000]"
          } shadow-lg z-10 w-[100px]`}
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`flex items-center p-2 cursor-pointer rounded-lg ${
                user?.role === "admin"
                  ? "hover:bg-blue-400"
                  : "hover:bg-red-400"
              }`}
              onClick={() => changeLanguage(lang.code)}
            >
              <img
                src={lang.flag}
                alt={`${lang.name} flag`}
                className="w-5 h-5 mr-2"
              />
              <span className="text-white text-sm">{lang.name}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChangeLanguage;
