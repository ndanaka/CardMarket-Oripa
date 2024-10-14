import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import {
  setAuthToken,
  setMultipart,
  removeMultipart,
} from "../../utils/setHeader";

import AgreeButton from "../../components/Forms/AgreeButton";
import PrizeList from "../../components/Tables/PrizeList";
import PageHeader from "../../components/Forms/PageHeader";
import usePersistedUser from "../../store/usePersistedUser";

import uploadimage from "../../assets/img/icons/upload.png";

const Prize = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    rarity: 0,
    cashBack: 0,
    file: null,
    grade: 1,
  });
  const [cuflag, setCuFlag] = useState(1); //determine whether the status is adding or editing, default is adding (1)
  const [trigger, setTrigger] = useState(null); //for PrizeList component refresh
  const [imgUrl, setImgUrl] = useState(""); //local image url when file selected
  const [user, setUser] = usePersistedUser();
  const { t } = useTranslation();

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file !== undefined) {
      setFormData({ ...formData, file: file });
      const reader = new FileReader();

      reader.onload = (e) => {
        setImgUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  //handle form change, formData input
  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  /* Add/Update prize with image file uploading
  If formData.id has value, this function perform as update one */
  const addPrize = async () => {
    if (!user.authority["prize"]["write"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    setAuthToken();
    setMultipart();

    if (formData.name.trim() === "") {
      showToast("Required prize name", "error");
    } else if (parseFloat(formData.rarity) <= 0) {
      showToast("Rarity must be greater than than 0", "error");
    } else if (parseInt(formData.cashBack) <= 0) {
      showToast("Cashback must be greater than than 0", "error");
    } else if (
      cuflag === 1 &&
      (formData.file === NaN ||
        formData.file === null ||
        formData.file === undefined)
    ) {
      showToast("Prize image is not selected", "error");
    } else {
      api
        .post("/admin/prize_upload", formData)
        .then((res) => {
          if (res.data.status === 1) {
            setImgUrl(null);
            setFormData({
              ...formData,
              file: null,
              name: "",
              rarity: 0,
              cashBack: 0,
              grade: 1,
            });
            removeMultipart();
            showToast(res.data.msg);
          } else showToast(res.data.msg, "error");
          setTrigger(res.data);
        })
        .catch((err) => {
          console.error("Error uploading file:", err);
        });
    }
  };

  const updatePrize = () => {
    if (!user.authority["prize"]["write"]) {
      showToast("You have no permission for this action", "error");
      return;
    }
    setCuFlag(1);
    addPrize();
  };

  return (
    <div className="p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("prize")} />
      </div>
      <div className="flex flex-col w-full md:w-[70%] border-2 m-auto">
        <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
          {t("prize") + " " + t("add")}
        </div>
        <div className="flex flex-wrap justify-center sm:px-4 pt-2 w-full">
          <div className="flex flex-col w-full xxsm:w-1/2">
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="prizename" className="text-gray-700">
                {t("prize") + t("name")}:{" "}
              </label>
              <input
                name="name"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.name}
                id="prizename"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="rarity" className="text-gray-700">
                {t("rarity")}:{" "}
              </label>
              <input
                name="rarity"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.rarity}
                id="rarity"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="cashBack" className="text-gray-700">
                {t("cashback")}:{" "}
              </label>
              <input
                name="cashBack"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.cashBack}
                id="cashBack"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="grade" className="text-gray-700">
                {t("Grade")}:{" "}
              </label>
              <select
                name="grade"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.grade}
                id="grade"
                autoComplete="name"
              >
                <option value="1">First</option>
                <option value="2">Second</option>
                <option value="3">Third</option>
                <option value="4">Fourth</option>
              </select>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center px-2 pb-2 w-full xxsm:w-1/2">
            <label htmlFor="fileInput" className="text-gray-700 p-1">
              {t("prize") + t("image")}:{" "}
            </label>
            <input
              name="file"
              type="file"
              id="fileInput"
              className="image p-1 w-full form-control"
              onChange={handleFileInputChange}
              autoComplete="name"
            ></input>
            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="prize"
              className={`${
                imgUrl ? "w-[-webkit-fill-available] h-[200px]" : ""
              }  object-cover`}
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-end px-3 pb-2">
          {!cuflag ? (
            <button
              className="p-2 px-4 my-1 button-22 text-white !bg-red-500 !mr-2"
              onClick={() => {
                setCuFlag(true);
                setImgUrl(null);
                setFormData({
                  ...formData,
                  file: null,
                  name: "",
                  rarity: 0,
                  cashBack: 0,
                  grade: 1,
                });
              }}
            >
              {t("cancel")}
            </button>
          ) : null}
          {cuflag ? (
            <AgreeButton name={t("add")} addclass="" onClick={addPrize} />
          ) : (
            <AgreeButton name={t("update")} addclass="" onClick={updatePrize} />
          )}
        </div>
      </div>
      <div className="mx-auto my-3 w-full md:w-[70%] overflow-auto">
        <PrizeList
          trigger={trigger}
          setFormData={setFormData}
          setCuFlag={setCuFlag}
          setImgUrl={setImgUrl}
        />
      </div>
    </div>
  );
};

export default Prize;
