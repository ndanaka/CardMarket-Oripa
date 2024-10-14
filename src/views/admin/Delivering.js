import React from "react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import formatDate from "../../utils/formatDate";
import usePersistedUser from "../../store/usePersistedUser";

import PageHeader from "../../components/Forms/PageHeader";

function Delivering() {
  const [user, setUser] = usePersistedUser();
  const [deliverData, setDeliverData] = useState();
  const { t } = useTranslation();

  useEffect(() => {
    setAuthToken();
    getDeliverData();
  }, []);

  const getDeliverData = () => {
    api
      .get("/admin/get_deliver")
      .then((res) => {
        if (res.data.status === 1) setDeliverData(res.data.deliverData);
      })
      .catch((err) => console.log(err));
  };

  const handlesetStatus = (i) => {
    if (!user.authority["delivering"]["delete"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    if (deliverData[i].status === "Delivered") {
      showToast("This gachas has already Delivered", "error");
    } else {
      api
        .post("/admin/set_deliver_status", {
          id: deliverData[i]._id,
          user_id: deliverData[i].user_id,
          status: deliverData[i].status,
        })
        .then((res) => {
          if (res.data.status === 1) {
            showToast("Set Status Success.", "success");
            getDeliverData();
          } else showToast("Set Status Failed.", "error");
        })
        .catch((err) => console.log(err));
    }
  };

  return (
    <div className="w-full p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("Delivering")} />
      </div>
      <div className="w-full mt-3 mx-auto overflow-auto">
        <table className="w-full">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <tr>
              <th>{t("no")}</th>
              <th>{t("user") + " " + t("name")}</th>
              <th>{t("gacha")}</th>
              <th>{t("prize")}</th>
              <th>{t("gacha") + " " + t("date")}</th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {deliverData?.length > 0 ? (
              deliverData.map((data, i) => (
                <React.Fragment key={data._id}>
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{data.user_name}</td>
                    <td>{data.gacha_name}</td>
                    <td>
                      {data.prizes.length > 1
                        ? data.prizes.length + " " + t("prize")
                        : data.prizes[0].name}
                    </td>
                    <td>{formatDate(data.gacha_date)}</td>
                    <td>
                      <button
                        className={`py-1 px-2 rounded-sm text-center text-gray-200 ${
                          data.status === "Pending"
                            ? "bg-yellow-600"
                            : data.status === "Delivering"
                            ? "bg-indigo-600"
                            : "bg-red-600"
                        }`}
                        onClick={() => handlesetStatus(i)}
                      >
                        {t(data.status)}
                      </button>
                    </td>
                  </tr>
                </React.Fragment>
              ))
            ) : (
              <tr>
                <td colSpan="6">There is no delivering card.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Delivering;
