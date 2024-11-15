import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";

import usePersistedUser from "../../store/usePersistedUser";

import Pointlog from "../../components/Others/Pointlog";
import Spinner from "../../components/Others/Spinner";

function PointLog() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();

  const [pointLog, setPointLog] = useState();
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setAuthToken();
    getPointLog();
  }, []);

  const getPointLog = async () => {
    setSpinFlag(true);
    const res = await api.get(`/user/get_point_log/${user?._id}`);
    setSpinFlag(false);

    if (res.data.status === 1) setPointLog(res.data.pointLog);
  };

  return (
    <div className="flex flex-grow">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-2/3 lg:w-1/2 p-3 mx-auto">
        <div className="w-full py-2">
          <div className="text-center text-xl text-slate-600">
            <i
              className="fa fa-chevron-left mt-1.5 float-left items-center cursor-pointer"
              onClick={() => navigate(-1)}
            ></i>
            {t("pointsHistory")}
          </div>
          <hr className="w-full my-2"></hr>
        </div>
        <div className="flex flex-col">
          {pointLog?.length > 0
            ? pointLog.map((data, i) => (
                <div key={i}>
                  <Pointlog
                    date={data.createdAt}
                    point_num={data.point_num}
                    usage={data.usage}
                  />
                </div>
              ))
            : null}
        </div>
      </div>
    </div>
  );
}

export default PointLog;
