import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

import enFlag from "../../assets/img/icons/en.png";
import jpFlag from "../../assets/img/icons/jp.png";
import chFlag from "../../assets/img/icons/ch.png";
import vnFlag from "../../assets/img/icons/vn.png";

function ChangeLanguage({ type }) {
  const { i18n } = useTranslation();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);
  const currentLanguage = i18n.language;

  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: "jp", name: "日本語", flag: jpFlag },
    { code: "ch1", name: "中文（简体)", flag: chFlag },
    { code: "ch2", name: "中文（繁體)", flag: chFlag },
    { code: "vn", name: "Tiếng Việt", flag: vnFlag },
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
    return currentLang ? currentLang.flag : jpFlag;
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
          className="w-5 h-4 mr-2"
        />
        <span
          className={`${
            type === "menu" ? "text-gray" : "text-white"
          } hidden xsm:block`}
        >
          {languages.find((lang) => lang.code === currentLanguage).name}
        </span>
        {isOpen ? (
          <i
            className={`fa fa-caret-up ml-2 mt-2 ${
              type === "menu" ? "text-gray" : "text-white"
            }`}
          ></i>
        ) : (
          <i
            className={`fa fa-caret-down ml-2 ${
              type === "menu" ? "text-gray" : "text-white"
            }`}
          ></i>
        )}
      </button>
      {isOpen && (
        <ul
          className={`absolute top-full right-0 mt-1 border-1 border-gray-300 rounded-lg shadow-lg z-10 w-[130px] ${
            type === "menu"
              ? "bg-gray-200"
              : type !== "menu" && user?.role === "admin"
              ? "bg-[#26619c]"
              : "bg-[${bgColor}] hover:bg-gray-300"
          }`}
          style={{
            backgroundColor:
              type === "menu"
                ? "bg-gray-200"
                : type !== "menu" && user?.role === "admin"
                ? "#26619c"
                : bgColor,
          }}
        >
          {languages.map((lang) => (
            <li
              key={lang.code}
              className={`flex items-center p-2 cursor-pointer rounded-lg hover:opacity-50`}
              style={{
                backgroundColor:
                  type === "menu"
                    ? "bg-gray-200"
                    : type !== "menu" && user?.role === "admin"
                    ? "#26619c"
                    : bgColor,
              }}
              onClick={() => changeLanguage(lang.code)}
            >
              <img
                src={lang.flag}
                alt={`${lang.name} flag`}
                className="w-5 h-4 mr-2"
              />
              <span
                className={`${
                  type === "menu" ? "text-gray" : "text-white"
                } text-sm`}
              >
                {lang.name}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default ChangeLanguage;
