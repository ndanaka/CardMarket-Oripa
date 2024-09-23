import { useTranslation } from "react-i18next";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded shadow-lg">
        <div className="flex justify-around items-center">
          <img
            src={require("../../assets/img/icons/alert/alert.png")}
            width="60"
            height="60"
            alt="img"
            className="mx-auto mb-3"
          ></img>
          <h4 className="text-lg mb-3">{t("confirm")}</h4>
        </div>
        <h2 className="mb-5">{t("del_confirm")}</h2>
        <div className="flex justify-center">
          <button
            className="mr-6 bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded"
            onClick={onConfirm}
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmModal;
