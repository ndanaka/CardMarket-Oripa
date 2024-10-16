import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import InputGroup from "../../components/Forms/InputGroup";
import { showToast } from "../../utils/toastUtil";

function ShippingAdd() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = usePersistedUser();

  const [showErrMessage, setShowErrMessage] = useState(false);
  const [shipAddress, setShipAddress] = useState({
    user_id: user._id,
    country: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    postCode: "",
    prefecture: "",
    address: "",
    building: "",
    phoneNumber: "",
  });

  const { initialData } = location.state || {};

  useEffect(() => {
    setAuthToken();
    // if update
    if (initialData) setShipAddress(initialData);
  }, []);

  const isFormValidate = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.lastNameKana &&
      shipAddress.firstNameKana &&
      shipAddress.postCode &&
      shipAddress.prefecture &&
      shipAddress.address &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const changeShipAddress = (e) => {
    setShipAddress({ ...shipAddress, [e.target.name]: e.target.value });
    isFormValidate();
  };

  const handleCancelShipAddress = () => {
    setShipAddress({
      user_id: user._id,
      country: "",
      lastName: "",
      firstName: "",
      lastNameKana: "",
      firstNameKana: "",
      postCode: "",
      prefecture: "",
      address: "",
      building: "",
      phoneNumber: "",
    });
  };

  const handleSaveShipAddress = async () => {
    setShowErrMessage(true);
    if (!isFormValidate()) return;

    try {
      const formatDate = {
        shipAddress: shipAddress,
      };

      if (initialData) formatDate.update = true;

      const res = await api.post("user/shipping_address", formatDate);

      if (res.data.status === 1) {
        if (res.data.update) {
          showToast("Successfully edited data.", "success");
        } else {
          showToast("Successfully saved data.", "success");
          handleCancelShipAddress();
        }
        setShowErrMessage(false);
      } else {
        showToast("Failed to save data.", "error");
      }
    } catch (error) {
      showToast("Something went wrong.", "error");
    }
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-2/3 lg:w-1/2 p-3 mx-auto mt-12">
        <div className="w-full py-2">
          <div className="text-center text-xl text-slate-600">
            <i
              className="fa fa-chevron-left mt-1 float-left items-center cursor-pointer"
              onClick={() => navigate(-1)}
            ></i>
            {initialData ? t("editShippingAddress") : t("addShippingAddress")}
          </div>
          <hr className="w-full my-2"></hr>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="flex flex-wrap w-full">
            <div className="w-full px-2">
              <label htmlFor="category" className="font-Lexend p-1">
                {t("country")}
              </label>
              <select
                id="country"
                name="country"
                autoComplete="country"
                className="p-1 w-full focus:outline-none border rounded cursor-pointer"
                value={shipAddress?.country || ""}
                onChange={changeShipAddress}
              >
                <option value={""}>{t("selectCountry")}</option>
                <option value={"japan"}>{t("japan")}</option>
                <option value={"chanina_mainland"}>
                  {t("chanina_mainland")}
                </option>
                <option value={"chanina_hongkong"}>
                  {t("chanina_hongkong")}
                </option>
                <option value={"chanina_macau"}>{t("chanina_macau")}</option>
                <option value={"taiwan"}>{t("taiwan")}</option>
                <option value={"sinagapore"}>{t("sinagapore")}</option>
                <option value={"austrailia"}>{t("austrailia")}</option>
                <option value={"unitedStates"}>{t("unitedStates")}</option>
              </select>
              {showErrMessage && !shipAddress.country ? (
                <span className="flex text-sm text-red-600 pt-2">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("country") + t("isRequried")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-full md:w-1/2 px-2">
              <InputGroup
                label={t("lastName")}
                type="text"
                name="lastName"
                value={shipAddress?.lastName || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.lastName ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("lastName") + t("isRequried")}
                </span>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <InputGroup
                label={t("firstName")}
                type="text"
                name="firstName"
                value={shipAddress?.firstName || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.firstName ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("firstName") + t("isRequried")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-full md:w-1/2 px-2">
              <InputGroup
                label={t("lastNameKana")}
                type="text"
                name="lastNameKana"
                value={shipAddress?.lastNameKana || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.lastNameKana ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("lastNameKana") + t("isRequried")}
                </span>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <InputGroup
                label={t("firstNameKana")}
                type="text"
                name="firstNameKana"
                value={shipAddress?.firstNameKana || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.firstNameKana ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("firstNameKana") + t("isRequried")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-full md:w-1/2 px-2">
              <InputGroup
                label={t("postCode")}
                type="text"
                name="postCode"
                value={shipAddress?.postCode || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.postCode ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("postCode") + t("isRequried")}
                </span>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 px-2">
              <InputGroup
                label={t("prefecture")}
                type="text"
                name="prefecture"
                value={shipAddress?.prefecture || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.prefecture ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("prefecture") + t("isRequried")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-full px-2">
              <InputGroup
                label={t("address")}
                type="text"
                name="address"
                value={shipAddress?.address || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.address ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("address") + t("isRequried")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-full px-2">
              <InputGroup
                label={t("building")}
                type="text"
                name="building"
                value={shipAddress?.building || ""}
                onChange={changeShipAddress}
              />
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-full px-2">
              <InputGroup
                label={t("phoneNumber")}
                type="text"
                name="phoneNumber"
                value={shipAddress?.phoneNumber || ""}
                onChange={changeShipAddress}
              />
              {showErrMessage && !shipAddress.phoneNumber ? (
                <span className="flex text-sm text-red-600">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("phoneNumber") + t("isRequried")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap justify-center mx-auto">
            <button
              className="bg-indigo-600 rounded-md text-center mx-2 px-16 py-2 my-2 hover:bg-indigo-700 text-white outline-none"
              onClick={handleCancelShipAddress}
            >
              {t("cancel")}
            </button>
            <button
              className="bg-theme_color rounded-md text-center mx-2 px-16 py-2 my-2 hover:bg-red-800 text-white outline-none"
              onClick={handleSaveShipAddress}
            >
              {initialData ? t("save") : t("add")}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShippingAdd;
