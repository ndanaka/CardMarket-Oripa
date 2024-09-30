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
  const [user, setUser] = usePersistedUser();
  const navigate = useNavigate();
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

  useEffect(() => {
    setAuthToken();
  }, []);

  //initialize userData when it changes
  const handleSetUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleSaveUserData = () => {
    api
      .post("/user/save_user", userData)
      .then((res) => {
        if (res.data.status === 1) showToast("Save User data success.");
        else showToast("Save user data failed.");
      })
      .catch((err) => console.log(err));
  };

  const handleChangePass = () => {
    api.post("/user/change_pass", userData).then((res) => {
      if (res.data.status === 1) showToast("Change Password Success.");
    });
  };

  const handleDelete = () => {
    api
      .post("/user/withdraw_user/", { user_id: user._id })
      .then((res) => {
        if (res.data.status === 1) {
          logout();
        }
      })
      .catch((err) => console.log(err));
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
              User Profile
            </p>
            <hr className="py-2"></hr>
            <div className="flex flex-wrap">
              <GroupHeader text="User information" />
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="Name"
                  type="text"
                  name="name"
                  value={userData?.name || ""}
                  placeholder="Oliver Leo"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="User Email"
                  type="email"
                  name="email"
                  value={userData?.email || ""}
                  placeholder="OliverLeo118@email.com"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="First Name"
                  type="text"
                  name="firstname"
                  value={userData?.firstname || ""}
                  placeholder="Oliver"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="Last Name"
                  type="text"
                  name="lastname"
                  value={userData?.lastname || ""}
                  placeholder="Leo"
                  onChange={handleSetUserData}
                />
              </div>
            </div>
            <div className="flex flex-wrap">
              <GroupHeader text="Contact information" />
              <div className="w-full px-2">
                <InputGroup
                  label="Address"
                  type="text"
                  name="address"
                  value={userData?.address || ""}
                  placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <InputGroup
                  label="City"
                  type="text"
                  name="city"
                  value={userData?.city || ""}
                  placeholder="New York"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <InputGroup
                  label="Country"
                  type="text"
                  name="country"
                  value={userData?.country || ""}
                  placeholder="United States"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/3 px-2">
                <InputGroup
                  label="Postal Code"
                  type="text"
                  name="postalCode"
                  value={userData?.postalCode || ""}
                  placeholder="Postal Code"
                  onChange={handleSetUserData}
                />
              </div>
            </div>
            <div className="w-full">
              <GroupHeader text="About me" />
              <div className="form-group px-2">
                <label htmlFor="description">My Description</label>
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
                onClick={handleSaveUserData}
              >
                Update
              </button>
            </div>
          </div>
        </div>
        <div className="w-full md:w-3/6 px-3 mx-auto">
          <div className="rounded-lg bg-white px-5">
            <p className="text-xl text-center text-theme_headertext_color py-2">
              Change Password
            </p>
            <hr className="py-2"></hr>
            <InputGroup
              label="Current Password"
              type="password"
              name="newPass"
              placeholder="*******"
              onChange={handleSetUserData}
            />
            <InputGroup
              label="New Password"
              type="password"
              name="curPass"
              placeholder="*******"
              onChange={handleSetUserData}
            />
            <div className="flex flex-wrap w-full justify-end">
              <button
                className="button-22 px-4 py-2 my-2"
                onClick={handleChangePass}
              >
                Change
              </button>
            </div>
          </div>
          <div className="rounded-lg bg-white px-5 py-2 my-3">
            <p className="text-xl text-center text-theme_headertext_color py-2">
              Credit Card Setting
            </p>
            <hr className="py-2"></hr>
            <div className="flex flex-wrap w-full justify-end">
              <button className="button-22 my-2 px-4 py-2">Save</button>
            </div>
          </div>
          <div className="rounded-lg bg-white px-5 py-2">
            <p className="text-xl text-center text-theme_headertext_color py-2">
              Withdraw Account
            </p>
            <hr></hr>
            <p className="py-4">
              Disable Login: After withdraw your account, you will not be able
              to log in again.
            </p>
            <div className="flex flex-wrap w-full justify-end">
              <button
                className="button-22 my-2 px-4 py-2"
                onClick={() => setIsModalOpen(true)}
              >
                Withdrawal
              </button>
            </div>
          </div>
        </div>
      </div>

      <DeleteConfirmModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  );
};

export default Profile;
