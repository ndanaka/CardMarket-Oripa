import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import PageHeader from "../../components/Forms/PageHeader";

function Users() {
  const [userList, setUserList] = useState();
  const [adminId, setAdminId] = useState("");
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    setAuthToken();
    getUserList();
  }, []);

  const getUserList = () => {
    api
      .get("/user/get_userList")
      .then((res) => {
        if (res.data.status === 1) {
          setUserList(res.data.userList);
        }
      })
      .catch((err) => console.error(err));
  };

  const userDel = (id) => {
    api
      .delete(`/user/del_user/${id}`)
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Admin deleted successfully.");
          getUserList();
        } else {
          showToast("Admin delete failed.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-3 ">
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("users")} />
      </div>
      <div className="m-auto overflow-auto w-full md:w-[70%]">
        <table className="w-full border-2 m-auto min-w-[60%]">
          <thead>
            <tr className="bg-admin_theme_color font-bold text-gray-200">
              <th>{t("no")}</th>
              <th>{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("password")}</th>
              <th>{"point"}</th>
              <th>{"action"}</th>
            </tr>
          </thead>
          <tbody>
            {userList
              ? userList.map((data, i) => (
                  <tr
                    key={data._id}
                    className="border-2 cursor-pointer"
                    onClick={() =>
                      navigate("/admin/user-detail", {
                        state: { userId: data._id },
                      })
                    }
                  >
                    <td>{i + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.email}</td>
                    <td>{data.password}</td>
                    <td>{data.point_remain}</td>
                    <td>
                      <span
                        id={data._id}
                        className="fa fa-remove p-1"
                        onClick={(e) => userDel(e.target.id)}
                      ></span>
                    </td>
                  </tr>
                ))
              : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Users;
