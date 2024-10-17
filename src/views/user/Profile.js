import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/api.js";
import { showToast } from "../../utils/toastUtil.js";
import { setAuthToken } from "../../utils/setHeader.js";

import usePersistedUser from "../../store/usePersistedUser.js";

import InputGroup from "../../components/Forms/InputGroup.js";
import DeleteConfirmModal from "../../components/Modals/DeleteConfirmModal.js";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = usePersistedUser();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
  });
  const [pwdData, setPwdData] = useState({
    currentPwd: "",
    newPwd: "",
  });

  useEffect(() => {
    setAuthToken();
    getUserData();
  }, []);

  const getUserData = async () => {
    try {
      const res = await api.get(`/user/get_user/${user?._id}`);
      if (res.data.status === 1) setUserData(res.data.user);
    } catch (error) {
      console.log(error);
    }
  };

  // Update user data
  const handleSetUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };
  const handleUpdateUserData = async () => {
    try {
      const res = await api.post("/user/update_user", userData);
      if (res.data.status === 1) showToast(t("successSaved"), "success");
      else showToast(t("failedSaved"), "error");
    } catch (error) {
      console.log(error);
    }
  };

  // change password
  const handleSetPwdData = (e) => {
    setPwdData({ ...pwdData, [e.target.name]: e.target.value });
  };
  const handleChangePass = async () => {
    const res = await api.post("/user/changePwd", pwdData);

    switch (res.data.status) {
      case 1:
        showToast(t("successEdited"), "success");
        break;
      case 0:
        showToast(t("failedEdited"), "error");
        break;
      case 2:
        showToast(t("incorrectCurPwd"), "error");
        break;

      default:
        break;
    }

    setPwdData({
      currentPwd: "",
      newPwd: "",
    });
  };

  // withdrawal account
  const handleWithdrawalAccount = async () => {
    try {
      const res = await api.post("/user/withdraw_user/", { user_id: user._id });
      if (res.data.status === 1) logout();
    } catch (error) {
      console.log(error);
    }
  };
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);

    navigate("/auth/login");
  };

  return (
    <div className="flex flex-grow">
      <div className={`relative w-full md:w-2/3 mx-auto mt-12 p-3`}>
        <div className="w-full py-2">
          <div className="text-center text-xl text-slate-600">
            {t("my") + " " + t("profile")}
          </div>
          <hr className="w-full my-2"></hr>
        </div>
        <div className="flex flex-wrap justify-between">
          <div className="w-full xxsm:w-1/2 p-2">
            <div className="flex flex-wrap rounded-lg bg-white">
              <p className="w-full text-2xl text-center text-theme_headertext_color py-2">
                {t("information")}
              </p>
              <hr className="py-2"></hr>
              <div className="flex flex-wrap w-full">
                <div className="w-full md:w-1/2 px-2">
                  <InputGroup
                    label={t("name")}
                    type="text"
                    name="name"
                    value={userData?.name || ""}
                    placeholder="Oliver Leo"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <InputGroup
                    label={t("email")}
                    type="email"
                    name="email"
                    value={userData?.email || ""}
                    placeholder="OliverLeo118@email.com"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full  px-2">
                  <InputGroup
                    label={t("address")}
                    type="text"
                    name="address"
                    value={userData?.address || ""}
                    placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <InputGroup
                    label={t("city")}
                    type="text"
                    name="city"
                    value={userData?.city || ""}
                    placeholder="New York"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full md:w-1/2 px-2">
                  <InputGroup
                    label={t("country")}
                    type="text"
                    name="country"
                    value={userData?.country || ""}
                    placeholder="United States"
                    onChange={handleSetUserData}
                  />
                </div>
              </div>
              <div className="w-full flex flex-wrap justify-end px-2">
                <button
                  className="button-22 px-4 py-2 my-3"
                  onClick={handleUpdateUserData}
                >
                  {t("save")}
                </button>
              </div>
            </div>
          </div>
          <div className="w-full xxsm:w-1/2 p-2">
            <div className="w-full rounded-lg bg-white p-2 mb-3">
              <div className="flex flex-wrap">
                <p className="w-full text-2xl text-center text-theme_headertext_color py-2">
                  {t("changePass")}
                </p>
                <hr className="py-2"></hr>
                <div className="flex flex-wrap w-full">
                  <div className="w-full md:w-1/2 px-2">
                    <InputGroup
                      label={t("currentPass")}
                      type="password"
                      name="currentPwd"
                      placeholder="*******"
                      value={pwdData.currentPwd}
                      onChange={handleSetPwdData}
                    />
                  </div>
                  <div className="w-full md:w-1/2 px-2">
                    <InputGroup
                      label={t("newPass")}
                      type="password"
                      name="newPwd"
                      placeholder="*******"
                      value={pwdData.newPwd}
                      onChange={handleSetPwdData}
                    />
                  </div>
                </div>
                <div className="flex flex-wrap w-full justify-end px-2">
                  <button
                    className="button-22 px-4 py-2 my-2"
                    onClick={handleChangePass}
                  >
                    {t("change")}
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full rounded-lg bg-white p-2 mt-3">
              <p className="text-xl text-center text-theme_headertext_color py-2">
                {t("account")}
              </p>
              <hr></hr>
              <p className="py-4 px-2">{t("withdrawalDes")}</p>
              <div className="flex flex-wrap w-full justify-end px-2">
                <button
                  className="button-22 my-2 px-4 py-2"
                  onClick={() => setIsModalOpen(true)}
                >
                  {t("withdrawal")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleWithdrawalAccount}
      />
    </div>
  );
};

export default Profile;
