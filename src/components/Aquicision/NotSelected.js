import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import { bgColorAtom } from "../../store/theme";

import Card from "./Card";

const NotSelected = ({ prizes }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bgColor] = useAtom(bgColorAtom);

  return (
    <>
      <p className="py-2">{t("selectProducts")}</p>
      <div className="card-list overflow-auto py-2"></div>
      <div
        className="rounded-md hover:opacity-50 flex flex-col items-center hover:bg-opacity-50 text-white outline-none w-full cursor-pointer p-2"
        style={{ backgroundColor: bgColor }}
        onClick={() => {
          // navigate("/user/purchasePoint");
        }}
      >
        {t("allReturn")}
        <div className="flex flex-wrap justify-between items-center">
          <img
            alt="pointImg"
            src={require("../../assets/img/icons/coin.png")}
            className="text-center w-6"
          />
          <p className="px-2">200</p>
        </div>
      </div>
    </>
  );
};

export default NotSelected;
