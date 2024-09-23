import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import formatPrice from "../../utils/formatPrice";

import PageHeader from "../../components/Forms/PageHeader";
import PieChart from "../../components/Charts/PieChart";
import LineChart from "../../components/Charts/LineChart";

const Statistics = () => {
  const [totalIncome, setTotalIncome] = useState(0);
  const [gachaData, setGachaData] = useState([]);
  const [selPendingPeriod, setSelPendingPeriod] = useState(7);
  const [pendingData, setPendingData] = useState([]);
  const [selDeliveringPeriod, setSelDeliveringPeriod] = useState(7);
  const [deliveringData, setDeliveringData] = useState([]);
  const [selDeliveredPeriod, setSelDeliveredPeriod] = useState(7);
  const [deliveredData, setDeliveredData] = useState([]);

  const { t } = useTranslation();

  useEffect(() => {
    setAuthToken();
    getTotalData();
    getStatusIncome("Pending", selPendingPeriod);
    getStatusIncome("Delivering", selDeliveringPeriod);
    getStatusIncome("Delivered", selDeliveredPeriod);
  }, [selPendingPeriod, selDeliveringPeriod, selDeliveredPeriod]);

  const getTotalData = async () => {
    try {
      const res = await api.get("/admin/get_statistics");
      setTotalIncome(res.data.totalIncome);
      setGachaData(res.data.gachaData);
    } catch (error) {
      console.error(error);
    }
  };

  const getStatusIncome = async (type, period) => {
    try {
      // get start date
      const startDate = new Date(
        Date.now() - (period - 1) * 24 * 60 * 60 * 1000
      );

      const res = await api.post("admin/getStatusIncome", {
        status: type,
        startDate: startDate,
      });

      const pendingIncomes = res.data.pendingIncomes;
      const endDate = new Date(); // Most recent date from your existing data

      const dateArray = [];
      const priceArray = [];

      // Convert existing data into an object for easier lookup
      const totalPriceByDate = {};
      pendingIncomes.forEach((item) => {
        totalPriceByDate[item.date] = item.total;
      });

      // Loop through dates from start date to end date
      for (
        let date = startDate;
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Get month and pad
        const day = String(date.getDate()).padStart(2, "0"); // Get day and pad
        const formattedDate = `${month}-${day}`; // Format date as MM-DD

        dateArray.push(formattedDate); // Add to dateArray
        priceArray.push(
          totalPriceByDate[`${date.getFullYear()}-${month}-${day}`] || 0
        ); // Add total or 0 to priceArray
      }

      switch (type) {
        case "Pending":
          setPendingData([dateArray, priceArray]);
          break;
        case "Delivering":
          setDeliveringData([dateArray, priceArray]);
          break;
        case "Delivered":
          setDeliveredData([dateArray, priceArray]);
          break;

        default:
          break;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const changePeriod = (type, e) => {
    switch (type) {
      case "Pending":
        setSelPendingPeriod(e.currentTarget.value);
        getStatusIncome("Pending", e.currentTarget.value);
        break;
      case "Delivering":
        setSelDeliveringPeriod(e.currentTarget.value);
        getStatusIncome("Delivering", e.currentTarget.value);
        break;
      case "Delivered":
        setSelDeliveredPeriod(e.currentTarget.value);
        getStatusIncome("Delivered", e.currentTarget.value);
        break;
      default:
        break;
    }
  };

  return (
    <div className="p-3 ">
      <div className="w-full md:w-[100%] lg:w-[70%] mx-auto">
        <PageHeader text={t("statistics")} />
      </div>
      <div className="flex flex-wrap justify-between items-start w-full lg:w-[90%] xl:w-[70%] mx-auto">
        <div className="h-auto flex flex-col w-full lg:w-[50%] p-2">
          <div className="flex flex-wrap items-center justify-between h-32 overflow-auto w-full bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 my-2 p-4">
            <span className="text-3xl text-slate-600">
              {t("total") + " " + t("income")}
            </span>
            <span className="text-3xl text-slate-600">
              ¥ {formatPrice(totalIncome)}
            </span>
          </div>
          <div className="h-full flex flex-col overflow-auto w-full bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 my-2 p-4">
            <span className="text-3xl text-slate-600">
              {t("gacha") + " " + t("status")}
            </span>
            <hr className="my-2 w-full text-sm mx-auto"></hr>
            <div className="chart mt-4">
              <PieChart data={gachaData} />
            </div>
          </div>
        </div>
        <div className="h-auto flex flex-col w-full lg:w-[50%] p-2">
          <div className="h-full flex flex-col overflow-auto w-full bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 my-2 p-4">
            <div className="flex flex-wrap justify-between">
              <span className="text-3xl text-slate-600">
                {t("Pending") + " " + t("cards")}
              </span>
              <select
                className="form-control form-control-sm w-32 cursor-pointer"
                name="changePendingPeriod"
                id="changePendingPeriod"
                autoComplete="changePendingPeriod"
                onChange={(e) => changePeriod("Pending", e)}
                value={selPendingPeriod}
              >
                <option value="7" className="p-2">
                  {t("last") + " 7 " + t("days")}
                </option>
                <option value="30" className="p-2">
                  {t("last") + " 30 " + t("days")}
                </option>
              </select>
            </div>
            <hr className="my-2 w-full text-sm mx-auto"></hr>
            <div className="chart mt-4">
              <LineChart data={pendingData} />
            </div>
          </div>
          <div className="h-full flex flex-col overflow-auto w-full bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 my-2 p-4">
            <div className="flex flex-wrap justify-between">
              <span className="text-3xl text-slate-600">
                {t("Delivering") + " " + t("cards")}
              </span>
              <select
                className="form-control form-control-sm w-32 cursor-pointer"
                name="changeDeliveringPeriod"
                id="changeDeliveringPeriod"
                autoComplete="changeDeliveringPeriod"
                onChange={(e) => changePeriod("Delivering", e)}
                value={selDeliveringPeriod}
              >
                <option value="7" className="p-2">
                  {t("last") + " 7 " + t("days")}
                </option>
                <option value="30" className="p-2">
                  {t("last") + " 30 " + t("days")}
                </option>
              </select>
            </div>
            <hr className="my-2 w-full text-sm mx-auto"></hr>
            <div className="chart mt-4">
              <LineChart data={deliveringData} />
            </div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-start w-full lg:w-[90%] xl:w-[70%] mx-auto px-2">
        <div className="h-full flex flex-col overflow-auto w-full bg-white border-[1px] border-gray-200 rounded-md shadow-md shadow-gray-300 my-2 p-4">
          <div className="flex flex-wrap justify-between">
            <span className="text-3xl text-slate-600">
              {t("Delivered") + " " + t("cards")}
            </span>
            <select
              className="form-control form-control-sm w-32 cursor-pointer"
              name="changeDeliveredPeriod"
              id="changeDeliveredPeriod"
              autoComplete="changeDeliveredPeriod"
              onChange={(e) => changePeriod("Delivered", e)}
              value={selDeliveredPeriod}
            >
              <option value="7" className="p-2">
                {t("last") + " 7 " + t("days")}
              </option>
              <option value="30" className="p-2">
                {t("last") + " 30 " + t("days")}
              </option>
            </select>
          </div>
          <hr className="my-2 w-full text-sm mx-auto"></hr>
          <div className="chart mt-4">
            <LineChart data={deliveredData} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
