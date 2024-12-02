import { useTranslation } from "react-i18next";

function SpecialLaw() {
  const { t } = useTranslation();

  return (
    <div className="flex-grow w-full md:w-4/6 p-3 mx-auto mt-16">
      <div className="flex flex-wrap mb-2">
        <div className=" border-l-[6px] border-blue-500"></div>
        <p className="text-3xl text-center text-gray-700 font-Lexend font-extrabold pl-4">
          {t("specialLaw")}
        </p>
      </div>
      <div className="border-1 border-gray-300 p-4 flex flex-col">
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("seller")} : </p>
          <p className="text-lg px-1">{t("seller1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("manager")} : </p>
          <p className="text-lg px-1">{t("manager1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("postal_code")} : </p>
          <p className="text-lg px-1">{"153-0064"}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("rawAddress")} : </p>
          <p className="text-lg px-1">{t("rawAddress1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("shippingFee")} : </p>
          <p className="text-lg px-1">{t("shippingFee1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("deliveryTime")} : </p>
          <p className="text-lg px-1">{t("deliveryTime1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("payMethod")} : </p>
          <p className="text-lg px-1">{t("payMethod1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("returnDeadline")} : </p>
          <p className="text-lg px-1">{t("returnDeadline1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("returnFee")} : </p>
          <p className="text-lg px-1">{t("returnFee1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("qualiLicense")} : </p>
          <p className="text-lg px-1">{t("qualiLicense1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("serviceName")} : </p>
          <p className="text-lg px-1">{t("serviceName1")}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("phone")} : </p>
          <p className="text-lg px-1">{"05088895361"}</p>
        </div>
        <div className="flex flex-wrap py-1">
          <p className="text-lg font-bold px-1">- {t("email")} : </p>
          <p className="text-lg px-1">{"info@on-gacha.com"}</p>
        </div>
      </div>
    </div>
  );
}

export default SpecialLaw;
