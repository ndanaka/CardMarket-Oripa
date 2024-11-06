import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";

import usePersistedUser from "../../store/usePersistedUser";

import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";
import Spinner from "../../components/Others/Spinner";

function Category() {
  const [user] = usePersistedUser();
  const { t } = useTranslation();

  const [spinFlag, setSpinFlag] = useState(false);
  const [catId, setCatId] = useState("");
  const [jpName, setJpName] = useState("");
  const [enName, setEnName] = useState("");
  const [ch1Name, setCh1Name] = useState("");
  const [ch2Name, setCh2Name] = useState("");
  const [vtName, setVtName] = useState("");
  const [category, setCategory] = useState(null);
  const [cuflag, setCuFlag] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delId, setDelId] = useState(null);

  useEffect(() => {
    setAuthToken();
    get_category();
  }, []);

  const get_category = async () => {
    setSpinFlag(true);
    const res = await api.get("admin/get_category");
    setSpinFlag(false);

    if (res.data.status === 1) {
      setCategory(res.data.category);
    }
  };

  const handleSubmitCat = async () => {
    try {
      if (!user.authority["category"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      if (jpName && enName && ch1Name && ch2Name && vtName) {
        setSpinFlag(true);
        const res = await api.post("admin/add_category", {
          catId: catId,
          jpName: jpName,
          enName: enName,
          ch1Name: ch1Name,
          ch2Name: ch2Name,
          vtName: vtName,
        });
        setSpinFlag(false);

        if (res.data.status === 1) {
          showToast(t("successAdded"), "success");
          handleCancel();
          get_category();
        } else if (res.data.status === 2) {
          showToast(t("successUpdated"), "success");
          handleCancel();
          get_category();
        } else showToast(t("failedReq"), "error");
      } else {
        showToast(t("requiredAll"), "error");
      }
    } catch (error) {
      showToast(t("failedReq", "error"));
    }
  };

  const handleDelete = () => {
    // Logic for deleting the item
    categoryDel();
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setCatId("");
    setJpName("");
    setCh1Name("");
    setCh2Name("");
    setVtName("");
    setEnName("");
    setCuFlag(1);
  };

  const categoryEdit = (cat) => {
    setCatId(cat._id);
    setJpName(cat.jpName);
    setCh1Name(cat.ch1Name);
    setCh2Name(cat.ch2Name);
    setVtName(cat.vtName);
    setEnName(cat.enName);
    setCuFlag(0);
  };

  const categoryDel = async () => {
    if (!user.authority["category"]["delete"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    try {
      setSpinFlag(true);
      const res = await api.delete(`admin/del_category/${delId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successDeleted"), "success");
        get_category();
      } else showToast(t(res.data.msg), "error");
    } catch (error) {}
  };

  return (
    <div className="p-3 ">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("category")} />
      </div>
      <div className="flex flex-wrap">
        <div className="flex flex-col w-full md:w-[35%] lg:w-[25%] border-1 h-fit">
          <div className="py-2 bg-admin_theme_color text-gray-200 text-center">
            {t("category") + " " + t("add")}
          </div>
          <div className="flex flex-col px-2 py-1">
            <label htmlFor="jpName" className="text-gray-700 px-1">
              {"名前- 日本語"}
            </label>
            <input
              name="jpName"
              className="form-control py-2"
              id="jpName"
              value={jpName}
              onChange={(e) => setJpName(e.target.value)}
              autoComplete="jpName"
            />
          </div>
          <div className="flex flex-col px-2 py-1">
            <label htmlFor="ch1Name" className="text-gray-700 px-1">
              {"姓名 - 中文（简体)"}
            </label>
            <input
              name="ch1Name"
              className="form-control py-2"
              id="ch1Name"
              value={ch1Name}
              onChange={(e) => setCh1Name(e.target.value)}
              autoComplete="ch1Name"
            />
          </div>
          <div className="flex flex-col px-2 py-1">
            <label htmlFor="ch2Name" className="text-gray-700 px-2">
              {"姓名 - 中文（繁體)"}
            </label>
            <input
              name="ch2Name"
              className="form-control py-2"
              id="ch2Name"
              value={ch2Name}
              onChange={(e) => setCh2Name(e.target.value)}
              autoComplete="ch2Name"
            />
          </div>
          <div className="flex flex-col px-2 py-1">
            <label htmlFor="vtName" className="text-gray-700 px-2">
              {"Tên - Tiếng Việt"}
            </label>
            <input
              name="vtName"
              className="form-control py-2"
              id="vtName"
              value={vtName}
              onChange={(e) => setVtName(e.target.value)}
              autoComplete="vtName"
            />
          </div>
          <div className="flex flex-col px-2 py-1">
            <label htmlFor="enName" className="text-gray-700 px-1">
              {"Name - Engish"}
            </label>
            <input
              name="enName"
              className="form-control py-2"
              id="enName"
              value={enName}
              onChange={(e) => setEnName(e.target.value)}
              autoComplete="enName"
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
            <button className="button-22" onClick={handleSubmitCat}>
              {!cuflag ? t("update") : t("add")}
            </button>
          </div>
        </div>
        <div className="flex flex-wrap w-full md:w-[65%] lg:w-[75%] h-fit overflow-auto">
          <table className="w-full">
            <thead className="bg-admin_theme_color font-bold text-gray-200">
              <tr>
                <th>{t("no")}</th>
                <th>{"日本語"}</th>
                <th>{"中文（简体)"}</th>
                <th>{"中文（繁體)"}</th>
                <th>{"Tiếng Việt"}</th>
                <th>{"Engish"}</th>
                <th>{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {category && category.length !== 0 ? (
                category.map((data, i) => (
                  <tr key={data._id} className="border-2">
                    <td>{i + 1}</td>
                    <td>{data.jpName}</td>
                    <td>{data.ch1Name}</td>
                    <td>{data.ch2Name}</td>
                    <td>{data.vtName}</td>
                    <td>{data.enName}</td>
                    <td>
                      <span
                        id={data._id}
                        className="fa fa-edit p-1 cursor-pointer"
                        onClick={() => categoryEdit(data)}
                      />
                      <span
                        id={data._id}
                        className="fa fa-remove p-1 cursor-pointer"
                        onClick={() => {
                          setDelId(data._id);
                          setIsModalOpen(true);
                        }}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7">{t("noCategory")}</td>
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

export default Category;
