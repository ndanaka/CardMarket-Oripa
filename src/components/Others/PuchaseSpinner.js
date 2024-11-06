import { useTranslation } from "react-i18next";

const PuchaseSpinner = () => {
  const { t } = useTranslation();

  return (
    <div className="absolute inset-0 flex justify-center items-center bg-white z-20 flex flex-col">
      <div
        className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
        role="status"
      >
        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
          Loading...
        </span>
      </div>
      <p className="font-bold text-lg m-2">{t("successPurchasePoint")}</p>
    </div>
  );
};

export default PuchaseSpinner;
