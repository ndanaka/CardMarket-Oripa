import { useTranslation } from "react-i18next";

const PuchaseSpinner = () => {
  const { t } = useTranslation();

  return (
    <div className="fixed flex inset-0 justify-center items-center bg-white flex-col z-[100]">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite] m-2"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      <span className="font-bold text-lg mx-2">{t("successPurchasePoint")}</span>
      <span className="font-bold text-lg mx-2">{t("successPurchasePoint1")}</span>
    </div>
  );
};

export default PuchaseSpinner;
