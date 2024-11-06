import { useTranslation } from "react-i18next";

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, bgColor }) => {
  const { t } = useTranslation();
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-8 rounded shadow-lg">
        <p className="text-center text-xl font-bold mb-3">{t("confirm")}</p>
        <p className="text-center text-md m-4">{t("del_confirm")}</p>
        <div className="flex justify-center">
          <button
            className="mr-6 bg-gray-600 hover:bg-opacity-50 text-white py-2 px-4 rounded"
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            className="hover:opacity-50 text-white py-2 px-4 rounded"
            onClick={onConfirm}
            style={{ backgroundColor: bgColor ? bgColor : "#dc3545" }}
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
};
export default DeleteConfirmModal;
