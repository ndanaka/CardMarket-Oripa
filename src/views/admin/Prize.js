import { useState } from "react";
import AgreeButton from "../../components/Forms/AgreeButton";
import PrizeList from "../../components/Tables/PrizeList";
import api from "../../utils/api";
import { setAuthToken, setMultipart } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import uploadimage from "../../assets/img/icons/upload.png";
import PageHeader from "../../components/Forms/PageHeader";
import GetUser from "../../utils/getUserAtom";
import { useTranslation } from "react-i18next";

const Prize = () => {
  const [formData, setFormData] = useState({
    id: "",
    name: "",
    rarity: 0,
    cashBack: 0,
    file: null,
  });
  const [cuflag, setCuFlag] = useState(1); //determine whether the status is adding or editing, default is adding (1)
  const [trigger, setTrigger] = useState(null); //for PrizeList component refresh
  const [imgUrl, setImgUrl] = useState(""); //local image url when file selected
  const {user} = GetUser();
  const { t } = useTranslation();

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    if (file != undefined) {
      setFormData({ ...formData, file: file });
      const reader = new FileReader();

      reader.onload = (e) => {
        setImgUrl(e.target.result);
        console.log(imgUrl);
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
  const uploadPrize = async () => {
    if(user.authority.prize != 2 && user.authority.prize != 4) {
      showToast("You have no permission for this action", 'error');
      return;
    }
    setAuthToken();
    setMultipart();
    api
      .post("/admin/prize_upload", formData)
      .then((res) => {
        if (res.data.status === 1) {
          setImgUrl(null);
          setFormData({ ...formData, file: null });
          showToast(res.data.msg);
        } else showToast(res.data.msg, "error");
        setTrigger(res.data);
      })
      .catch((err) => {
        console.error("Error uploading file:", err);
      });
  };

  const updatePrize = () => {
    if(user.authority.prize != 2 && user.authority.prize != 4) {
      showToast("You have no permission for this action", 'error');
      return;
    }
    setCuFlag(1);
    uploadPrize();
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
              <label className="text-gray-700 px-2">
                {t("prize") + t("name")}:{" "}
              </label>
              <input
                name="name"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.name}
              ></input>
            </div>
            <div className="flex flex-wrap justify-between my-1 px-2 w-full">
              <label className="text-gray-700 px-2">{t("rarity")}: </label>
              <input
                name="rarity"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.rarity}
              ></input>
            </div>
            <div className="flex flex-wrap justify-between my-1 px-2 w-full">
              <label className="text-gray-700 px-2">{t("cashback")}: </label>
              <input
                name="cashBack"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.cashBack}
              ></input>
            </div>
          </div>
          <div className="flex flex-col justify-between my-1 mt-4 items-center w-1/2">
            <label className="text-gray-700 px-2">
              {t("prize") + t("image")}:{" "}
            </label>
            <input
              name="file"
              type="file"
              id="fileInput"
              className="image p-1 w-full form-control"
              onChange={handleFileInputChange}
            ></input>
            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="prize image"
              width="150"
              height="150"
              className="image mx-auto mt-2 max-w-[200px]"
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            ></img>
          </div>
        </div>
        <div className="flex items-center">
          {!cuflag ? (
            <button
              className="button-22 !bg-red-500 !mr-2"
              onClick={() => {
                setCuFlag(true);
                setFormData({});
              }}
            >
              {t("cancel")}
            </button>
          ) : null}
          {cuflag ? (
            <AgreeButton name={t("add")} addclass="" onClick={uploadPrize} />
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
