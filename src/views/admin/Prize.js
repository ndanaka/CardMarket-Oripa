import { useState, useRef } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken, setMultipart } from "../../utils/setHeader";

import AgreeButton from "../../components/Forms/AgreeButton";
import PrizeList from "../../components/Tables/PrizeList";
import PageHeader from "../../components/Forms/PageHeader";
import usePersistedUser from "../../store/usePersistedUser";

import uploadimage from "../../assets/img/icons/upload.png";

const Prize = () => {
  const [user, setUser] = usePersistedUser();
  const fileInputRef = useRef(null); // Create a ref for the file input
  const { t } = useTranslation();

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
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(uploadimage); // Set initial default image URL

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);

    // Generate a preview URL for the selected file
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewUrl(reader.result);
    };
    if (file) {
      reader.readAsDataURL(file);
      setFormData({ ...formData, file: file });
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
    if (user.authority.prize !== 2 && user.authority.prize !== 4) {
      showToast("You have no permission for this action", "error");
      return;
    }

    setAuthToken();
    setMultipart();

    if (!selectedFile) {
      showToast("Prize image is not selected", "error");
      return;
    }

    if (formData.name.trim() === "") {
      showToast("Required prize name", "error");
      return;
    }

    if (parseFloat(formData.rarity) <= 0) {
      showToast("Rarity must be greater than than 0", "error");
      return;
    }

    if (parseInt(formData.cashBack) <= 0) {
      showToast("Cashback must be greater than than 0", "error");
      return;
    }

    api
      .post("/admin/prize_upload", formData)
      .then((res) => {
        if (res.data.status === 1) {
          setFormData({
            ...formData,
            file: null,
            name: "",
            rarity: 0,
            cashBack: 0,
            grade: 1,
          });
          setSelectedFile(null);
          setPreviewUrl(uploadimage);
          fileInputRef.current.value = null; // Reset the input value
          showToast(res.data.msg);
        } else showToast(res.data.msg, "error");
        setTrigger(res.data);
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
      });
  };

  const updatePrize = () => {
    if (user.authority.prize !== 2 && user.authority.prize !== 4) {
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
      <div className="flex flex-col items-center w-full md:w-[70%] m-auto border-2">
        <div className="py-2 w-full bg-admin_theme_color text-gray-200 text-center">
          {t("prize") + " " + t("add")}
        </div>
        <div className="flex flex-wrap justify-between items-stretch w-full m-auto px-5">
          <div className="flex flex-col justify-between items-end w-1/2">
            <div className="flex flex-wrap justify-between items-center my-1 mt-4 px-2 w-full">
              <label htmlFor="prizename" className="text-gray-700 px-2">
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
            <div className="flex flex-wrap justify-between my-1 px-2 w-full">
              <label htmlFor="rarity" className="text-gray-700 px-2">
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
            <div className="flex flex-wrap justify-between my-1 px-2 w-full">
              <label htmlFor="cashBack" className="text-gray-700 px-2">
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
            <div className="flex flex-wrap justify-between my-1 px-2 w-full">
              <label htmlFor="grade" className="text-gray-700 px-2">
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
          <div className="flex flex-col justify-between my-1 mt-4 items-center w-1/2">
            <label htmlFor="fileInput" className="text-gray-700 px-2">
              {t("prize") + t("image")}:{" "}
            </label>
            <input
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              id="fileInput"
              ref={fileInputRef} // Set the ref
              onChange={handleFileChange}
            />
            <label htmlFor="fileInput">
              <img
                src={previewUrl}
                alt="Upload"
                style={{
                  cursor: "pointer",
                  width: "200px",
                  height: "200px",
                  objectFit: "cover",
                }}
              />
            </label>
          </div>
        </div>
        <div className="flex items-center">
          {!cuflag ? (
            <button
              className="p-2 px-4 my-1 button-22 text-white !bg-red-500 !mr-2"
              onClick={() => {
                setCuFlag(true);
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
      <div className="mx-auto mt-5 w-full md:w-[70%] overflow-auto">
        <PrizeList
          trigger={trigger}
          setFormData={setFormData}
          setCuFlag={setCuFlag}
        />
      </div>
    </div>
  );
};

export default Prize;
