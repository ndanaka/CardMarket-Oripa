import { useEffect, useState } from "react";
import api from "../../utils/api.js";
import { UserAtom } from "../../store"
import { useAtom } from "jotai";
import InputGroup from "../../components/Forms/InputGroup.js";
import { showToast } from "../../utils/toastUtil.js";
import { setAuthToken } from "../../utils/setHeader.js";
import GroupHeader from "../../components/Forms/GroupHeader.js";

const Profile = () => {
  const [userData, setUserData] = useState({});
  const [user, setUser] = useAtom(UserAtom);

  useEffect(() => {
    setAuthToken();
    getUser();
  }, []);
  //initialize userData when it changes
  const handleSetUserData = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  //get userdata by id and set UserAtom
  const getUser = () => {
    api
      .get(`/user/get_user/${user._id}`)
      .then((res) => {
        if (res.data.status === 1) {
          setUser(res.data.user);
          setUserData(res.data.user);
        }
      })
      .catch((err) => console.log(err));
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
  return (
    <div
      className={`relative w-full flex flex-wrap items-start  mx-auto py-3 mt-32 bg-[url('${
        process.env.REACT_APP_SERVER_ADDRESS + "/uploads/users/user_bg.jpg"
      }')] bg-gradient-dark-pink`}
    >
      <div className="absolute top-0">
        {/* <img
          src={
            process.env.REACT_APP_SERVER_ADDRESS + "/uploads/users/user_bg.jpg"
          }
          className="absolute top-0 z-2"
        ></img> */}
      </div>
      <div className="w-full md:w-[60%] px-5">
        <div className="rounded-lg bg-white px-5 py-2 my-3">
          <div className="flex flex-col">
            <div className="w-full text-2xl text-center text-theme_headertext_color py-2">
              User Profile
            </div>
            <hr className="py-2"></hr>
            <div className="flex flex-wrap">
              <GroupHeader text="User information" />
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="Name"
                  type="text"
                  name="name"
                  value={userData.name}
                  placeholder="Oliver Leo"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="User Email"
                  type="email"
                  name="email"
                  value={userData.email}
                  placeholder="OliverLeo118@email.com"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="First Name"
                  type="text"
                  name="firstname"
                  value={userData.firstname}
                  placeholder="Oliver"
                  onChange={handleSetUserData}
                />
              </div>
              <div className="w-full md:w-1/2 px-2">
                <InputGroup
                  label="Last Name"
                  type="text"
                  name="lastname"
                  value={userData.lastname}
                  placeholder="Leo"
                  onChange={handleSetUserData}
                />
              </div>
              <hr className="py-2"></hr>
              <div className="flex flex-wrap">
                <GroupHeader text="Contact information" />
                <div className="w-full px-2">
                  <InputGroup
                    label="Address"
                    type="text"
                    name="address"
                    value={userData.address}
                    placeholder="Bld Mihail Kogalniceanu, nr. 8 Bl 1, Sc 1, Ap 09"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full md:w-1/3 px-2">
                  <InputGroup
                    label="City"
                    type="text"
                    name="city"
                    value={userData.city}
                    placeholder="New York"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full md:w-1/3 px-2">
                  <InputGroup
                    label="Country"
                    type="text"
                    name="country"
                    value={userData.country}
                    placeholder="United States"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full md:w-1/3 px-2">
                  <InputGroup
                    label="Postal Code"
                    type="text"
                    name="postalCode"
                    value={userData.postalCode}
                    placeholder="Postal Code"
                    onChange={handleSetUserData}
                  />
                </div>
                <div className="w-full">
                  <GroupHeader text="About me" />
                  <div class="form-group px-2">
                    <label for="description">My Description</label>
                    <textarea
                      class="form-control w-full text-gray-700"
                      name="description"
                      id="description"
                      value={userData.description}
                      rows="4"
                      cols="50"
                      onChange={handleSetUserData}
                    ></textarea>
                  </div>
                </div>
                <button
                  className="button-22 px-5 py-2 m-auto my-3"
                  onClick={handleSaveUserData}
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full md:w-[40%] px-5">
        <div className="rounded-lg bg-white px-5 py-2 my-3">
          <div className="">
            <div className="text-xl text-center text-theme_headertext_color py-2">
              Change Password
            </div>
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
            <button
              className="button-22 my-2 mx-auto"
              onClick={handleChangePass}
            >
              Change
            </button>
          </div>
        </div>

        <div className="rounded-lg bg-white px-5 py-2">
            <div className="text-xl text-center text-theme_headertext_color py-2">
              Credit Card Setting
            </div>
            <hr className="py-2"></hr>
           
            <button className="button-22 my-2 mx-auto">Save</button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
