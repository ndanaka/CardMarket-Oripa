import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import { showToast } from "../../utils/toastUtil";
import AgreeButton from "../../components/Forms/AgreeButton";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";

function Category() {
  const [name, setName] = useState("");
  const [description, setDes] = useState("");
  const [category, setCategory] = useState(null);
  const [editRow, setEditRow] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [delId, setDelId] = useState(null);
  const [user, setUser] = usePersistedUser();
  const { t } = useTranslation();

  useEffect(() => {
    setAuthToken();
    get_category();
  }, []);

  const handleDelete = () => {
    // Logic for deleting the item
    categoryDel();
    setIsModalOpen(false);
  };

  const get_category = () => {
    api
      .get("admin/get_category")
      .then((res) => {
        if (res.data.status === 1) {
          setCategory(res.data.category);
        }
      })
      .catch((err) => {
        // error = new Error();
      });
  };

  const addCategory = () => {
    if (!user.authority["category"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    if (name && description) {
      api
        .post("admin/add_category", {
          name: name,
          description: description,
        })
        .then((res) => {
          if (res.data.status === 1) {
            get_category();
            setName("");
            setDes("");
            showToast(t(res.data.msg), "success");
          }
        })
        .catch((error) => {
          error = new Error();
        });
    } else {
      showToast(t("requiredAll"), "error");
    }
  };

  const categoryEdit = () => {
    if (!user.authority["category"]["write"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    const id = category[editRow]._id;

    api
      .post("/admin/edit_category", {
        id: id,
        name: name,
        description: description,
      })
      .then((res) => {
        if (res.data.status) {
          showToast(t("successEdited"), "success");
          closeModal();
          get_category();
        } else console.error(res.data.err);
      })
      .catch((err) => {
        console.err(err);
      });
  };

  const categoryDel = () => {
    if (!user.authority["category"]["delete"]) {
      showToast(t("noPermission"), "error");
      return;
    }

    api
      .delete(`admin/del_category/${delId}`)
      .then((res) => {
        if (res.data.status === 1) {
          showToast(t("successDeleted"), "success");
          get_category();
        } else showToast(t(res.data.msg), "error");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  /* modal */
  const closeModal = () => {
    document.getElementById("modal").style.display = "none";
    setName("");
    setDes("");
  };

  const openModal = () => {
    document.getElementById("modal").style.display = "block";
  };

  return (
    <div className="p-3 ">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("category")} />
      </div>
      <div className="flex flex-wrap justify-around items-end p-2 w-full md:w-[70%] m-auto">
        <div className="my-1 w-full md:w-[35%]">
          <label htmlFor="catName" className="text-gray-700">
            {t("name")}
          </label>
          <input
            className="p-1 w-full form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            id="catName"
            name="catName"
            autoComplete="name"
          ></input>
        </div>
        <div className="my-1 w-full md:w-[35%]">
          <label htmlFor="catDesc" className="text-gray-700">
            {t("description")}
          </label>
          <input
            className="p-1 w-full form-control"
            value={description}
            onChange={(e) => setDes(e.target.value)}
            id="catDesc"
            name="catDesc"
            autoComplete="name"
          ></input>
        </div>
        <AgreeButton
          name={t("add") + t("category")}
          className=""
          onClick={addCategory}
        />
      </div>
      <div className="m-auto w-full md:w-[70%]">
        <table className="border-2 m-auto w-full">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <tr>
              <th>{t("no")}</th>
              <th>{t("name")}</th>
              <th>{t("description")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {category && category.length !== 0 ? (
              category.map((data, i) => (
                <tr key={data._id} className="border-2">
                  <td>{i + 1}</td>
                  <td>{data.name}</td>
                  <td>{data.description}</td>
                  <td>
                    <span
                      id={data._id}
                      className="fa fa-edit p-1"
                      onClick={() => {
                        openModal();
                        setEditRow(i);
                        setName(category[i].name);
                        setDes(category[i].description);
                      }}
                    ></span>
                    <span
                      id={data._id}
                      className="fa fa-remove p-1"
                      onClick={() => {
                        setDelId(data._id);
                        setIsModalOpen(true);
                      }}
                    ></span>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4">{t("noCategory")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        id="modal"
        className="w-full h-full pt-[150px] bg-gray-600 bg-opacity-50 fixed top-0 left-0 hidden"
      >
        <div className="w-2/5 bg-white rounded-xl shadow-xl shadow-gray-500  m-auto p-2 z-10">
          <div className="text-3xl text-theme_text_color text-center py-1">
            {t("edit")}
          </div>
          <div className="flex flex-col p-3 px-5 text-theme_text_color">
            <div className="w-full flex flex-col justify-start">
              <div className="my-1">
                <label htmlFor="catNam" className="text-gray-700">
                  {t("name")}
                </label>
                <input
                  className="p-1 w-full rounded-md border-[1px] border-gray-400 focus:border-gray-600 focus:outline-gray-600"
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  id="catNam"
                  name="catNam"
                  autoComplete="name"
                ></input>
              </div>
              <div className="my-1">
                <label htmlFor="catDes" className="text-gray-700">
                  {t("description")}
                </label>
                <input
                  className="p-1 w-full rounded-md border-[1px] border-gray-400 focus:border-gray-600 focus:outline-gray-600"
                  onChange={(e) => setDes(e.target.value)}
                  value={description}
                  id="catDes"
                  name="catDes"
                  autoComplete="name"
                ></input>
              </div>
            </div>
            <div className="flex justify-end">
              <button
                id="closeBtn"
                className="bg-admin_theme_color rounded-md mt-3 mr-3 text-center px-5 py-2 hover:bg-red-700 text-gray-200 outline-none"
                onClick={categoryEdit}
              >
                {t("save")}
              </button>
              <button
                id="marksBtn"
                className="bg-indigo-600 rounded-md mt-3 text-center px-5 py-2 hover:bg-indigo-700 text-gray-200 outline-none"
                onClick={closeModal}
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      </div>
      <div></div>
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Category;
