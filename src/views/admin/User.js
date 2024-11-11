import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import formatPrice from "../../utils/formatPrice";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import PageHeader from "../../components/Forms/PageHeader";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal";
import Spinner from "../../components/Others/Spinner";

function Users() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user] = usePersistedUser("");

  const [userList, setUserList] = useState();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userId, setUserId] = useState("");
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setAuthToken();
    getUserList();
  }, []);

  const getUserList = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get("/user/get_userList");
      setSpinFlag(false);

      if (res.data.status === 1) setUserList(res.data.userList);
    } catch (error) {}
  };

  const handleDelete = async () => {
    try {
      if (!user.authority["users"]["delete"]) {
        showToast(t("noPermission"), "error");
        return;
      }
      setSpinFlag(true);
      const res = await api.delete(`/user/del_user/${userId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        showToast(t("successDeleted"), "success");
        setIsModalOpen(false);
        getUserList();
      } else {
        showToast(t("failedDeleted"), "error");
      }
    } catch (error) {
      showToast(t("faileReq"), "error");
    }
  };

  return (
    <div className="px-3 pt-2 py-24">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-[70%] mx-auto">
        <PageHeader text={t("users")} />
      </div>
      <div className="m-auto overflow-auto w-full md:w-[70%]">
        <table className="w-full">
          <thead>
            <tr className="bg-admin_theme_color font-bold text-gray-200">
              <th>{t("no")}</th>
              <th>{t("name")}</th>
              <th>{t("email")}</th>
              <th>{t("point")}</th>
              <th>{t("status")}</th>
              <th>{t("action")}</th>
            </tr>
          </thead>
          <tbody>
            {userList && userList.length !== 0 ? (
              userList.map((data, i) => (
                <tr key={i} className="cursor-pointer">
                  <td
                    onClick={() =>
                      navigate("/admin/userDetail", {
                        state: { userId: data._id },
                      })
                    }
                  >
                    {i + 1}
                  </td>
                  <td
                    onClick={() =>
                      navigate("/admin/userDetail", {
                        state: { userId: data._id },
                      })
                    }
                  >
                    {data.name}
                  </td>
                  <td
                    onClick={() =>
                      navigate("/admin/userDetail", {
                        state: { userId: data._id },
                      })
                    }
                  >
                    {data.email}
                  </td>
                  <td
                    onClick={() =>
                      navigate("/admin/userDetail", {
                        state: { userId: data._id },
                      })
                    }
                  >
                    {formatPrice(data.point_remain)}pt
                  </td>
                  <td
                    onClick={() =>
                      navigate("/admin/userDetail", {
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
            ) : (
              <tr>
                <td colSpan="6">{t("nouser")}</td>
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

export default Users;
