import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import formatDate from "../../utils/formatDate";
import usePersistedUser from "../../store/usePersistedUser";

import PageHeader from "../../components/Forms/PageHeader";
import Spinner from "../../components/Others/Spinner";

function Delivering() {
  const [user] = usePersistedUser();
  const { t } = useTranslation();

  const [deliverData, setDeliverData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: "", direction: "asc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setAuthToken();
    getDeliverData();
  }, []);

  useEffect(() => {
    // Filter data whenever deliverData or searchQuery changes
    setFilteredData(
      deliverData.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(searchQuery.toLowerCase())
        )
      )
    );
  }, [deliverData, searchQuery]);

  const getDeliverData = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get("/admin/get_deliver");
      setSpinFlag(false);

      if (res.data.status === 1) {
        setDeliverData(res.data.deliverData);
        setFilteredData(res.data.deliverData);
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleSetStatus = async (i) => {
    if (!user.authority["delivering"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }
    try {
      if (deliverData[i].status === "Delivered") {
        showToast(t("alrDelivered"), "error");
      } else {
        setSpinFlag(true);
        const res = await api.post("/admin/set_deliver_status", {
          id: deliverData[i]._id,
          user_id: deliverData[i].user_id,
          status: deliverData[i].status,
        });
        setSpinFlag(false);

        if (res.data.status === 1) {
          showToast(t("successAdd"), "success");
          getDeliverData();
        } else showToast(t("failedAdd"), "error");
      }
    } catch (error) {}
  };

  const handleSort = (key) => {
    const direction =
      sortConfig.key === key && sortConfig.direction === "asc" ? "desc" : "asc";
    setSortConfig({ key, direction });
    setFilteredData((prevData) => sortData(prevData, key, direction));
  };

  const sortData = (data, key, direction) => {
    return data.slice().sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === "asc" ? (
        <i className="fa fa-sort-up ml-2"></i>
      ) : (
        <i className="fa fa-sort-down ml-2"></i>
      );
    }
    return <i className="fa fa-sort ml-2"></i>;
  };

  return (
    <div className="w-full px-3 pt-2 py-24">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("Delivering")} />
      </div>
      <div className="w-full mt-3 mx-auto overflow-auto">
        <input
          type="text"
          className="py-1 px-2 mb-1 border border-gray-500 rounded"
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <table className="w-full">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <tr>
              <th>{t("no")}</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("user_name")}
              >
                {t("user") + " " + t("name")}
                {renderSortIcon("user_name")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("gacha_name")}
              >
                {t("gacha")}
                {renderSortIcon("gacha_name")}
              </th>
              <th>{t("prize")}</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("gacha_date")}
              >
                {t("gacha") + " " + t("date")} {renderSortIcon("gacha_date")}
              </th>
              <th>{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((data, i) => (
                <tr key={data._id}>
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
                      onClick={() => handleSetStatus(i)}
                    >
                      {t(data.status)}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6">{t("noDeliveringCards")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Delivering;
