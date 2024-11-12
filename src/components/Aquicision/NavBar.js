import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import { bgColorAtom } from "../../store/theme";

const NavBar = ({ setNavItem, navItem }) => {
  const { t } = useTranslation();
  const [bgColor] = useAtom(bgColorAtom);

  return (
    <p className="text-[16px] w-full flex">
      <button
        onClick={() => setNavItem("notSelected")}
        className={`w-1/3 p-2 border-b-[1px] text-gray-400 ${
          navItem === "notSelected" && "border-b-[3px] text-gray-800"
        }`}
        style={{ borderColor: bgColor }}
      >
        {t("notSelected")}
      </button>
      <button
        onClick={() => setNavItem("awaiting")}
        className={`w-1/3 p-2 border-b-[1px] text-gray-400 ${
          navItem === "awaiting" && "border-b-[3px] text-gray-800"
        }`}
        style={{ borderColor: bgColor }}
      >
        {t("awaiting")}
      </button>
      <button
        onClick={() => setNavItem("shipped")}
        className={`w-1/3 p-2 border-b-[1px] text-gray-400 ${
          navItem === "shipped" && "border-b-[3px] text-gray-800"
        }`}
        style={{ borderColor: bgColor }}
      >
        {t("shipped")}
      </button>
    </p>
  );
};

export default NavBar;
