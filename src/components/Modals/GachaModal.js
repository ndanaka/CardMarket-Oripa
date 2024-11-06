import { useTranslation } from "react-i18next";
import formatPrice from "../../utils/formatPrice";

function GachaModal(props) {
  const {
    label,
    gachaName,
    price,
    draws,
    onDraw,
    totalNum,
    isOpen,
    setIsOpen,
  } = props;

  const { t } = useTranslation();

  const closeModal = () => {
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div
      id="modal"
      className={`w-full h-full flex bg-gray-600 bg-opacity-50 fixed top-0 left-0 z-50`}
    >
      <div className="bg-white rounded-xl shadow-xl shadow-gray-500 m-auto px-3 py-2 z-10 animate-[fadeIn_0.5s_ease-in-out]">
        <div className="flex justify-between">
          <div className="w-full text-2xl text-theme_text_color text-center pb-2">
            {t("drawGacha")}
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="flex flex-col p-2 text-theme_text_color text-center">
          <div className="w-full bg-gray-100 text-xl p-1">
            <div className="flex justify-between items-center p-2">
              <div className="text-gray-500 font-NanumGothic text-lg">
                {t("gacha") + " " + t("name")}:
              </div>
              <div className="text-gray-500 font-NanumGothic text-xl">
                {gachaName}
              </div>
            </div>
            <div className="flex justify-between items-center p-2">
              <div className="text-gray-500 font-NanumGothic text-lg">
                {t("consume") + " " + t("point")}:
              </div>
              <div className="text-gray-500 font-NanumGothic text-xl">
                {formatPrice(price * (draws === "all" ? totalNum : draws))}pt
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              className="bg-gray-600 hover:opacity-50 rounded-md mt-3 mr-3 text-center px-5 py-2 text-white outline-none"
              onClick={closeModal}
            >
              {t("cancel")}
            </button>
            <button
              className=" rounded-md mt-3 text-center px-5 py-2 hover:opacity-50 text-white outline-none"
              onClick={() => onDraw()}
              style={{ backgroundColor: props.bgColor }}
            >
              {label}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GachaModal;
