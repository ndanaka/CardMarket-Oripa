import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import formatDate from "../../utils/formatDate";

import Label from "../../components/Forms/Label";
import PrizeCard from "../../components/Others/PrizeCard";
import GroupHeader from "../../components/Forms/GroupHeader";
import formatPrice from "../../utils/formatPrice";

function UserDetail() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const [user, setUser] = useState(null);
  const [pointLog, setPointLog] = useState(null);
  const { userId } = location.state || {};

  useEffect(() => {
    getPointLog();
    getUserData();
  }, []);

  const getUserData = () => {
    api
      .get(`/user/get_user/${userId}`)
      .then((res) => {
        if (res.data.status === 1) setUser(res.data.user);
      })
      .catch((err) => console.log(err));
  };

  const getPointLog = () => {
    api
      .get(`/user/get_point_log/${userId}`)
      .then((res) => {
        if (res.data.status === 1) setPointLog(res.data.pointLog);
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full  md:w-[70%] m-auto  p-3">
      <div className="text-xl text-center text-slate-600">
        <i
          className="fa fa-chevron-left float-left"
          onClick={() => navigate("/admin/user")}
        ></i>
        <span className="text-xl text-center py-3">{t("user") +" "+ t("detail")}</span>
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
          <div className="w-full px-2">
            <Label htmlFor="text" text="address" classname="pr-3" />
            {user?.address}
          </div>
          <div className="w-full md:w-1/2 px-2">
            <Label htmlFor="text" text="city" classname="pr-3" />
            {user?.city}
          </div>
          <div className="w-full md:w-1/2 px-2">
            <Label htmlFor="text" text="country" classname="pr-3" />
            {user?.country}
          </div>
        </div>
        <hr className="my-2"></hr>
        <div className="flex flex-wrap justify-between">
          <div className="w-full">
            <GroupHeader text="pointHistory" />
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
                      <td>{formatPrice(log.point_num)} pt</td>
                      <td>{log.usage}</td>
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
          {/* <div className="w-full">
            <GroupHeader text="obtained_cards" />
            <div className="flex flex-wrap justify-evenly p-2">
              {user?.obtain_cards?.length > 0 ? (
                user.obtain_cards.map((gacha, i) => {
                  return (
                    <div className="my-1">
                      <div>
                        {gacha?.gacha_name} {formatDate(gacha?.gacha_date)}
                      </div>
                      <div className="flex flex-wrap">
                        {gacha?.prizes?.length > 0
                          ? gacha.prizes.map((card) => (
                              <div className="mt-2 mr-2">
                                <PrizeCard
                                  name={card.name}
                                  rarity={card.rarity}
                                  cashback={card.cashback}
                                  img_url={card.img_url}
                                />
                              </div>
                            ))
                          : null}
                      </div>
                      <hr className="w-full my-2"></hr>
                    </div>
                  );
                })
              ) : (
                <div className="text-lg text-gray-200 text-center">
                  {t("nocard")}
                </div>
              )}
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default UserDetail;
