import { useTranslation } from "react-i18next";

function NotEnoughPoints(props) {
  const { t } = useTranslation();
  const { headerText, bodyText, okBtnClick, isOpen, setIsOpen } = props;

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <div
      id="modal"
      className={`fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-20 ${
        isOpen ? "" : "hidden"
      }`}
    >
      <div className="w-2/5 bg-white rounded-xl shadow-xl shadow-gray-500 m-auto p-2 z-10 animate-[fadeIn_0.5s_ease-in-out]">
        <div className="flex justify-between">
          <div className="w-full text-2xl text-theme_text_color text-center py-2">
            {headerText}
          </div>
        </div>
        <hr className="w-full"></hr>
        <div className="flex flex-col p-1 text-theme_text_color text-center">
          <div className="w-full flex flex-col justify-between text-xl p-3">
            {bodyText}
          </div>
          <button
            className="px-5 py-2 mx-2 my-2 text-white text-center rounded-md hover:opacity-50"
            onClick={okBtnClick}
            style={{ backgroundColor: props.bgColor }}
          >
            {t("purchasePoints")}
          </button>
          <button
            className="mx-2 px-5 py-2 text-center text-white rounded-md bg-gray-600 hover:opacity-50"
            onClick={closeModal}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotEnoughPoints;
