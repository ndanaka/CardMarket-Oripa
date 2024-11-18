import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import PageHeader from "../../components/Forms/PageHeader";
import Spinner from "../../components/Others/Spinner";
import PrizeCard from "../../components/Others/PrizeCard";

function Delivering() {
  const [user] = usePersistedUser();
  const { t } = useTranslation();

  const [deliveries, setDeliveries] = useState([]);
  const [spinFlag, setSpinFlag] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortField, setSortField] = useState("userName");
  const [sortOrder, setSortOrder] = useState("asc");

  useEffect(() => {
    getDeliveries();
  }, []);

  const getDeliveries = async () => {
    setAuthToken();

    try {
      setSpinFlag(true);
      const res = await api.get("/admin/deliveries");
      setSpinFlag(false);

      if (res.data.status === 1) {
        setDeliveries(res.data.prizes);
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const handleChangeStatus = async (index) => {
    setAuthToken();

    if (!user.authority["delivering"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    try {
      const userId = sortedDeliveries[index].userId;
      const prizeId = sortedDeliveries[index].prizeId;

      if (sortedDeliveries[index].prizeDeliverStatus === "shipped") {
        showToast(t("validDeliver"), "error");
      } else {
        setSpinFlag(true);
        const res = await api.post("/admin/changeDeliverStatus", {
          userId: userId,
          prizeId: prizeId,
          status: sortedDeliveries[index].prizeDeliverStatus,
          drawDate: new Date(),
        });
        setSpinFlag(false);

        if (res.data.status === 1) {
          showToast(t("successChanged"), "success");
          getDeliveries();
        } else showToast(t("failedChanged"), "error");
      }
    } catch (error) {}
  };

  // Function to filter deliveries based on search query
  const filteredDeliveries = deliveries.filter((delivery) => {
    const searchLower = searchQuery.toLowerCase();

    // Check for specific status keywords
    if (searchLower === "pending") {
      return delivery.prizeDeliverStatus === "awaiting";
    } else if (searchLower === "delivering") {
      return delivery.prizeDeliverStatus === "shipped";
    }

    // General search for other fields
    return (
      delivery.userName.toLowerCase().includes(searchLower) ||
      delivery.userEmail.toLowerCase().includes(searchLower) ||
      delivery.prizeName.toLowerCase().includes(searchLower) ||
      delivery.prizeKind.toLowerCase().includes(searchLower) ||
      delivery.prizeTrackingNumber.toLowerCase().includes(searchLower) ||
      delivery.prizeDeliveryCompany.toLowerCase().includes(searchLower)
    );
  });

  // Function to sort deliveries
  const sortedDeliveries = [...filteredDeliveries].sort((a, b) => {
    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string") {
      return sortOrder === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    } else {
      return sortOrder === "asc" ? aValue - bValue : bValue - aValue;
    }
  });

  // Function to handle sorting
  const handleSort = (field) => {
    const newSortOrder =
      sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newSortOrder);
  };

  const getSortIcon = (field) => {
    if (sortField === field) {
      return sortOrder === "asc" ? (
        <i className="fa fa-sort-up ml-2" />
      ) : (
        <i className="fa fa-sort-down ml-2" />
      );
    }
    return <i className="fa fa-sort ml-2" />;
  };

  return (
    <div className="w-full px-3 pt-2 py-12">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("delivering")} />
      </div>
      <div className="flex flex-wrap w-full mt-3 mx-auto">
        <input
          type="text"
          placeholder={t("search")}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="border-1 border-gray-300 p-2 rounded w-full md:w-1/2 lg:w-1/4"
        />
      </div>
      <div className="overflow-auto mt-3">
        <table className="w-full">
          <thead>
            <tr>
              <th className="cursor-pointer">{t("no")}</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("userName")}
              >
                {t("user")} {getSortIcon("userName")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("userEmail")}
              >
                {t("email")} {getSortIcon("userEmail")}
              </th>
              <th>{t("shippingAddress")}</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("prizeName")}
              >
                {t("prize")} {getSortIcon("prizeName")}
              </th>
              <th>{t("image")}</th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("prizeKind")}
              >
                {t("kind")} {getSortIcon("prizeKind")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("prizeTrackingNumber")}
              >
                {t("trackingNumber")} {getSortIcon("prizeTrackingNumber")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("prizeDeliveryCompany")}
              >
                {t("deliveryCompany")} {getSortIcon("prizeDeliveryCompany")}
              </th>
              <th
                className="cursor-pointer"
                onClick={() => handleSort("prizeDeliverStatus")}
              >
                {t("status")} {getSortIcon("prizeDeliverStatus")}
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedDeliveries.length !== 0 ? (
              sortedDeliveries.map((delivery, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
                  <td>{delivery.userName}</td>
                  <td>{delivery.userEmail}</td>
                  <td>
                    {(delivery.shipAddress.country !== undefined
                      ? t(delivery.shipAddress.country) + ", "
                      : "") +
                      (delivery.shipAddress.prefecture !== undefined
                        ? delivery.shipAddress.prefecture + ", "
                        : "") +
                      (delivery.shipAddress.address !== undefined
                        ? delivery.shipAddress.address + ", "
                        : "") +
                      (delivery.shipAddress.addressLine1 !== undefined
                        ? delivery.shipAddress.addressLine1 + ", "
                        : "") +
                      (delivery.shipAddress.addressLine2 !== undefined
                        ? delivery.shipAddress.addressLine2 + ", "
                        : "") +
                      (delivery.shipAddress.building !== undefined
                        ? delivery.shipAddress.building + ", "
                        : "") +
                      (delivery.shipAddress.districtCity !== undefined
                        ? delivery.shipAddress.districtCity + ", "
                        : "") +
                      (delivery.shipAddress.cityTown !== undefined
                        ? delivery.shipAddress.cityTown + ", "
                        : "") +
                      (delivery.shipAddress.cityDistrict !== undefined
                        ? delivery.shipAddress.cityDistrict + ", "
                        : "") +
                      (delivery.shipAddress.islandCity !== undefined
                        ? delivery.shipAddress.islandCity + ", "
                        : "") +
                      (delivery.shipAddress.suburbCity !== undefined
                        ? delivery.shipAddress.suburbCity + ", "
                        : "") +
                      (delivery.shipAddress.state !== undefined
                        ? delivery.shipAddress.state + ", "
                        : "") +
                      (delivery.shipAddress.stateProvinceRegion !== undefined
                        ? delivery.shipAddress.stateProvinceRegion + ", "
                        : "") +
                      (delivery.shipAddress.zipCode !== undefined
                        ? delivery.shipAddress.zipCode + ", "
                        : "")}
                  </td>
                  <td>{delivery.prizeName}</td>
                  <td>
                    <div className="mx-auto w-[60px]">
                      <PrizeCard
                        img_url={delivery.prizeImg}
                        width={50}
                        height={80}
                      />
                    </div>
                  </td>
                  <td>{t(delivery.prizeKind)}</td>
                  <td>{delivery.prizeTrackingNumber}</td>
                  <td>{delivery.prizeDeliveryCompany}</td>
                  <td>
                    <button
                      className={`py-1 px-2 rounded-sm text-center text-gray-200 ${
                        delivery.prizeDeliverStatus === "awaiting"
                          ? "bg-yellow-600"
                          : "bg-blue-600"
                      }`}
                      onClick={() => handleChangeStatus(i)}
                    >
                      {delivery.prizeDeliverStatus === "awaiting"
                        ? t("pending")
                        : t("delivering")}
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={10}>{t("noData")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Delivering;
