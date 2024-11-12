import formatDate from "../../utils/formatDate";
import formatPrice from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";

function Pointlog({ date, point_num, usage }) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 py-2 px-4 m-1">
      <small className="font-Inter">{formatDate(date)}</small>
      <div className="flex justify-between items-center">
        {usage === "purchasePoints" ? (
          <div className="text-base text-blue-600">
            {" "}
            + {formatPrice(point_num)} pt
          </div>
        ) : (
          <div className="text-base text-red-600">
            {" "}
            - {formatPrice(point_num)} pt
          </div>
        )}
        <div>{t(usage)}</div>
      </div>
    </div>
  );
}

export default Pointlog;
