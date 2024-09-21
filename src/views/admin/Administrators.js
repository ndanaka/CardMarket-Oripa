import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import PageHeader from "../../components/Forms/PageHeader";

function Administrators() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [adminList, setAdminList] = useState();
  const [authority, setAuthority] = useState(); //admin authority
  const [adminId, setAdminId] = useState(""); //selected admin id for edit/delete/authority
  const [adminName, setAdminName] = useState();
  const [cuflag, setCuFlag] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { t } = useTranslation();
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
    api
      .post("/admin/add_admin", {
        adminId: adminId,
        name: name,
        email: email,
        password: password,
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast("New admin added.");
          getAdminList();
        } else if (res.data.status === 2) {
          showToast("Admin Data Updated.");
          setCuFlag(false);
          setAdminId("");
          getAdminList();
        } else {
          showToast("Admin add failed.", "error");
        }
      })
      .catch((err) => console.log(err));
  };

  const adminDel = () => {
    api
      .delete(`/admin/del_admin/${adminId}`)
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Admin deleted successfully.");
          getAdminList();
        } else {
          showToast("Admin delete failed.");
        }
      })
      .catch((err) => console.log(err));
  };

  const handleDelete = () => {
    // Logic for deleting the item
    adminDel();
    setIsModalOpen(false);
  };

  const change_auth = (key, d) => {
    //0:no authority, 1:only read, 2:write, 3:delete, 4:full control
    //check/uncheck read authority
    if (d === 1) {
      if (authority[key] === 0) setAuthority({ ...authority, [key]: 1 });
      else setAuthority({ ...authority, [key]: 0 });
    }
    //change write/delete authority
    else if (d === 2) {
      if (authority[key] === 3) setAuthority({ ...authority, [key]: 4 });
      else setAuthority({ ...authority, [key]: 2 });
    } else {
      if (authority[key] === 2) setAuthority({ ...authority, [key]: 4 });
      else setAuthority({ ...authority, [key]: 3 });
    }
  };

  const handleSaveAuth = () => {
    api
      .post("admin/chang_auth", {
        adminId: adminId,
        authority: authority,
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Save Authority Successful.");
          getAdminList();
        } else showToast("Save Authority Failed");
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
          <label htmlFor="name" className="text-gray-700 px-2">
            {t("name")}:{" "}
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
          <label htmlFor="email" className="text-gray-700 px-2">
            {t("email")}:{" "}
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
          <label htmlFor="password" className="text-gray-700 px-2">
            {t("password")}:{" "}
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
                      className="border-2"
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
              {authority
                ? Object.entries(authority).map(([key, value], i) => (
                    <tr key={key}>
                      <td>{i + 1}</td>
                      <td>{key}</td>
                      <td>
                        {/* if write/delete authority include read authority */}
                        <input
                          type="checkbox"
                          name={key}
                          checked={value && value <= 4}
                          onChange={() => change_auth(key, 1)}
                        ></input>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name={key}
                          checked={value && (value === 2 || value === 4)}
                          onChange={() => change_auth(key, 2)}
                        ></input>
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          name={key}
                          checked={value && (value === 3 || value === 4)}
                          onChange={() => change_auth(key, 3)}
                        ></input>
                      </td>
                    </tr>
                  ))
                : null}
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
