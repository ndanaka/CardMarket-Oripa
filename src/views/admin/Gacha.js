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
    adminUpdateData();
    getGacha();
  }, []);

  const adminUpdateData = () => {
    if (user) {
      api
        .get(`/admin/get_admin/${user._id}`)
        .then((res) => {
          if (res.data.status === 1) {
            res.data.admin.role = "admin";
            setUser(res.data.admin);
          }
        })
        .catch((err) => {
          showToast(t("tryLogin"), "error");
          navigate("user/index");
        });
    }
  };

  //handle image file select change
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
      showToast(t("noPermission"), "error");
      return;
    }

    setAuthToken();
    setMultipart();

    if (formData.name.trim() === "") {
      showToast(t("requiredGachaName"), "error");
    } else if (parseFloat(formData.price) <= 0) {
      showToast(t("greaterThan"), "error");
    } else if (formData.category.trim() === "") {
      showToast(t("selectOption"), "error");
    } else if (parseInt(formData.totalNum) <= 0) {
      showToast(t("greaterThan"), "error");
    } else if (
      formData.file === NaN ||
      formData.file === null ||
      formData.file === undefined
    ) {
      showToast(t("selectImage"), "error");
    } else {
      api
        .post("/admin/gacha/add", formData)
        .then((res) => {
          if (res.data.status === 1) {
            showToast(t(res.data.msg), "success");
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
          } else showToast(t(res.data.msg), "error");
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
      showToast(t("noPermission"), "error");
      return;
    }

    api.get(`/admin/gacha/set_release/${id}`).then((res) => {
      if (res.data.status === 1) {
        showToast(t("successReleaseGacha"), "success");
        getGacha();
      } else {
        showToast(t("failedReleaseGacha"), "error");
      }
    });
  };

  const gachaDel = () => {
    api
      .delete(`/admin/gacha/${delGachaId}`)
      .then((res) => {
        if (res.data.status === 1) {
          showToast(t("successDeleted", "success"));
          getGacha();
        } else showToast(t("failedDeleted", "error"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleDelete = () => {
    if (!user.authority["gacha"]["delete"]) {
      showToast(t("noPermission"), "error");
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
      <div className="flex flex-col w-full md:w-[70%] border-2 m-auto">
        <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
          {t("gacha") + t("add")}
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
              <label htmlFor="price" className="text-gray-700">
                {t("price")} (pt)
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
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="category" className="text-gray-700">
                {t("category")}
              </label>
              <select
                name="category"
                className="p-1 w-full form-control cursor-pointer"
                onChange={changeFormData}
                value={formData.category}
                id="category"
                autoComplete="name"
              >
                <option>{t("selectOption")}</option>
                {categoryList
                  ? categoryList.map((data, i) => (
                      <option key={i} id={data._id}>
                        {data.name}
                      </option>
                    ))
                  : ""}
              </select>
            </div>
            <div className="flex flex-wrap justify-between items-center my-1 px-2 w-full">
              <label htmlFor="totalNum" className="text-gray-700">
                {t("total") + " " + t("number")}
              </label>
              <input
                name="totalNum"
                className="p-1 w-full form-control"
                onChange={changeFormData}
                value={formData.totalNum}
                id="totalNum"
                autoComplete="name"
              ></input>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center px-2 pb-2 w-full xxsm:w-1/2">
            <label htmlFor="fileInput" className="text-gray-700 p-1">
              {t("gacha") + " " + t("image")}
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
            ></img>
          </div>
        </div>
        <div className="flex flex-wrap justify-end px-3 pb-2">
          <AgreeButton
            name={t("add")}
            addclassName="inline-block float-right"
            onClick={addGacha}
          />
        </div>
      </div>
      <div className="mx-auto my-3 overflow-auto">
        <table className="border-[1px]  m-auto w-full md:w-[70%]">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <tr>
              <th>{t("no")}</th>
              <th>{t("category")}</th>
              <th>{t("image")}</th>
              <th>{t("name")}</th>
              <th>{t("price")}</th>
              <th>{t("number")}</th>
            </tr>
          </thead>
          <tbody>
            {gacha && gacha.length !== 0 ? (
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
                      <td>{data.category}</td>
                      <td>
                        <img
                          src={
                            process.env.REACT_APP_SERVER_ADDRESS +
                            data.gacha_thumnail_url
                          }
                          className="w-[100px] h-auto mx-auto"
                          alt="gacha thumnail"
                        ></img>
                      </td>
                      <td>{data.name}</td>
                      <td>{formatPrice(data.price)} pt</td>
                      <td>
                        {data.last_prize
                          ? data.remain_prizes.length + 1
                          : data.remain_prizes.length}{" "}
                        / {data.total_number}
                      </td>
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
                <td colSpan="6">{t("nogacha")}</td>
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
