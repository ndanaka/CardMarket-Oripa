import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";

import usePersistedUser from "../../store/usePersistedUser";

import SubHeader from "../../components/Forms/SubHeader";
import Pointlog from "../../components/Others/Pointlog";
import Spinner from "../../components/Others/Spinner";

function PointLog() {
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();

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
      <div className="w-full md:w-2/3 lg:w-1/2 p-3 mx-auto mt-14">
        <SubHeader text={t("pointHistory")} />
        <div className="flex flex-col">
          {pointLog?.length > 0
            ? pointLog.map((data, i) => (
                <div key={i}>
                  <Pointlog
                    date={data.date}
                    point_num={data.point_num}
                    usage={data.usage}
                    ioFlag={data.ioFlag}
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
