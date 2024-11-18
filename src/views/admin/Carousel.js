import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart, removeMultipart } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import usePersistedUser from "../../store/usePersistedUser";

import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";
import Spinner from "../../components/Others/Spinner";
import uploadimage from "../../assets/img/icons/upload.png";

function Carousel() {
  const [user] = usePersistedUser();
  const { t } = useTranslation();
  const fileInputRef = useRef(null);

  const [carousels, setCarousels] = useState([]);
  const [cuflag, setCuFlag] = useState(1);
  const [imgUrl, setImgUrl] = useState("");
  const [carouselId, setCarouselId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);
  const [formData, setFormData] = useState({
    id: "",
    link: "",
    file: null,
  });

  useEffect(() => {
    setAuthToken();
    getCarousels();
  }, []);

  //handle form change, formData input
  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const getCarousels = async () => {
    setAuthToken();

    setSpinFlag(true);
    const res = await api.get("/admin/get_carousels");
    setSpinFlag(false);

    if (res.data.status === 1) {
      setCarousels(res.data.carousels);
    }
  };

  const handleImageChange = (event) => {
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

  const handleAddOrEdit = async () => {
    if (!user.authority["carousel"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setMultipart();
    setAuthToken();

    if (formData.link.trim() === "") {
      showToast(t("link" + t("isRequired")), "error");
    } else if (
      cuflag === 1 &&
      (formData.file === NaN ||
        formData.file === null ||
        formData.file === undefined)
    ) {
      showToast(t("selectImage"), "error");
    } else {
      setSpinFlag(true);
      const res = await api.post("/admin/carousel", formData);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successAdded"), "success");
        handleCancel();
      } else if (res.data.status === 2) {
        showToast(t("successUpdated"), "success");
        handleCancel();
      } else {
        showToast(t("faileReq"), "error");
      }
      getCarousels();
    }
  };

  const handleDelete = async () => {
    setIsModalOpen(false);

    if (!user.authority["carousel"]["delete"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setSpinFlag(true);
    const res = await api.delete(`/admin/del_carousel/${carouselId}`);
    setSpinFlag(false);

    if (res.data.status === 1) {
      showToast(t("successDeleted"), "success");
      getCarousels();
    } else showToast(t("failedDeleted"), "error");
  };

  const handleCancel = () => {
    setImgUrl("");
    fileInputRef.current.value = null;
    setFormData({
      id: "",
      link: "",
      file: null,
    });
    setCuFlag(1);
    removeMultipart();
  };

  const handleEdit = (i) => {
    setFormData({
      id: carousels[i]._id,
      link: carousels[i].link,
    });
    setCuFlag(0);
    setImgUrl(process.env.REACT_APP_SERVER_ADDRESS + carousels[i].img_url);
  };

  return (
    <div className="px-3 pt-2 py-12">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("carousel")} />
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full md:w-[35%] border-1 mb-2 h-fit">
          <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
            {t("add") + " " + t("carousel")}
          </div>
          <div className="flex flex-col justify-between items-center p-2 w-full">
            <label
              htmlFor="fileInput"
              className="text-gray-700 px-1 justify-start flex flex-wrap w-full"
            >
              {t("image")}
            </label>
            <input
              name="fileInput"
              type="file"
              id="fileInput"
              ref={fileInputRef}
              className="image p-1 w-full form-control"
              onChange={handleImageChange}
              autoComplete="name"
            ></input>
            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="prize"
              className={`cursor-pointer ${
                imgUrl ? "w-auto h-[250px]" : ""
              }  object-cover`}
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            />
          </div>
          <div className="flex flex-col p-2">
            <label htmlFor="pointNum" className="text-gray-700 px-1">
              {t("link")}
            </label>
            <div className="input flex-grow m-1">
              <input
                name="link"
                className="form-control py-2"
                onChange={changeFormData}
                value={formData.link}
                id="link"
                autoComplete="link"
              />
            </div>
            <div className="addBtn flex justify-end m-1">
              {!cuflag ? (
                <button
                  className="button-22 !bg-red-500 mx-1"
                  onClick={handleCancel}
                >
                  {t("cancel")}
                </button>
              ) : null}
              <button className="button-22" onClick={handleAddOrEdit}>
                {!cuflag ? t("update") : t("add")}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-auto flex flex-wrap w-full md:w-[65%] h-fit">
          <div className="border-1 py-2 bg-admin_theme_color text-gray-200 text-center w-full">
            {t("carousel") + " " + t("list")}
          </div>
          <table className="w-full">
            <thead>
              <tr className="bg-admin_theme_color font-bold text-gray-200">
                <th>{t("no")}</th>
                <th>{t("image")}</th>
                <th>{t("link")}</th>
                <th>{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {carousels && carousels.length !== 0 ? (
                carousels.map((carousel, i) => (
                  <tr key={carousel._id} className="border-2">
                    <td>{i + 1}</td>
                    <td>
                      <img
                        className="m-auto"
                        src={
                          process.env.REACT_APP_SERVER_ADDRESS +
                          carousel.img_url
                        }
                        width="100px"
                      />
                    </td>
                    <td>{carousel.link}</td>
                    <td>
                      <span
                        id={carousel._id}
                        className="fa fa-edit p-1 cursor-pointer"
                        onClick={() => {
                          handleEdit(i);
                        }}
                      ></span>
                      <span
                        id={carousel._id}
                        className="fa fa-remove p-1 cursor-pointer"
                        onClick={() => {
                          setCarouselId(carousel._id);
                          setIsModalOpen(true);
                        }}
                      ></span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">{t("noCarousel")}</td>
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

export default Carousel;
