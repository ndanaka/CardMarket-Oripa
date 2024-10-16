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
    start_deposite: 0,
    end_deposite: 0,
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
        } else console.log("getRanks Error---->", res.data.err);
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
      showToast("You have no permission for this action", "error");
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
          showToast("Successfully added data.");
        } else if (res.data.status === 2) {
          showToast("Successfully updated data.");
        } else {
          showToast("Failed to process.", "error");
        }
        fileInputRef.current.value = null;
        setImgUrl("");
        setFormData({
          ...formData,
          id: "",
          name: "",
          bonus: 0,
          start_deposite: 0,
          end_deposite: 0,
          file: null,
        });
        setCuFlag(1);
        removeMultipart();
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
      start_deposite: ranks[i].start_deposite,
      end_deposite: ranks[i].end_deposite,
    });
    setCuFlag(0); //set create/update flag as updating
    setImgUrl(process.env.REACT_APP_SERVER_ADDRESS + ranks[i].img_url);
  };

  // handle cancel action
  const CancelRank = () => {
    setImgUrl("");
    setFormData({
      ...formData,
      id: "",
      name: "",
      bonus: 0,
      start_deposite: 0,
      end_deposite: 0,
      file: null,
    });
    setCuFlag(1);
  };

  // handle edit update
  const UpdateRank = () => {
    if (!user.authority["rank"]["write"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    setCuFlag(1);
    AddRank();
  };

  // handle rank delete
  const handleDelete = async () => {
    setIsModalOpen(false);
    if (!user.authority["rank"]["delete"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    const res = await api.delete(`/admin/del_rank/${delRankId}`);
    if (res.data.status === 1) {
      showToast("Successfully Deleted.");
      getRanks();
    } else showToast("Failed to delete.");
  };

  return (
    <div className="p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("rank")} />
      </div>
      <div className="flex flex-col w-full md:w-[70%] border-2 m-auto">
        <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
          {t("rank") + " " + t("add")}
        </div>
        <div className="flex flex-wrap justify-center sm:px-4 pt-2 w-full">
          <div className="flex flex-col w-full xxsm:w-1/2">
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
              <label htmlFor="start_deposite" className="text-gray-700">
                {t("start_deposite")} (¥)
              </label>
              <input
                name="start_deposite"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.start_deposite}
                id="start_deposite"
                autoComplete="start_deposite"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="end_deposite" className="text-gray-700">
                {t("end_deposite")} (¥)
              </label>
              <input
                name="end_deposite"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.end_deposite}
                id="end_deposite"
                autoComplete="end_deposite"
              ></input>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center px-2 pb-2 w-full xxsm:w-1/2">
            <label htmlFor="fileInput" className="text-gray-700 px-1">
              {t("rank") + " " + t("image")}:{" "}
            </label>
            <input
              name="fileInput"
              type="file"
              id="fileInput"
              ref={fileInputRef}
              className="image p-1 w-full form-control"
              onChange={handleFileInputChange}
              autoComplete="name"
            ></input>
            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="prize"
              className={`${imgUrl ? "w-auto h-[250px]" : ""}  object-cover`}
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            />
          </div>
        </div>
        <div className="flex flex-wrap justify-end px-3 pb-2">
          {!cuflag ? (
            <button
              className="button-22 !bg-red-500 !mr-2"
              onClick={CancelRank}
            >
              {t("cancel")}
            </button>
          ) : null}
          <button className="button-22" onClick={UpdateRank}>
            {!cuflag ? t("update") : t("add")}
          </button>
        </div>
      </div>
      <div className="mx-auto my-3 w-full md:w-[70%] overflow-auto">
        <table className="border-2 w-full  m-auto">
          <thead>
            <tr className="bg-admin_theme_color font-bold text-gray-200">
              <th>{t("no")}</th>
              <th>{t("name")}</th>
              <th>{t("bonus")}</th>
              <th>{t("deposite") + " " + t("amount")}</th>
              <th>{t("image")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {ranks ? (
              ranks.map((data, i) => (
                <tr key={data._id} className="border-2">
                  <td>{i + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.bonus}%</td>
                  <td>
                    {"¥ "+formatPrice(data.start_deposite)} ~{" "}
                    {data.name === "Platinum"
                      ? ""
                      : "¥ "+formatPrice(data.end_deposite)}
                  </td>
                  <td>
                    <img
                      className="m-auto w-auto h-[100px]"
                      src={process.env.REACT_APP_SERVER_ADDRESS + data.img_url}
                      alt={`${data._id} ranks`} // Meaningful alt text
                    />
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
                <td colSpan="5">There is no Point</td>
              </tr>
            )}
          </tbody>
        </table>
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
