import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/api.js";
import { showToast } from "../../utils/toastUtil.js";
import { setAuthToken } from "../../utils/setHeader.js";

import usePersistedUser from "../../store/usePersistedUser.js";

import InputGroup from "../../components/Forms/InputGroup.js";
import GroupHeader from "../../components/Forms/GroupHeader.js";
import SubHeader from "../../components/Forms/SubHeader.js";
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
    firstname: "",
    lastname: "",
    address: "",
    city: "",
    country: "",
    postalCode: "",
    description: "",
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
      if (res.data.status === 1)
        showToast("Save User data success.", "success");
      else showToast("Save user data failed.", "error");
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
        showToast("Change Password Success.", "success");
        break;
      case 0:
        showToast("Failed to change password", "error");
        break;
      case 2:
        showToast("Current password is not correct.", "error");
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
      <div
        className={`relative w-full flex flex-wrap items-start mx-auto mt-16 py-3`}
      >
        <SubHeader text={t("my") + " " + t("profile")} />
        <div className="w-full md:w-3/6 px-3 mx-auto">
          <div className="flex flex-wrap rounded-lg bg-white px-5">
            <p className="w-full text-2xl text-center text-theme_headertext_color py-2">
              {t("profile")}
            </p>
            <hr className="py-2"></hr>
            <div className="flex flex-wrap w-full">
              <GroupHeader text={t("user_information")} />
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
            </div>
            <div className="flex flex-wrap">
              <GroupHeader text={t("contact_information")} />
              <div className="w-full px-2">
                <InputGroup
                  label={t("address")}
                  type="text"
                  name="address"
                  value={userData?.address || ""}
                  placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <InputGroup
                  label={t("city")}
                  type="text"
                  name="city"
                  value={userData?.city || ""}
                  placeholder="New York"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <InputGroup
                  label={t("country")}
                  type="text"
                  name="country"
                  value={userData?.country || ""}
                  placeholder="United States"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <InputGroup
                  label={t("postal_code")}
                  type="text"
                  name="postalCode"
                  value={userData?.postalCode || ""}
                  placeholder="Postal Code"
                  onChange={handleSetUserData}
                />
              </div>
            </div>
            <div className="w-full">
              <GroupHeader text={t("aboutMe")} />
              <div className="form-group px-2">
                <textarea
                  className="form-control w-full text-gray-700"
                  name="description"
                  id="description"
                  value={userData?.description}
                  rows="4"
                  cols="50"
                  onChange={handleSetUserData}
                ></textarea>
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
        <div className="w-full md:w-3/6 px-3 mx-auto">
          <div className="rounded-lg bg-white px-5">
            <p className="text-xl text-center text-theme_headertext_color py-2">
              {t("changePass")}
            </p>
            <hr className="py-2"></hr>
            <InputGroup
              label={t("currentPass")}
              type="password"
              name="currentPwd"
              placeholder="*******"
              value={pwdData.currentPwd}
              onChange={handleSetPwdData}
            />
            <InputGroup
              label={t("newPass")}
              type="password"
              name="newPwd"
              placeholder="*******"
              value={pwdData.newPwd}
              onChange={handleSetPwdData}
            />
            <div className="flex flex-wrap w-full justify-end">
              <button
                className="button-22 px-4 py-2 my-2"
                onClick={handleChangePass}
              >
                {t("change")}
              </button>
            </div>
          </div>
          {/* <div className="rounded-lg bg-white px-5 py-2 ">
            <p className="text-xl text-center text-theme_headertext_color py-2">
              Credit Card Setting
            </p>
            <hr className="py-2"></hr>
            <div className="flex flex-wrap w-full justify-end">
              <button className="button-22 my-2 px-4 py-2">Save</button>
            </div>
          </div> */}
          <div className="rounded-lg bg-white px-5 py-2 my-3">
            <p className="text-xl text-center text-theme_headertext_color py-2">
              {t("account")}
            </p>
            <hr></hr>
            <p className="py-4">{t("withdrawalDes")}</p>
            <div className="flex flex-wrap w-full justify-end">
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

      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleWithdrawalAccount}
      />
    </div>
  );
};

export default Profile;
