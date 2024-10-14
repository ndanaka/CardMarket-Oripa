import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import formatDate from "../../utils/formatDate";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import { setMultipart, removeMultipart } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import AgreeButton from "../../components/Forms/AgreeButton";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";

import uploadimage from "../../assets/img/icons/upload.png";
import formatPrice from "../../utils/formatPrice";

function Gacha() {
  const navigate = useNavigate();
  const [user, setUser] = usePersistedUser();
  const { t } = useTranslation();

  //new Gacha data
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    totalNum: 0,
    category: "",
    file: null,
  });
  const [categoryList, setCategoryList] = useState(""); //registered Category list for category select
  const [imgUrl, setImgUrl] = useState(""); //local image url when image file select
  const [gacha, setGacha] = useState(null); //registered Gacha list
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delGachaId, setDelGachaId] = useState(null);

  const fileInputRef = useRef(null); // Create a ref for the file input

  useEffect(() => {
    getCategory();
    userUpdateData();
    getGacha();
  }, []);

  const userUpdateData = () => {
    if (user) {
      api
        .get(`/admin/get_admin/${user.user_id}`)
        .then((res) => {
          if (res.data.status === 1) {
            res.data.admin.role = "admin";
            setUser(res.data.admin);
          }
        })
        .catch((err) => {
          showToast("Try to login again", "error");
        });
    }
  };

  //handle image file select change
  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    setFormData({ ...formData, file: file });
    const reader = new FileReader();

    reader.onload = (e) => {
      setImgUrl(e.target.result);
    };
    reader.readAsDataURL(file);
  };

  const toGachaDetail = (gachaId) => {
    navigate("/admin/gacha-detail", { state: { gachaId: gachaId } });
  };

  const changeFormData = (e) => {
    setFormData({
      ...formData,
      [e.target.name]:
        e.target.name === "file" ? e.target.files[0] : e.target.value,
    });
  };

  //get registered Category list
  const getCategory = () => {
    api
      .get("admin/get_category")
      .then((res) => {
        if (res.data.status === 1) {
          setCategoryList(res.data.category);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  };

  const addGacha = () => {
    if (!user.authority["gacha"]["write"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    setAuthToken();
    setMultipart();

    if (formData.name.trim() === "") {
      showToast("Required gacha name", "error");
    } else if (parseFloat(formData.price) <= 0) {
      showToast("Gacha price must be greater than than 0", "error");
    } else if (formData.category.trim() === "") {
      showToast("Must selete the gacha category", "error");
    } else if (parseInt(formData.totalNum) <= 0) {
      showToast("Gacha total number must be greater than than 0", "error");
    } else if (
      formData.file === NaN ||
      formData.file === null ||
      formData.file === undefined
    ) {
      showToast("Must selete the gacha image", "error");
    } else {
      api
        .post("/admin/gacha/add", formData)
        .then((res) => {
          if (res.data.status === 1) {
            showToast(res.data.msg);
            setImgUrl("");
            fileInputRef.current.value = null;
            setFormData({
              ...formData,
              file: null,
              name: "",
              price: 0,
              totalNum: 0,
              category: "",
            });
            removeMultipart();
            getCategory();
            getGacha();
          } else showToast(res.data.msg, "error");
        })
        .catch((err) => {
          console.error("Error uploading file:", err);
        });
    }
  };

  //get registered Gacha list
  const getGacha = () => {
    api
      .get("/admin/gacha")
      .then((res) => {
        if (res.data.status === 1) setGacha(res.data.gachaList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const setRelease = (id) => {
    if (!user.authority["gacha"]["write"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    api.get(`/admin/gacha/set_release/${id}`).then((res) => {
      if (res.data.status === 1) {
        showToast("Set Gacha Release Successfully.");
        getGacha();
      } else {
        showToast("Gacha Release Failed.");
      }
    });
  };

  const gachaDel = () => {
    api
      .delete(`/admin/gacha/${delGachaId}`)
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Gacha delete successfully.");
          getGacha();
        } else showToast("Gacha Delete Failed.", "error");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    if (!user.authority["gacha"]["delete"]) {
      showToast("You have no permission for this action", "error");
      return;
    }

    gachaDel();
    setIsModalOpen(false);
  };

  return (
    <div className="relative p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("gacha")} />
      </div>
      <div className="flex flex-col items-center w-full md:w-[70%] m-auto border-2">
        <div className="py-2 w-full bg-admin_theme_color text-gray-200 text-center">
          {t("gacha") + t("add")}
        </div>
        <div className="flex flex-wrap justify-center items-center w-full mt-3">
          <div className="flex flex-col w-full xxsm:w-1/2">
            <div className="flex justify-between items-center p-2 px-3 w-full">
              <label htmlFor="name" className="text-gray-700 pr-2">
                {t("name")}:{" "}
              </label>
              <input
                name="name"
                className="p-1 w-3/5 md:w-1/2 form-control"
                onChange={changeFormData}
                value={formData.name}
                id="name"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex justify-between items-center p-2 px-3 w-full">
              <label htmlFor="price" className="text-gray-700 pr-2">
                {t("price")}:{" "}
              </label>
              <input
                name="price"
                className="p-1 w-3/5 md:w-1/2 form-control"
                onChange={changeFormData}
                value={formData.price}
                id="price"
                autoComplete="name"
              ></input>
            </div>
            <div className="flex justify-between p-2 px-3 items-center w-full">
              <label htmlFor="category" className="text-gray-700 pr-2">
                {t("category")}:{" "}
              </label>
              <select
                name="category"
                className="p-1 w-3/5 md:w-1/2 form-control"
                onChange={changeFormData}
                value={formData.category}
                id="category"
                autoComplete="name"
              >
                <option></option>
                {categoryList
                  ? categoryList.map((data, i) => (
                      <option key={i} id={data._id}>
                        {data.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex justify-between items-center p-2 px-3 w-full">
              <label htmlFor="totalNum" className="text-gray-700 pr-2">
                {t("total") + t("number")}:{" "}
              </label>
              <input
                name="totalNum"
                className="p-1 w-3/5 md:w-1/2 form-control"
                onChange={changeFormData}
                value={formData.totalNum}
                id="totalNum"
                autoComplete="name"
              ></input>
            </div>
          </div>
          <div className="flex justify-between items-center p-2 px-3 w-full xxsm:w-1/2">
            <label htmlFor="fileInput" className="text-gray-700 pr-2">
              {t("image")}:{" "}
            </label>
            <input
              name="fileInput"
              type="file"
              id="fileInput"
              className="image p-1 w-3/5 md:w-1/2 form-control"
              onChange={handleFileInputChange}
              value={formData.imgUrl}
              ref={fileInputRef}
              autoComplete="name"
            ></input>

            <img
              src={imgUrl ? imgUrl : uploadimage}
              alt="prize"
              width="150px"
              height="150px"
              className="mx-auto mt-2 max-w-[200px] "
              onClick={() => {
                document.getElementById("fileInput").click();
              }}
            ></img>
          </div>
        </div>
        <AgreeButton
          name={t("add")}
          addclassName="inline-block float-right"
          onClick={addGacha}
        />
      </div>
      <div className="mx-auto mt-5 overflow-auto">
        <table className="border-[1px]  m-auto w-full md:w-[70%]">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <tr>
              <th>{t("no")}</th>
              <th>{t("image")}</th>
              <th>{t("name")}</th>
              <th>{t("price")}</th>
              <th>{t("total") + t("number")}</th>
              <th>{t("category")}</th>
              <th>{t("created") + t("date")}</th>
            </tr>
          </thead>
          <tbody>
            {gacha != null ? (
              gacha.map((data, i) => {
                return (
                  <React.Fragment key={data._id}>
                    <tr
                      key={i}
                      className={`border-2 ${
                        data.isRelease ? "bg-[#f2f2f2]" : ""
                      }`}
                    >
                      <td rowSpan="2">{i + 1}</td>
                      <td>
                        <img
                          src={
                            process.env.REACT_APP_SERVER_ADDRESS +
                            data.gacha_thumnail_url
                          }
                          alt="gacha thumnail"
                          width="100px"
                          height="100px"
                        ></img>
                      </td>
                      <td>{data.name}</td>
                      <td>{formatPrice(data.price)} pt</td>
                      <td>{data.total_number}</td>
                      <td>{data.category}</td>
                      <td>{formatDate(data.create_date)}</td>
                    </tr>
                    <tr
                      className={`border-2 ${
                        data.isRelease ? "bg-[#f2f2f2]" : ""
                      }`}
                    >
                      <td colSpan="6">
                        <div className="flex flex-wrap justify-center">
                          <button
                            className="py-1 px-4 m-1 bg-gray-200 text-center text-gray-600"
                            onClick={() => toGachaDetail(data._id)}
                          >
                            {t("gacha") + " " + t("detail")}
                          </button>
                          <button
                            className="py-1 px-4 m-1 bg-gray-200 text-center text-gray-600"
                            onClick={() => setRelease(data._id)}
                          >
                            {data.isRelease
                              ? t("unrelease") + " " + t("gacha")
                              : t("release") + " " + t("gacha")}
                          </button>
                          <button
                            className="py-1 px-4 m-1 bg-red-500 text-center text-gray-200"
                            onClick={() => {
                              setDelGachaId(data._id);
                              setIsModalOpen(true);
                            }}
                          >
                            {t("delete") + " " + t("gacha")}
                          </button>
                        </div>
                      </td>
                    </tr>
                  </React.Fragment>
                );
              })
            ) : (
              <tr>
                <td colSpan="6">There is no Gacha</td>
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

export default Gacha;
