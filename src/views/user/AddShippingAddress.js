import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

import InputGroup from "../../components/Forms/InputGroup";
import Spinner from "../../components/Others/Spinner";
import SucceedModal from "../../components/Modals/SucceedModal";

function AddShippingAddress() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);
  const { initialData } = location.state || {};

  const [showErrMessage, setShowErrMessage] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");
  const [shipAddress, setShipAddress] = useState({
    country: "",
    lastName: "",
    firstName: "",
    lastNameKana: "",
    firstNameKana: "",
    zipCode: "",
    prefecture: "",
    address: "",
    building: "",
    phoneNumber: "",
    addressLine1: "",
    addressLine2: "",
    districtCity: "",
    cityTown: "",
    cityDistrict: "",
    islandCity: "",
    suburbCity: "",
    state: "",
    stateProvinceRegion: "",
  });

  useEffect(() => {
    setAuthToken();
    if (initialData) setShipAddress(initialData);
  }, []);

  const isFormValidate = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.lastNameKana &&
      shipAddress.firstNameKana &&
      shipAddress.zipCode &&
      shipAddress.prefecture &&
      shipAddress.address &&
      shipAddress.phoneNumber &&
      shipAddress.addressLine1 &&
      shipAddress.districtCity &&
      shipAddress.cityTown &&
      shipAddress.cityDistrict &&
      shipAddress.islandCity &&
      shipAddress.state &&
      shipAddress.stateProvinceRegion &&
      shipAddress.suburbCity
    )
      return true;
    else return false;
  };

  const isKatakana = (str) => {
    const katakanaRegex = /^[\u30A0-\u30FF]+$/;
    return katakanaRegex.test(str);
  };

  const isValidZipCode = (zipCode) => {
    const zipCodeRegex = /^\d{7}$/;
    return zipCodeRegex.test(zipCode);
  };

  const isFormValidateJp = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.lastNameKana &&
      shipAddress.firstNameKana &&
      shipAddress.zipCode &&
      shipAddress.prefecture &&
      shipAddress.address &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const isFormValidateChMain = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.addressLine1 &&
      shipAddress.districtCity &&
      shipAddress.cityTown &&
      shipAddress.stateProvinceRegion &&
      shipAddress.zipCode &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const isFormValidateChHk = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.addressLine1 &&
      shipAddress.cityDistrict &&
      shipAddress.stateProvinceRegion &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const isFormValidateChMacau = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.addressLine1 &&
      shipAddress.cityDistrict &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const isFormValidateTa = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.zipCode &&
      shipAddress.phoneNumber &&
      shipAddress.cityDistrict &&
      shipAddress.stateProvinceRegion
    )
      return true;
    else return false;
  };

  const isFormValidateSg = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.addressLine1 &&
      shipAddress.islandCity &&
      shipAddress.zipCode &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const isFormValidateVt = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.addressLine1 &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const isFormValidateAu = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.addressLine1 &&
      shipAddress.suburbCity &&
      shipAddress.state &&
      shipAddress.zipCode &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const isFormValidateUS = () => {
    if (
      shipAddress.country &&
      shipAddress.lastName &&
      shipAddress.firstName &&
      shipAddress.addressLine1 &&
      shipAddress.cityDistrict &&
      shipAddress.state &&
      shipAddress.zipCode &&
      shipAddress.phoneNumber
    )
      return true;
    else return false;
  };

  const changeShipAddress = (e) => {
    setShipAddress({ ...shipAddress, [e.target.name]: e.target.value });
    isFormValidate();
  };

  const changeShipAddressJP = (e) => {
    const { name, value } = e.target;
    setShipAddress((prev) => ({ ...prev, [name]: value }));
    fetchAddress(value);
    isFormValidate();
  };

  const fetchAddress = async (zipCode) => {
    if (!zipCode) return;

    try {
      const response = await fetch(
        `https://api.zipaddress.net/?zipcode=${zipCode}`
      );
      const data = await response.json();

      if (data.code === 200) {
        const { pref, city, town, address, fullAddress } = data.data;

        setShipAddress((prev) => ({
          ...prev,
          prefecture: pref || "",
          address: address || "",
        }));
      }
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  const changeShipCountry = (e) => {
    if (!initialData) setShipAddress({ country: e.target.value });
    else setShipAddress({ ...shipAddress, country: e.target.value });

    setShowErrMessage(false);
    isFormValidate();
  };

  const handleCancelShipAddress = () => {
    if (initialData) setShipAddress(initialData);
    else
      setShipAddress({
        country: "",
        lastName: "",
        firstName: "",
        lastNameKana: "",
        firstNameKana: "",
        zipCode: "",
        prefecture: "",
        address: "",
        building: "",
        phoneNumber: "",
        addressLine1: "",
        addressLine2: "",
        districtCity: "",
        cityTown: "",
        cityDistrict: "",
        islandCity: "",
        suburbCity: "",
        state: "",
      });
  };

  const handleSaveShipAddress = async () => {
    setShowErrMessage(true);

    switch (shipAddress.country) {
      case "japan":
        if (!isFormValidateJp()) return;
        break;
      case "china_mainland":
        if (!isFormValidateChMain()) return;
        break;
      case "china_hongkong":
        if (!isFormValidateChHk()) return;
        break;
      case "china_macau":
        if (!isFormValidateChMacau()) return;
        break;
      case "taiwan":
        if (!isFormValidateTa()) return;
        break;
      case "singapore":
        if (!isFormValidateSg()) return;
        break;
      case "vetnam":
        if (!isFormValidateVt()) return;
        break;
      case "australia":
        if (!isFormValidateAu()) return;
        break;
      case "unitedStates":
        if (!isFormValidateUS()) return;
        break;

      default:
        if (!isFormValidate()) return;
        break;
    }

    try {
      shipAddress.user_id = user?._id;
      const formatDate = { shipAddress: shipAddress };

      if (initialData) formatDate.update = true;

      setSpinFlag(true);
      const res = await api.post("user/shipping_address", formatDate);
      setSpinFlag(false);

      if (res.data.status === 1) {
        setIsOpen(true);
        if (res.data.update) {
          setText(t("successEdited"));
        } else {
          setText(t("successSaved"));
          handleCancelShipAddress();
        }
        setShowErrMessage(false);
      } else {
        showToast(t("failedSaved"), "error");
      }
    } catch (error) {
      showToast(t("faileReq"), "error");
    }
  };

  return (
    <div className="flex flex-grow">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-2/3 p-3 mx-auto">
        <div className="w-full py-2">
          <div className="text-center text-xl text-slate-600">
            <i
              className="fa fa-chevron-left mt-1.5 float-left items-center cursor-pointer"
              onClick={() => navigate(-1)}
            ></i>
            {initialData ? t("editShippingAddress") : t("addShippingAddress")}
          </div>
          <hr className="w-full my-2"></hr>
        </div>
        <div className="flex flex-wrap justify-center mx-auto w-full xxsm:w-2/3">
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
                onChange={changeShipCountry}
              >
                <option value={""}>{t("selectOption")}</option>
                <option value={"japan"}>{t("japan")}</option>
                <option value={"china_mainland"}>{t("china_mainland")}</option>
                <option value={"china_hongkong"}>{t("china_hongkong")}</option>
                <option value={"china_macau"}>{t("china_macau")}</option>
                <option value={"taiwan"}>{t("taiwan")}</option>
                <option value={"singapore"}>{t("singapore")}</option>
                <option value={"vetnam"}>{t("vetnam")}</option>
                <option value={"australia"}>{t("australia")}</option>
                <option value={"unitedStates"}>{t("unitedStates")}</option>
              </select>
              {showErrMessage && !shipAddress.country ? (
                <span className="flex text-sm text-red-600 pt-2">
                  <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                  {t("country") + t("isrequired")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap w-full">
            <div className="w-full md:w-1/2 p-2">
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
                  {t("lastName") + t("isRequired")}
                </span>
              ) : null}
            </div>
            <div className="w-full md:w-1/2 p-2">
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
                  {t("firstName") + t("isRequired")}
                </span>
              ) : null}
            </div>
          </div>
          {shipAddress.country === "japan" ? (
            <>
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
                      {t("lastNameKana") + t("isRequired")}
                    </span>
                  ) : showErrMessage &&
                    !isKatakana(shipAddress.lastNameKana) ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      {t("lastNameKana") + t("isKatakana")}
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
                      {t("firstNameKana") + t("isRequired")}
                    </span>
                  ) : showErrMessage &&
                    !isKatakana(shipAddress.firstNameKana) ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      {t("requiredKatakana")}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap w-full">
                <div className="w-full md:w-1/2 px-2">
                  <InputGroup
                    label={t("zipCode")}
                    type="text"
                    name="zipCode"
                    value={shipAddress?.zipCode || ""}
                    onChange={changeShipAddressJP}
                    onBlur={fetchAddress}
                  />
                  {showErrMessage && !shipAddress.zipCode ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      {t("zipCode") + t("isRequired")}
                    </span>
                  ) : showErrMessage && !isValidZipCode(shipAddress.zipCode) ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      {t("invalideZipCode")}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap w-full">
                <div className="w-full md:w-1/2 p-2">
                  <label htmlFor="category" className="font-Lexend p-1">
                    {t("prefecture")}
                  </label>
                  <select
                    id="prefecture"
                    name="prefecture"
                    autoComplete="prefecture"
                    className="p-1 mb-2 w-full focus:outline-none border rounded cursor-pointer"
                    value={shipAddress?.prefecture || ""}
                    onChange={changeShipAddress}
                  >
                    <option value={""}>{t("selectOption")}</option>
                    <option value={"北海道"}>北海道</option>
                    <option value={"青森県"}>青森県</option>
                    <option value={"岩手県"}>岩手県</option>
                    <option value={"宮城県"}>宮城県</option>
                    <option value={"秋田県"}>秋田県</option>
                    <option value={"山形県"}>山形県</option>
                    <option value={"茨城県"}>茨城県</option>
                    <option value={"栃木県"}>栃木県</option>
                    <option value={"埼玉県"}>埼玉県</option>
                    <option value={"千葉県"}>千葉県</option>
                    <option value={"東京都"}>東京都</option>
                    <option value={"神奈川県"}>神奈川県</option>
                    <option value={"新潟県"}>新潟県</option>
                    <option value={"富山県"}>富山県</option>
                    <option value={"石川県"}>石川県</option>
                    <option value={"福井県"}>福井県</option>
                    <option value={"山梨県"}>山梨県</option>
                    <option value={"長野県"}>長野県</option>
                    <option value={"岐阜県"}>岐阜県</option>
                    <option value={"静岡県"}>静岡県</option>
                    <option value={"愛知県"}>愛知県</option>
                    <option value={"三重県"}>三重県</option>
                    <option value={"滋賀県"}>滋賀県</option>
                    <option value={"京都府"}>京都府</option>
                    <option value={"大阪府"}>大阪府</option>
                    <option value={"兵庫県"}>兵庫県</option>
                    <option value={"奈良県"}>奈良県</option>
                    <option value={"和歌山県"}>和歌山県</option>
                    <option value={"鳥取県"}>鳥取県</option>
                    <option value={"島根県"}>島根県</option>
                    <option value={"岡山県"}>岡山県</option>
                    <option value={"広島県"}>広島県</option>
                    <option value={"山口県"}>山口県</option>
                    <option value={"徳島県"}>徳島県</option>
                    <option value={"香川県"}>香川県</option>
                    <option value={"愛媛県"}>愛媛県</option>
                    <option value={"高知県"}>高知県</option>
                    <option value={"福岡県"}>福岡県</option>
                    <option value={"佐賀県"}>佐賀県</option>
                    <option value={"長崎県"}>長崎県</option>
                    <option value={"熊本県"}>熊本県</option>
                    <option value={"大分県"}>大分県</option>
                    <option value={"宮崎県"}>宮崎県</option>
                    <option value={"鹿児島県"}>鹿児島県</option>
                    <option value={"沖縄県"}>沖縄県</option>
                  </select>
                  {showErrMessage && !shipAddress.prefecture ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      {t("prefecture") + t("isRequired")}
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
                      {t("address") + t("isRequired")}
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
            </>
          ) : (
            <>
              <div className="flex flex-wrap w-full">
                <div className="w-full px-2">
                  <InputGroup
                    label={t("addressLine1")}
                    type="text"
                    name="addressLine1"
                    value={shipAddress?.addressLine1 || ""}
                    onChange={changeShipAddress}
                  />
                  {showErrMessage && !shipAddress.addressLine1 ? (
                    <span className="flex text-sm text-red-600">
                      <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                      {t("addressLine1") + t("isRequired")}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="flex flex-wrap w-full">
                <div className="w-full px-2">
                  <InputGroup
                    label={t("addressLine2")}
                    type="text"
                    name="addressLine2"
                    value={shipAddress?.addressLine2 || ""}
                    onChange={changeShipAddress}
                  />
                </div>
              </div>
              {shipAddress.country === "china_mainland" && (
                <>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("districtCity")}
                        type="text"
                        name="districtCity"
                        value={shipAddress?.districtCity || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.districtCity ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("districtCity") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("cityTown")}
                        type="text"
                        name="cityTown"
                        value={shipAddress?.cityTown || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.cityTown ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("cityTown") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 p-2">
                      <label htmlFor="category" className="font-Lexend p-1">
                        {t("stateProvinceRegion")}
                      </label>
                      <select
                        id="stateProvinceRegion"
                        name="stateProvinceRegion"
                        autoComplete="stateProvinceRegion"
                        className="p-1 w-full focus:outline-none border rounded cursor-pointer"
                        value={shipAddress?.stateProvinceRegion || ""}
                        onChange={changeShipAddress}
                      >
                        <option value={""}>{t("selectOption")}</option>
                        <option value={"beijing"}>{t("beijing")}</option>
                        <option value={"chongqing"}>{t("chongqing")}</option>
                        <option value={"shanghai"}>{t("shanghai")}</option>
                        <option value={"tianjin"}>{t("tianjin")}</option>
                        <option value={"anhuiProvince"}>
                          {t("anhuiProvince")}
                        </option>
                        <option value={"fujianProvince"}>
                          {t("fujianProvince")}
                        </option>
                        <option value={"gansuProvince"}>
                          {t("gansuProvince")}
                        </option>
                        <option value={"guangdongProvince"}>
                          {t("guangdongProvince")}
                        </option>
                        <option value={"guizhouProvince"}>
                          {t("guizhouProvince")}
                        </option>
                        <option value={"hainanProvince"}>
                          {t("hainanProvince")}
                        </option>
                        <option value={"hebeiProvince"}>
                          {t("hebeiProvince")}
                        </option>
                        <option value={"heilongjiangProvince"}>
                          {t("heilongjiangProvince")}
                        </option>
                        <option value={"henanProvince"}>
                          {t("henanProvince")}
                        </option>
                        <option value={"hubeiProvince"}>
                          {t("hubeiProvince")}
                        </option>
                        <option value={"hunanProvince"}>
                          {t("hunanProvince")}
                        </option>
                        <option value={"jiangsuProvince"}>
                          {t("jiangsuProvince")}
                        </option>
                        <option value={"jiangxiProvince"}>
                          {t("jiangxiProvince")}
                        </option>
                        <option value={"liaoningProvince"}>
                          {t("liaoningProvince")}
                        </option>
                        <option value={"qinghaiProvince"}>
                          {t("qinghaiProvince")}
                        </option>
                        <option value={"shaanxiProvince"}>
                          {t("shaanxiProvince")}
                        </option>
                        <option value={"shandongProvince"}>
                          {t("shandongProvince")}
                        </option>
                        <option value={"shanxiProvince"}>
                          {t("shanxiProvince")}
                        </option>
                        <option value={"sichuanProvince"}>
                          {t("sichuanProvince")}
                        </option>
                        <option value={"yunnanProvince"}>
                          {t("yunnanProvince")}
                        </option>
                        <option value={"zhejiangProvince"}>
                          {t("zhejiangProvince")}
                        </option>
                        <option value={"guangxiZhuangAutonomousRegion"}>
                          {t("guangxiZhuangAutonomousRegion")}
                        </option>
                        <option value={"innerMongoliaAutonomousRegion"}>
                          {t("innerMongoliaAutonomousRegion")}
                        </option>
                        <option value={"ningxiaHuiAutonomousRegion"}>
                          {t("ningxiaHuiAutonomousRegion")}
                        </option>
                        <option value={"xinjiangUyghurAutonomousRegion"}>
                          {t("xinjiangUyghurAutonomousRegion")}
                        </option>
                        <option value={"tibetAutonomousRegion"}>
                          {t("tibetAutonomousRegion")}
                        </option>
                      </select>
                      {showErrMessage && !shipAddress.stateProvinceRegion ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("stateProvinceRegion") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("zipCode")}
                        type="text"
                        name="zipCode"
                        value={shipAddress?.zipCode || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.zipCode ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("zipCode") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              {(shipAddress.country === "china_hongkong" ||
                shipAddress.country === "china_macau") && (
                <>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full px-2">
                      <InputGroup
                        label={t("cityDistrict")}
                        type="text"
                        name="cityDistrict"
                        value={shipAddress?.cityDistrict || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.cityDistrict ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("cityDistrict") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  {shipAddress.country !== "china_macau" && (
                    <div className="flex flex-wrap w-full">
                      <div className="w-full md:w-1/2 p-2">
                        <label htmlFor="category" className="font-Lexend p-1">
                          {t("stateProvinceRegion")}
                        </label>
                        <select
                          id="stateProvinceRegion"
                          name="stateProvinceRegion"
                          autoComplete="stateProvinceRegion"
                          className="p-1 w-full focus:outline-none border rounded cursor-pointer"
                          value={shipAddress?.stateProvinceRegion || ""}
                          onChange={changeShipAddress}
                        >
                          <option value={""}>{t("selectOption")}</option>
                          <option value={"islandsDistrict"}>
                            {t("islandsDistrict")}
                          </option>
                          <option value={"tsuenWanDistrict"}>
                            {t("tsuenWanDistrict")}
                          </option>
                          <option value={"northDistrict"}>
                            {t("northDistrict")}
                          </option>
                          <option value={"saiKungDistrict"}>
                            {t("saiKungDistrict")}
                          </option>
                          <option value={"shaTinDistrict"}>
                            {t("shaTinDistrict")}
                          </option>
                          <option value={"taiPoDistrict"}>
                            {t("taiPoDistrict")}
                          </option>
                          <option value={"kwaiTsingDistrict"}>
                            {t("kwaiTsingDistrict")}
                          </option>
                          <option value={"tuenMunDistrict"}>
                            {t("tuenMunDistrict")}
                          </option>
                          <option value={"yuenLongDistrict"}>
                            {t("yuenLongDistrict")}
                          </option>
                          <option value={"kwunTongDistrict"}>
                            {t("kwunTongDistrict")}
                          </option>
                          <option value={"shamShuiPoDistrict"}>
                            {t("shamShuiPoDistrict")}
                          </option>
                          <option value={"wongTaiSinDistrict"}>
                            {t("wongTaiSinDistrict")}
                          </option>
                          <option value={"yauTsimMongDistrict"}>
                            {t("yauTsimMongDistrict")}
                          </option>
                          <option value={"kowloonCityDistrict"}>
                            {t("kowloonCityDistrict")}
                          </option>
                          <option value={"wanChaiDistrict"}>
                            {t("wanChaiDistrict")}
                          </option>
                          <option value={"easternDistrict"}>
                            {t("easternDistrict")}
                          </option>
                          <option value={"southernDistrict"}>
                            {t("southernDistrict")}
                          </option>
                        </select>
                        {showErrMessage && !shipAddress.stateProvinceRegion ? (
                          <span className="flex text-sm text-red-600">
                            <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                            {t("stateProvinceRegion") + t("isRequired")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  )}
                </>
              )}
              {shipAddress.country === "taiwan" && (
                <>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full px-2">
                      <InputGroup
                        label={t("cityDistrict")}
                        type="text"
                        name="cityDistrict"
                        value={shipAddress?.cityDistrict || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.cityDistrict ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("cityDistrict") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 p-2">
                      <label htmlFor="category" className="font-Lexend p-1">
                        {t("stateProvinceRegion")}
                      </label>
                      <select
                        id="stateProvinceRegion"
                        name="stateProvinceRegion"
                        autoComplete="stateProvinceRegion"
                        className="p-1 w-full focus:outline-none border rounded cursor-pointer"
                        value={shipAddress?.stateProvinceRegion || ""}
                        onChange={changeShipAddress}
                      >
                        <option value={""}>{t("selectOption")}</option>
                        <option value={"NewTaipeiCity"}>
                          {t("NewTaipeiCity")}
                        </option>
                        <option value={"TaichungCity"}>
                          {t("TaichungCity")}
                        </option>
                        <option value={"KaohsiungCity"}>
                          {t("KaohsiungCity")}
                        </option>
                        <option value={"TaipeiCity"}>{t("TaipeiCity")}</option>
                        <option value={"TaoyuanCity"}>
                          {t("TaoyuanCity")}
                        </option>
                        <option value={"TainanCity"}>{t("TainanCity")}</option>
                        <option value={"HsinchuCity"}>
                          {t("HsinchuCity")}
                        </option>
                        <option value={"KeelungCity"}>
                          {t("KeelungCity")}
                        </option>
                        <option value={"ChiayiCity"}>{t("ChiayiCity")}</option>
                        <option value={"HsinchuCounty"}>
                          {t("HsinchuCounty")}
                        </option>
                        <option value={"ChanghuaCounty"}>
                          {t("ChanghuaCounty")}
                        </option>
                        <option value={"PingtungCounty"}>
                          {t("PingtungCounty")}
                        </option>
                        <option value={"YunlinCounty"}>
                          {t("YunlinCounty")}
                        </option>
                        <option value={"TaitungCounty"}>
                          {t("TaitungCounty")}
                        </option>
                        <option value={"MiaoliCounty"}>
                          {t("MiaoliCounty")}
                        </option>
                        <option value={"NantouCounty"}>
                          {t("NantouCounty")}
                        </option>
                        <option value={"YilanCounty"}>
                          {t("YilanCounty")}
                        </option>
                        <option value={"HualienCounty"}>
                          {t("HualienCounty")}
                        </option>
                        <option value={"PenghuCounty"}>
                          {t("PenghuCounty")}
                        </option>
                        <option value={"ChiayiCounty"}>
                          {t("ChiayiCounty")}
                        </option>
                      </select>
                      {showErrMessage && !shipAddress.stateProvinceRegion ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("stateProvinceRegion") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("zipCode")}
                        type="text"
                        name="zipCode"
                        value={shipAddress?.zipCode || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.zipCode ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("zipCode") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              {shipAddress.country === "singapore" && (
                <>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("islandCity")}
                        type="text"
                        name="islandCity"
                        value={shipAddress?.islandCity || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.islandCity ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("islandCity") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("zipCode")}
                        type="text"
                        name="zipCode"
                        value={shipAddress?.zipCode || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.zipCode ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("zipCode") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              {shipAddress.country === "australia" && (
                <>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("suburbCity")}
                        type="text"
                        name="suburbCity"
                        value={shipAddress?.suburbCity || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.suburbCity ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("suburbCity") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                    <div className="w-full md:w-1/2 p-2">
                      <label htmlFor="category" className="font-Lexend p-1">
                        {t("state")}
                      </label>
                      <select
                        id="state"
                        name="state"
                        autoComplete="state"
                        className="p-1 w-full focus:outline-none border rounded cursor-pointer"
                        value={shipAddress?.state || ""}
                        onChange={changeShipAddress}
                      >
                        <option value={""}>{t("selectOption")}</option>
                        <option value={"NSW"}>NSW</option>
                        <option value={"VIC"}>VIC</option>
                        <option value={"QLD"}>QLD</option>
                        <option value={"SA"}>SA</option>
                        <option value={"WA"}>WA</option>
                        <option value={"TAS"}>TAS</option>
                        <option value={"ACT"}>ACT</option>
                        <option value={"NT"}>NT</option>
                      </select>
                      {showErrMessage && !shipAddress.state ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("state") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("zipCode")}
                        type="text"
                        name="zipCode"
                        value={shipAddress?.zipCode || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.zipCode ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("zipCode") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
              {shipAddress.country === "unitedStates" && (
                <>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full px-2">
                      <InputGroup
                        label={t("cityDistrict")}
                        type="text"
                        name="cityDistrict"
                        value={shipAddress?.cityDistrict || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.cityDistrict ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("cityDistrict") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 p-2">
                      <label htmlFor="category" className="font-Lexend p-1">
                        {t("state")}
                      </label>
                      <select
                        id="state"
                        name="state"
                        autoComplete="state"
                        className="p-1 w-full focus:outline-none border rounded cursor-pointer"
                        value={shipAddress?.state || ""}
                        onChange={changeShipAddress}
                      >
                        <option value={""}>{t("selectOption")}</option>
                        <option value={"Alabama"}>Alabama</option>
                        <option value={"Alaska"}>Alaska</option>
                        <option value={"American Samoa"}>American Samoa</option>
                        <option value={"Arizona"}>Arizona</option>
                        <option value={"California"}>California</option>
                        <option value={"Colorado"}>Colorado</option>
                        <option value={"Connecticut"}>Connecticut</option>
                        <option value={"Delaware"}>Delaware</option>
                        <option value={"District of Columbia"}>
                          District of Columbia
                        </option>
                        <option value={"Federated States of Micronesia"}>
                          Federated States of Micronesia
                        </option>
                        <option value={"Florida"}>Florida</option>
                        <option value={"Georgia"}>Georgia</option>
                        <option value={"Guam"}>Guam</option>
                        <option value={"Hawaii"}>Hawaii</option>
                        <option value={"Idaho"}>Idaho</option>
                        <option value={"Illinois"}>Illinois</option>
                        <option value={"Indiana"}>Indiana</option>
                        <option value={"Iowa"}>Iowa</option>
                        <option value={"Kansas"}>Kansas</option>
                        <option value={"Kentucky"}>Kentucky</option>
                        <option value={"Louisiana"}>Louisiana</option>
                        <option value={"Maine"}>Maine</option>
                        <option value={"Marshall Islands"}>
                          Marshall Islands
                        </option>
                        <option value={"Maryland"}>Maryland</option>
                        <option value={"Maine"}>Maine</option>
                        <option value={"Massachusetts"}>Massachusetts</option>
                        <option value={"Michigan"}>Michigan</option>
                        <option value={"Minnesota"}>Minnesota</option>
                        <option value={"Mississippi"}>Mississippi</option>
                        <option value={"Missouri"}>Missouri</option>
                        <option value={"Montana"}>Montana</option>
                        <option value={"Nebraska"}>Nebraska</option>
                        <option value={"Nevada"}>Nevada</option>
                        <option value={"New Hampshire"}>New Hampshire</option>
                        <option value={"New Jersey"}>New Jersey</option>
                        <option value={"New Mexico"}>New Mexico</option>
                        <option value={"New York"}>New York</option>
                        <option value={"North Carolina"}>North Carolina</option>
                        <option value={"North Dakota"}>North Dakota</option>
                        <option value={"Northern Mariana Islands"}>
                          Northern Mariana Islands
                        </option>
                        <option value={"Ohio"}>Ohio</option>
                        <option value={"Oklahoma"}>Oklahoma</option>
                        <option value={"Palau"}>Palau</option>
                        <option value={"Pennsylvania"}>Pennsylvania</option>
                        <option value={"Puerto Rico"}>Puerto Rico</option>
                        <option value={"Rhode Island"}>Rhode Island</option>
                        <option value={"South Carolina"}>South Carolina</option>
                        <option value={"South Dakota"}>South Dakota</option>
                        <option value={"Tennessee"}>Tennessee</option>
                        <option value={"Texas"}>Texas</option>
                        <option value={"Utah"}>Utah</option>
                        <option value={"Vermont"}>Vermont</option>
                        <option value={"Virgin Island"}>Virgin Island</option>
                        <option value={"Virginia"}>Virginia</option>
                        <option value={"Washington"}>Washington</option>
                        <option value={"West Virginia"}>West Virginia</option>
                        <option value={"Wisconsin"}>Wisconsin</option>
                        <option value={"Wyoming"}>Wyoming</option>
                      </select>
                      {showErrMessage && !shipAddress.state ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("state") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap w-full">
                    <div className="w-full md:w-1/2 px-2">
                      <InputGroup
                        label={t("zipCode")}
                        type="text"
                        name="zipCode"
                        value={shipAddress?.zipCode || ""}
                        onChange={changeShipAddress}
                      />
                      {showErrMessage && !shipAddress.zipCode ? (
                        <span className="flex text-sm text-red-600">
                          <i className="fa-solid fa-triangle-exclamation text-red-600 mr-2 mt-1"></i>
                          {t("zipCode") + t("isRequired")}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </>
              )}
            </>
          )}
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
                  {t("phoneNumber") + t("isRequired")}
                </span>
              ) : null}
            </div>
          </div>
          <div className="flex flex-wrap justify-center mx-auto mt-4">
            <button
              className="hover:opacity-50 bg-gray-600 rounded-md text-center mx-2 px-16 py-2 my-2 text-white outline-none"
              onClick={handleCancelShipAddress}
            >
              {t("cancel")}
            </button>
            <button
              className="hover:opacity-50 rounded-md text-center mx-2 px-16 py-2 my-2 hover:bg-red-800 text-white outline-none"
              onClick={handleSaveShipAddress}
              style={{ backgroundColor: bgColor }}
            >
              {initialData ? t("save") : t("add")}
            </button>
          </div>
        </div>
      </div>
      <SucceedModal isOpen={isOpen} setIsOpen={setIsOpen} text={text} />
    </div>
  );
}

export default AddShippingAddress;
