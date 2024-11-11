import { useEffect, useRef, useCallback } from "react";

import formatDate from "../../utils/formatDate";
import formatPrice from "../../utils/formatPrice";
import { useTranslation } from "react-i18next";

function Pointlog({ date, point_num, usage, ioFlag }) {
  const remain_point = useRef(0);
  const { t } = useTranslation();

  useEffect(() => {
    calcRemainPoint();
  }, [point_num]);

  const calcRemainPoint = useCallback(() => {
    if (ioFlag === 1) remain_point.current += point_num;
    else remain_point.current -= point_num;
  }, [point_num]);

  return (
    <div className="flex flex-col bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 py-2 px-4 m-1">
      <small className="font-Inter">{formatDate(date)}</small>
      <div className="flex justify-between items-center">
        {ioFlag === 1 ? (
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
