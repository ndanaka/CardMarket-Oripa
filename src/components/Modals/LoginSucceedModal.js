import { useTranslation } from "react-i18next";

function LoginSucceedModal({ isOpen, setIsOpen }) {
  const { t } = useTranslation();

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
      <div className="bg-white p-3 rounded shadow-lg">
        <div className="flex justify-around items-center">
          <h4 className="text-lg my-4 mx-8">{t("successLogin")}</h4>
        </div>
        <div>
          <button
            className="mr-6 hover:opacity-50 bg-blue-700 text-white py-2 px-4 rounded w-full"
            onClick={closeModal}
          >
            {t("ok")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginSucceedModal;
