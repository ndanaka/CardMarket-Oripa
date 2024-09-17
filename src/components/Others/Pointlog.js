import { useEffect, useRef, useCallback } from "react";
import formatDate from "../../utils/formatDate";
function Pointlog({ date, point_num, usage, ioFlag }) {
  const remain_point = useRef(0);
  useEffect(() => {
    calcRemainPoint();
  }, [point_num]);

  const calcRemainPoint = useCallback(() => {
    if (ioFlag === 1) remain_point.current += point_num;
    else remain_point.current -= point_num;
  }, [point_num]);
  return (
    <div className="flex flex-col bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 py-2 px-4">
      <small className="font-Inter">{formatDate(date)}</small>
      <div className="flex justify-between items-center">
        {ioFlag === 1 ? (
          <div className="text-base text-blue-600"> + {point_num}</div>
        ) : (
          <div className="text-base text-red-600"> - {point_num}</div>
        )}
        {/* <div>{remain_point.current}</div> */}
        <div>{usage}</div>
      </div>
    </div>
  );
}

export default Pointlog;
