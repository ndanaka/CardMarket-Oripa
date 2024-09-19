import React from "react";
import { useTranslation } from "react-i18next";

function GachaModal(props) {
  const { headerText, name, price, draws, onDraw, isOpen, setIsOpen } = props;
  const { t } = useTranslation();
  const closeModal = () => {
    setIsOpen(false);
  };

  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function (event) {
    var modal = document.getElementById("modal");
    if (event.target === modal) {
      setIsOpen(false);
    }
  };

  if (!isOpen) return null;
  
  return (
    <div
      id="modal"
      className={`w-full h-full flex bg-gray-600 bg-opacity-50 fixed top-0 left-0`}
    >
      <div className="bg-white rounded-xl shadow-xl shadow-gray-500  m-auto px-3 py-3 z-10 animate-[fadeIn_1s_ease-in-out]">
        <div className="flex justify-between">
          <div className="w-full text-2xl text-theme_text_color text-center py-2">
            {headerText}
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
                {name}
              </div>
            </div>
            <div className="flex justify-between items-center p-2">
              <div className="text-gray-500 font-NanumGothic text-lg">
                {t("draws")}:
              </div>
              <div className="text-gray-500 font-NanumGothic text-xl">
                {draws}
              </div>
            </div>
            <div className="flex justify-between items-center p-2">
              <div className="text-gray-500 font-NanumGothic text-lg">
                {t("consume") + " " + t("point")}:
              </div>
              <div className="text-gray-500 font-NanumGothic text-xl">
                {price * draws} pt
              </div>
            </div>
          </div>
          <div className="flex justify-end">
            <button
              id="marksBtn"
              className="bg-indigo-600 rounded-md mt-3 mr-3 text-center px-5 py-2 hover:bg-indigo-700 text-white outline-none"
              onClick={closeModal}
            >
              {t("cancel")}
            </button>
            <button
              id="closeBtn"
              className="bg-theme_color rounded-md mt-3 text-center px-5 py-2 hover:bg-red-700 text-white outline-none"
              onClick={() => onDraw()}
            >
              {t("draw")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GachaModal;
