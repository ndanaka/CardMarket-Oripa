import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart, removeMultipart } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import usePersistedUser from "../../store/usePersistedUser";

import AgreeButton from "../../components/Forms/AgreeButton";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";

import uploadimage from "../../assets/img/icons/upload.png";
import formatPrice from "../../utils/formatPrice";

function Rank() {
  const [user, setUser] = usePersistedUser();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    id: "",
    name: "",
    bonus: 0,
    start_amount: 0,
    end_amount: 0,
    last: false,
    file: null,
  });
  const [ranks, setRanks] = useState([]);
  const [cuflag, setCuFlag] = useState(1); //determine whether the status is adding or editing, default is adding (1)
  const [imgUrl, setImgUrl] = useState(""); //local image url when file selected
  const [delRankId, setDelRankId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setAuthToken();
    getRanks();
  }, []);

  // get all ranks
  const getRanks = async () => {
    setAuthToken();
    api
      .get("/admin/get_rank")
      .then((res) => {
        if (res.data.status === 1) {
          setRanks(res.data.ranks);
        }
      })
      .catch((err) => console.error(err));
  };

  //handle form change, formData input
  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

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

  // add or update rank
  const AddRank = () => {
    if (!user.authority["rank"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setMultipart();
    setAuthToken();

    if (formData.name.trim() === "") {
      showToast(
        `${t("rank") + " " + t("name") + " " + t("isRequired")}`,
        "error"
      );
    } else if (
      !formData.last &&
      parseInt(formData.end_amount) <= parseInt(formData.start_amount)
    ) {
      showToast(t("rankAmountinvalid"), "error");
    } else if (
      cuflag === 1 &&
      (formData.file === NaN ||
        formData.file === null ||
        formData.file === undefined)
    ) {
      showToast(
        `${t("rank") + " " + t("image") + " " + t("isRequired")}`,
        "error"
      );
    } else {
      api.post("/admin/rank_save", formData).then((res) => {
        if (res.data.status === 1) {
          showToast(t("successAdded", "success"));
        } else if (res.data.status === 2) {
          showToast(t("successUpdated", "success"));
        } else {
          showToast(t("failedReq"), "error");
        }
        cancelRank();
        getRanks();
      });
    }
  };

  //handle Edit Button click event
  const handleEdit = (i) => {
    setFormData({
      id: ranks[i]._id,
      name: ranks[i].name,
      bonus: ranks[i].bonus,
      start_amount: ranks[i].start_amount,
      end_amount: ranks[i].end_amount,
      last: ranks[i].last,
    });
    setCuFlag(0); //set create/update flag as updating
    setImgUrl(process.env.REACT_APP_SERVER_ADDRESS + ranks[i].img_url);
  };

  // handle cancel action
  const cancelRank = () => {
    setImgUrl("");
    fileInputRef.current.value = null;
    setFormData({
      ...formData,
      id: "",
      name: "",
      bonus: 0,
      start_amount: 0,
      end_amount: 0,
      last: false,
      file: null,
    });
    setCuFlag(1);
    removeMultipart();
  };

  // handle edit update
  const UpdateRank = () => {
    if (!user.authority["rank"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setCuFlag(1);
    AddRank();
  };

  // handle rank delete
  const handleDelete = async () => {
    setIsModalOpen(false);
    if (!user.authority["rank"]["delete"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    const res = await api.delete(`/admin/del_rank/${delRankId}`);
    if (res.data.status === 1) {
      showToast(t("successDeleted"), "success");
      getRanks();
    } else showToast(t("failedDeleted"), "error");
  };

  return (
    <div className="p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("rank")} />
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full lg:w-[35%] mb-2 border-1 h-fit">
          <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
            {t("rank") + " " + t("add")}
          </div>
          <div className="flex flex-col justify-between items-center p-2 w-full">
            <label
              htmlFor="fileInput"
              className="text-gray-700 px-1 justify-start flex flex-wrap w-full"
            >
              {t("rank") + " " + t("image")}
            </label>
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
              className={`${imgUrl ? "w-auto h-[250px]" : ""} object-cover`}
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            />
          </div>
          <div className="flex flex-col p-2">
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="name" className="text-gray-700">
                {t("name")}
              </label>
              <input
                name="name"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.name}
                id="name"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="bonus" className="text-gray-700">
                {t("bonus")} (%)
              </label>
              <input
                name="bonus"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.bonus}
                id="bonus"
                autoComplete="bonus"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="start_amount" className="text-gray-700">
                {t("start_amount")} (pt)
              </label>
              <input
                name="start_amount"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.start_amount}
                id="start_amount"
                autoComplete="start_amount"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between">
              <div className="flex flex-wrap justify-between items-center my-1 px-2 w-1/2">
                <label htmlFor="end_amount" className="text-gray-700">
                  {t("end_amount")} (pt)
                </label>
                <input
                  name="end_amount"
                  className="p-1 w-full form-control"
                  onChange={changeFormData}
                  value={formData.end_amount}
                  id="end_amount"
                  autoComplete="end_amount"
                ></input>
              </div>
              <div className="flex flex-wrap justify-between items-center my-1 px-2 w-1/2">
                <label htmlFor="end_amount" className="text-gray-700">
                  {t("last") + " " + t("rank")}
                </label>
                <select
                  name="last"
                  className="p-1 w-full form-control cursor-pointer"
                  onChange={changeFormData}
                  value={formData.last}
                  id="last"
                  autoComplete="last"
                >
                  <option value={false}>{t("no")}</option>
                  <option value={true}>{t("yes")}</option>
                </select>
              </div>
            </div>
            <div className="flex flex-wrap justify-end px-2 py-1">
              {!cuflag ? (
                <button
                  className="button-22 !bg-red-500 !mr-2"
                  onClick={cancelRank}
                >
                  {t("cancel")}
                </button>
              ) : null}
              <button className="button-22" onClick={UpdateRank}>
                {!cuflag ? t("update") : t("add")}
              </button>
            </div>
          </div>
        </div>
        <div className="flex flex-wrap w-full lg:w-[65%] h-fit">
          <table className="w-full m-auto">
            <thead>
              <tr className="bg-admin_theme_color font-bold text-gray-200">
                <th>{t("no")}</th>
                <th>{t("image")}</th>
                <th>{t("name")}</th>
                <th>{t("bonus")}</th>
                <th>{t("purchasedPointsAmount")}</th>
                <th>{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {ranks && ranks.length !== 0 ? (
                ranks.map((data, i) => (
                  <tr key={data._id} className="border-2">
                    <td>{i + 1}</td>
                    <td>
                      <img
                        className="m-auto w-auto h-[60px]"
                        src={
                          process.env.REACT_APP_SERVER_ADDRESS + data.img_url
                        }
                        alt={`${data._id} ranks`} // Meaningful alt text
                      />
                    </td>
                    <td>{data.name}</td>
                    <td>{data.bonus}%</td>
                    <td>
                      {formatPrice(data.start_amount) + "pt"} ~{" "}
                      {data.last ? "" : formatPrice(data.end_amount) + "pt"}
                    </td>
                    <td>
                      <span
                        id={data._id}
                        className="fa fa-edit p-1 cursor-pointer"
                        onClick={() => {
                          handleEdit(i);
                        }}
                      ></span>
                      <span
                        id={data._id}
                        className="fa fa-remove p-1 cursor-pointer"
                        onClick={() => {
                          setDelRankId(data._id);
                          setIsModalOpen(true);
                        }}
                      ></span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">{t("norank")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Rank;
