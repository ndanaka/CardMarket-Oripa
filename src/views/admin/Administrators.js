import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";

function Administrators() {
  const { t } = useTranslation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [adminList, setAdminList] = useState();
  const [authority, setAuthority] = useState(); //admin authority
  const [adminId, setAdminId] = useState(""); //selected admin id for edit/delete/authority
  const [adminName, setAdminName] = useState();
  const [cuflag, setCuFlag] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setAuthToken();
    getAdminList();
  }, []);

  const getAdminList = () => {
    api
      .get("/admin/get_adminList")
      .then((res) => {
        if (res.data.status === 1) {
          setAdminList(res.data.adminList);
          setAuthority(res.data.adminList[0].authority);
        }
      })
      .catch((err) => console.log(err));
  };

  //handle add/update adminList
  const handleAddAdmin = () => {
    if (name.trim() === "" || email.trim() === "" || password.trim() === "") {
      showToast(t("requiredAll"), "error");
      return;
    }

    api
      .post("/admin/add_admin", {
        adminId: adminId,
        name: name,
        email: email,
        password: password,
        cuflag: cuflag,
      })
      .then((res) => {
        if (res.data.status === 0) {
          showToast(t(res.data.msg), "error");
        } else {
          if (res.data.status === 2) {
            showToast(t("successUpdated"), "success");
          } else if (res.data.status === 1) {
            showToast(t("successAdded"), "success");
            getAdminList();
          }
          setName("");
          setEmail("");
          setPass("");
          setCuFlag(false);
          setAdminId("");
          getAdminList();
        }
      })
      .catch((err) => console.log(err));
  };

  // Delete admin
  const handleDelete = async () => {
    try {
      const res = await api.delete(`/admin/del_admin/${adminId}`);
      if (res.data.status === 1) {
        showToast(t("successDeleted"), "success");
        setIsModalOpen(false);
        getAdminList();
        setAdminName("");
        setAdminId("");
      } else {
        showToast(t("failedDeleted"), "error");
      }
    } catch (error) {
      showToast(t("failedDeleted"), "error");
    }
  };

  // Edit admin autority data
  const change_auth = (item, type, permission) => {
    authority[item][type] = !permission;
    setAuthority({ ...authority, [item]: authority[item] });
  };
  const handleSaveAuth = () => {
    api
      .post("admin/chang_auth", {
        adminId: adminId,
        authority: authority,
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast(t("successSaved"), "success");
          getAdminList();
          setAdminName("");
          setAdminId("");
        } else showToast(t("failedSaved"), "error");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-3">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("administrators")} />
      </div>
      <div className="flex flex-col justify-center items-center p-5 w-full md:w-[70%] m-auto">
        <div className="my-1 form-group w-full">
          <label htmlFor="name" className="text-gray-700">
            {t("name")}
          </label>
          <input
            id="name"
            name="name"
            className="form-control w-full"
            onChange={(e) => setName(e.target.value)}
            value={name ? name : ""}
            autoComplete="name"
          ></input>
        </div>
        <div className="my-1 form-group w-full">
          <label htmlFor="email" className="text-gray-700">
            {t("email")}
          </label>
          <input
            id="email"
            name="email"
            className="form-control w-full"
            onChange={(e) => setEmail(e.target.value)}
            value={email ? email : ""}
            autoComplete="name"
          ></input>
        </div>
        <div className="my-1 form-group w-full">
          <label htmlFor="password" className="text-gray-700">
            {t("password")}
          </label>
          <input
            id="password"
            name="password"
            className="form-control w-full"
            onChange={(e) => setPass(e.target.value)}
            value={password ? password : ""}
            autoComplete="name"
          ></input>
        </div>
        <div className="flex justify-end">
          {cuflag ? (
            <button
              className="button-22 !bg-red-500 !mr-2"
              onClick={() => {
                setCuFlag(false);
                setAdminId("");
                setName("");
                setEmail("");
                setPass("");
              }}
            >
              {t("cancel")}
            </button>
          ) : null}
          <button className="button-22" onClick={handleAddAdmin}>
            {cuflag ? t("update") : t("add")}
          </button>
        </div>
      </div>
      <div className="flex flex-wrap justify-between items-start w-full mx-auto">
        <div className="overflow-auto w-full md:w-[50%] mb-2">
          <div className="text-xl text-center">
            {t("admin") + " " + t("list")}
            <hr className="my-1"></hr>
          </div>
          <table className="w-full border-[1px] m-auto">
            <thead>
              <tr className="bg-admin_theme_color font-bold text-gray-200">
                <th>{t("no")}</th>
                <th>{t("name")}</th>
                <th>{t("email")}</th>
                <th>{t("password")}</th>
                <th>{t("action")}</th>
              </tr>
            </thead>
            <tbody>
              {adminList
                ? adminList.map((data, i) => (
                    <tr
                      key={data._id}
                      className="border-2 cursor-pointer"
                      onClick={() => {
                        setAuthority(adminList[i].authority);
                        setAdminId(data._id);
                        setAdminName(data.name);
                      }}
                    >
                      <td>{i + 1}</td>
                      <td>{data.name}</td>
                      <td>{data.email}</td>
                      <td>{data.password}</td>
                      <td>
                        <span
                          id={data._id}
                          className="fa fa-edit p-1"
                          onClick={() => {
                            setCuFlag(true);
                            setAdminId(data._id);
                            setName(adminList[i].name);
                            setEmail(adminList[i].email);
                            setPass(adminList[i].password);
                          }}
                        ></span>
                        <span
                          id={data._id}
                          className="fa fa-remove p-1"
                          onClick={() => {
                            setAdminId(data._id);
                            setIsModalOpen(true);
                          }}
                        ></span>
                      </td>
                    </tr>
                  ))
                : null}
            </tbody>
          </table>
        </div>
        <div className="m-auto overflow-auto w-full md:w-[45%]">
          <div className="text-xl text-center">
            <span className="font-bold">
              {adminName && adminName + "'s"}&nbsp;
            </span>
            {t("authority")}
            <hr className="my-1"></hr>
          </div>
          <table className="w-full border-[1px] m-auto">
            <thead className="bg-admin_theme_color font-bold text-gray-200">
              <tr>
                <th rowSpan={2}>{t("no")}</th>
                <th rowSpan={2}>{t("items")}</th>
                <th colSpan="3">{t("authority")}</th>
              </tr>
              <tr>
                <th>{t("read")}</th>
                <th>{t("write")}</th>
                <th>{t("delete")}</th>
              </tr>
            </thead>
            <tbody>
              {authority && authority.length !== 0 ? (
                Object.entries(authority).map(([item, values], i) => (
                  <tr key={item}>
                    <td>{i + 1}</td>
                    <td>{t(item)}</td>
                    <td>
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        name={item}
                        checked={!!values.read}
                        onChange={() => change_auth(item, "read", values.read)}
                      />
                    </td>
                    <td>
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        name={item}
                        checked={!!values.write}
                        onChange={() =>
                          change_auth(item, "write", values.write)
                        }
                      />
                    </td>
                    <td>
                      <input
                        className="cursor-pointer"
                        type="checkbox"
                        name={item}
                        checked={!!values.delete}
                        onChange={() =>
                          change_auth(item, "delete", values.delete)
                        }
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>{t("noadmin")}</td>
                </tr>
              )}
            </tbody>
          </table>
          <button
            className="button-22 float-right my-1"
            onClick={handleSaveAuth}
          >
            {t("save") + " " + t("authority")}
          </button>
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

export default Administrators;
