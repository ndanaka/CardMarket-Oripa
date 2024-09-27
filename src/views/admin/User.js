import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import PageHeader from "../../components/Forms/PageHeader";
import formatPrice from "../../utils/formatPrice";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";

function Users() {
  const navigate = useNavigate();

  const { t } = useTranslation();

  const [userList, setUserList] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [user, setUser] = usePersistedUser("");

  useEffect(() => {
    setAuthToken();
    updateUserData();
    getUserList();
  }, []);

  const updateUserData = () => {
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

  const handleDelete = () => {
    setIsModalOpen(false);
    userDel();
  };

  const userDel = () => {
    api
      .delete(`/user/del_user/${userId}`)
      .then((res) => {
        if (res.data.status === 1) {
          showToast("User deleted successfully.");
          getUserList();
        } else {
          showToast("User delete failed.");
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
              {/* <th>{t("password")}</th> */}
              <th>{t("point")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {userList
              ? userList.map((data, i) => (
                  <tr key={i} className="border-2 cursor-pointer">
                    <td
                      onClick={() =>
                        navigate("/admin/user-detail", {
                          state: { userId: data._id },
                        })
                      }
                    >
                      {i + 1}
                    </td>
                    <td
                      onClick={() =>
                        navigate("/admin/user-detail", {
                          state: { userId: data._id },
                        })
                      }
                    >
                      {data.name}
                    </td>
                    <td
                      onClick={() =>
                        navigate("/admin/user-detail", {
                          state: { userId: data._id },
                        })
                      }
                    >
                      {data.email}
                    </td>
                    {/* <td>{data.password}</td> */}
                    <td
                      onClick={() =>
                        navigate("/admin/user-detail", {
                          state: { userId: data._id },
                        })
                      }
                    >
                      {formatPrice(data.point_remain)} pt
                    </td>
                    <td>
                      <span
                        id={data._id}
                        className="fa fa-remove p-1"
                        onClick={() => {
                          setUserId(data._id);
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
      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
}

export default Users;
