import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

import { bgColorAtom } from "../../store/theme";

function CheckShippingModal({ isOpen, setIsOpen, text }) {
  const { t } = useTranslation();
  const [bgColor] = useAtom(bgColorAtom);
  const navigate = useNavigate();

  const closeModal = () => {
    setIsOpen(false);
    localStorage.removeItem("loggedIn");
  };

  return (
    <div
      className={`${
        isOpen ? "" : "hidden"
      } fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-20`}
    >
      <div className="bg-white p-3 rounded shadow-lg w-full xxsm:w-[400px] mx-4 md:mx-0">
        <div className="flex justify-around items-center">
          <h4 className="text-lg my-4 mx-8">{text}</h4>
        </div>
        <div>
          <button
            className="hover:opacity-50 px-4 py-2 my-1 text-white rounded w-full outline-none"
            onClick={() => navigate("/user/changeShippingAddress")}
            style={{ backgroundColor: bgColor }}
          >
            {t("setShippingAddress")}
          </button>
          <button
            className="hover:opacity-50 py-2 px-4 mt-1 text-white rounded w-full outline-none bg-gray-600"
            onClick={closeModal}
          >
            {t("cancel")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CheckShippingModal;
