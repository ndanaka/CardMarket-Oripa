import { useTranslation } from "react-i18next";
import { useState, useRef } from "react";
import { HexColorPicker } from "react-colorful";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart, removeMultipart } from "../../utils/setHeader";

import PageHeader from "../../components/Forms/PageHeader";
import uploadimage from "../../assets/img/icons/upload.png";

function Theme() {
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [imgUrl, setImgUrl] = useState(null);
  const [bgColor, setBgColor] = useState("#e50e0e");
  const [formData, setFormData] = useState({ bgColor: "", file: null });
  const [, setSpinFlag] = useState(false);

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

  const cancelLogo = () => {
    setFormData({ bgColor: "", file: null });
    fileInputRef.current.value = null;
    setImgUrl(null);

    removeMultipart();
  };

  const handleCangeLogo = async () => {
    if (
      formData.file === NaN ||
      formData.file === null ||
      formData.file === undefined
    ) {
      return showToast(
        `${t("logo") + " " + t("image") + " " + t("isRequired")}`,
        "error"
      );
    }

    try {
      setMultipart();
      setAuthToken();

      setSpinFlag(true);
      const res = await api.post("/admin/changeLogo", formData);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successChanged"), "success");
        cancelLogo();
      } else {
        showToast(t("failedReq"), "error");
      }
    } catch (error) {
      showToast(t("failedReq", "error"));
    }
  };

  const handleCangeBgColor = async () => {
    formData.bgColor = bgColor;

    try {
      setAuthToken();

      setSpinFlag(true);
      const res = await api.post("/admin/changeBgColor", {
        bgColor: formData.bgColor,
      });
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successChanged"), "success");
        cancelLogo();
      } else {
        showToast(t("failedReq"), "error");
      }
    } catch (error) {
      showToast(t("failedReq", "error"));
    }
  };

  return (
    <div className="w-full px-3 pt-2 py-12">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("theme")} />
      </div>
      <div className="flex flex-wrap w-full md:w-[70%] mx-auto">
        <div className="overflow-auto w-full md:w-1/2 p-2">
          <div className="text-xl text-center">
            {t("logo") + " " + t("image")}
            <hr className="my-1"></hr>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-wrap py-2 mx-auto">
              <input
                name="fileInput"
                type="file"
                id="fileInput"
                ref={fileInputRef}
                className="image p-1 w-full form-control"
                onChange={handleFileInputChange}
                autoComplete="name"
              />
              <img
                src={imgUrl ? imgUrl : uploadimage}
                alt="prize"
                className="w-[200px] h-[200px] object-cover"
                onClick={() => {
                  document.getElementById("fileInput").click();
                }}
              />
            </div>
            <div className="flex flex-wrap py-2 justify-end">
              {formData.file ? (
                <button
                  className="button-22 !bg-red-500 !mr-2"
                  onClick={cancelLogo}
                >
                  {t("cancel")}
                </button>
              ) : null}
              <button className="button-22" onClick={handleCangeLogo}>
                {t("save")}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-auto w-full md:w-1/2 p-2">
          <div className="text-xl text-center">
            <label htmlFor="color" className="text-center text-gray-700">
              {t("color")}
            </label>
            <hr className="my-1"></hr>
          </div>
          <div className="flex flex-col">
            <div className="flex flex-col py-2 mx-auto">
              <HexColorPicker color={bgColor} onChange={setBgColor} />
              <p className="mt-2 text-lg font-semibold text-gray-700">
                {t("selected")}: {bgColor}
              </p>
            </div>
            <div className="flex flex-wrap py-2 justify-end">
              <button className="button-22" onClick={handleCangeBgColor}>
                {t("save")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Theme;
