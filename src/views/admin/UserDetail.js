import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import formatDate from "../../utils/formatDate";
import formatPrice from "../../utils/formatPrice";

import Label from "../../components/Forms/Label";
import GroupHeader from "../../components/Forms/GroupHeader";
import Spinner from "../../components/Others/Spinner";

function UserDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { userId } = location.state || {};

  const [user, setUser] = useState(null);
  const [pointLog, setPointLog] = useState(null);
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    getPointLog();
    getUserData();
  }, []);

  const getUserData = async () => {
    setSpinFlag(true);
    const res = await api.get(`/user/get_user/${userId}`);
    setSpinFlag(false);

    if (res.data.status === 1) setUser(res.data.user);
  };

  const getPointLog = async () => {
    setSpinFlag(true);
    const res = await api.get(`/user/get_point_log/${userId}`);
    setSpinFlag(false);

    if (res.data.status === 1) setPointLog(res.data.pointLog);
  };

  return (
    <div className="w-full md:w-[70%] m-auto px-3 pt-2 py-24">
      {spinFlag && <Spinner />}
      <div className="text-center">
        <i
          className="fa fa-chevron-left float-left cursor-pointer mt-2"
          onClick={() => navigate("/admin/gacha")}
        />
        <span className="text-xl text-center text-slate-600">
          {t("user") + " " + t("detail")}
        </span>
      </div>
      <hr className="my-2"></hr>
      <div className="p-2 flex flex-col w-full">
        <GroupHeader text="information" />
        <div className="flex flex-wrap">
          <div className="w-full md:w-1/2 px-2">
            <Label htmlFor="text" text="name" classname="pr-3" />
            {user?.name}
          </div>
          <div className="w-full md:w-1/2 px-2">
            <Label htmlFor="text" text="email" classname="pr-3" />
            {user?.email}
          </div>
        </div>
        <hr className="my-2"></hr>
        <div className="flex flex-wrap justify-between">
          <div className="w-full">
            <GroupHeader text="pointsHistory" />
            <table className="w-full">
              <thead className="bg-admin_theme_color font-bold text-gray-200">
                <tr>
                  <th>{t("no")}</th>
                  <th>{t("point") + " " + t("amount")}</th>
                  <th>{t("usage")}</th>
                  <th>{t("date")}</th>
                </tr>
              </thead>
              <tbody>
                {pointLog ? (
                  pointLog.map((log, i) => (
                    <tr key={i}>
                      <td>{i + 1}</td>
                      <td>{formatPrice(log.point_num)}pt</td>
                      <td>{t(log.usage)}</td>
                      <td>{formatDate(log.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4">{t("nopointlog")}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
