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

  const handleDelete = async () => {
    try {
      if (!user.authority["users"]["delete"]) {
        showToast("You have no permission for this action", "error");
        return;
      }

      const res = await api.delete(`/user/del_user/${userId}`);

      if (res.data.status === 1) {
        showToast("User deleted successfully.");
        setIsModalOpen(false);
        getUserList();
      } else {
        showToast("Failed to delete user", "error");
      }
    } catch (error) {
      showToast("Failed to delete user", "error");
    }
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
              <th>{t("status")}</th>
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
                    <td
                      onClick={() =>
                        navigate("/admin/user-detail", {
                          state: { userId: data._id },
                        })
                      }
                    >
                      <button
                        className={`py-1 px-2 rounded-sm text-center text-gray-200 ${
                          data.active ? "bg-indigo-600" : "bg-red-600"
                        }`}
                      >
                        {data.active ? t("active") : t("withdrawn")}
                      </button>
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
