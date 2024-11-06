import { useState, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart, removeMultipart } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import usePersistedUser from "../../store/usePersistedUser";

import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";

import uploadimage from "../../assets/img/icons/upload.png";
import formatPrice from "../../utils/formatPrice";

function Point() {
  const [user, setUser] = usePersistedUser();
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    id: "",
    pointNum: 0,
    price: 0,
    file: null,
  });
  const [points, setPoints] = useState([]);
  const [cuflag, setCuFlag] = useState(1); //determine whether the status is adding or editing, default is adding (1)
  const [imgUrl, setImgUrl] = useState(""); //local image url when file selected
  const [delPointId, setDelPointId] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fileInputRef = useRef(null);

  useEffect(() => {
    setAuthToken();
    getPoint();
  }, []);

  //handle form change, formData input
  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  //get registered point
  const getPoint = () => {
    setAuthToken();
    api
      .get("/admin/get_point")
      .then((res) => {
        if (res.data.status === 1) {
          setPoints(res.data.points);
        }
      })
      .catch((err) => console.error(err));
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

  /* add and update prize with image file uploading
  if there is a property 'id' vin formData, this perform update of prize */
  const AddPoint = () => {
    if (!user.authority["point"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setMultipart();
    setAuthToken();

    if (parseFloat(formData.pointNum) <= 0) {
      showToast(t("validPointAmount"), "error");
    } else if (parseInt(formData.price) <= 0) {
      showToast(t("validPointPrice"), "error");
    } else if (
      cuflag === 1 &&
      (formData.file === NaN ||
        formData.file === null ||
        formData.file === undefined)
    ) {
      showToast(t("selectImage"), "error");
    } else {
      api.post("/admin/point_upload", formData).then((res) => {
        if (res.data.status === 1) {
          showToast(t("successAdded"), "success");
          setImgUrl("");
          fileInputRef.current.value = null;
          setFormData({
            ...formData,
            id: "",
            pointNum: 0,
            price: 0,
            file: null,
          });
          setCuFlag(1); //set create/update flag as creating
          removeMultipart();
        } else if (res.data.status === 2) {
          showToast(t("successUpdated"), "success");
          setImgUrl("");
          setFormData({
            ...formData,
            id: "",
            pointNum: 0,
            price: 0,
            file: null,
          });
          setCuFlag(1); //set create/update flag as creating
          removeMultipart();
        } else {
          showToast(t("faileReq"), "error");
        }
        getPoint();
      });
    }
  };

  //handle Edit Button click event
  const handleEdit = (i) => {
    setFormData({
      id: points[i]._id,
      pointNum: points[i].point_num,
      price: points[i].price,
    });
    setCuFlag(0); //set create/update flag as updating
    setImgUrl(process.env.REACT_APP_SERVER_ADDRESS + points[i].img_url);
  };

  //handle point update
  const CancelPoint = () => {
    setImgUrl("");
    setFormData({
      ...formData,
      id: "",
      pointNum: 0,
      price: 0,
      file: null,
    });
    setCuFlag(1);
  };

  //handle point update
  const UpdatePoint = () => {
    if (!user.authority["point"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    setCuFlag(1);

    AddPoint();
  };

  //handle point delete
  const pointDel = () => {
    if (!user.authority["point"]["delete"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    api.delete(`/admin/del_point/${delPointId}`).then((res) => {
      if (res.data.status === 1) {
        showToast(t("successDeleted"), "success");
        getPoint();
      } else showToast(t("failedDeleted"), "success");
    });
  };

  const handleDelete = () => {
    setIsModalOpen(false);
    pointDel();
  };

  return (
    <div className="p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("point")} />
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full lg:w-[35%] border-1 mb-2 h-fit">
          <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
            {t("point") + " " + t("add")}
          </div>
          <div className="flex flex-col justify-between items-center p-2 w-full">
            <label
              htmlFor="fileInput"
              className="text-gray-700 px-1 justify-start flex flex-wrap w-full"
            >
              {t("point") + " " + t("image")}
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
          <div className="flex flex-col p-2">
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="pointNum" className="text-gray-700">
                {t("amount")} (pt)
              </label>
              <input
                name="pointNum"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.pointNum}
                id="pointNum"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="price" className="text-gray-700">
                {t("price")} (¥)
              </label>
              <input
                name="price"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.price}
                id="price"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex flex-wrap justify-end px-2 py-1">
              {!cuflag ? (
                <button
                  className="button-22 !bg-red-500 !mr-2"
                  onClick={CancelPoint}
                >
                  {t("cancel")}
                </button>
              ) : null}
              <button className="button-22" onClick={UpdatePoint}>
                {!cuflag ? t("update") : t("add")}
              </button>
            </div>
          </div>
        </div>
        <div className="overflow-auto flex flex-wrap w-full lg:w-[65%] h-fit">
          <table className="w-full m-auto">
            <thead>
              <tr className="bg-admin_theme_color font-bold text-gray-200">
                <th>{t("no")}</th>
                <th>{t("image")}</th>
                <th>{t("point")}</th>
                <th>{t("price")}</th>
                <th>{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {points && points.length !== 0 ? (
                points.map((data, i) => (
                  <tr key={data._id} className="border-2">
                    <td>{i + 1}</td>
                    <td>
                      <img
                        className="m-auto"
                        src={
                          process.env.REACT_APP_SERVER_ADDRESS + data.img_url
                        }
                        width="50px"
                        height="50px"
                        alt={`${data.point_num} points`} // Meaningful alt text
                      />
                    </td>
                    <td>{formatPrice(data.point_num)}pt</td>
                    <td>¥{formatPrice(data.price)}</td>
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
                          setDelPointId(data._id);
                          setIsModalOpen(true);
                        }}
                      ></span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">{t("nopoint")}</td>
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

export default Point;
