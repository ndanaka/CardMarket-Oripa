import { useEffect, useState } from "react";

import api from "../../utils/api";
import usePersistedUser from "../../store/usePersistedUser";
import { setAuthToken } from "../../utils/setHeader";

import SubHeader from "../../components/Forms/SubHeader";
import Pointlog from "../../components/Others/Pointlog";
import { useTranslation } from "react-i18next";

function PointLog() {
  const [user, setUser] = usePersistedUser();
  const [pointLog, setPointLog] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    setAuthToken();
    getPointLog();
  }, []);

  const getPointLog = () => {
    api
      .get(`/user/get_point_log/${user?._id}`)
      .then((res) => {
        if (res.data.status === 1) setPointLog(res.data.pointLog);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-2/3 lg:w-1/2 p-3 mx-auto mt-12">
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
