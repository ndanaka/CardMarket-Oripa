import { useEffect } from "react";

import api from "./api";

import usePersistedUser from "../store/usePersistedUser";

const UpdateUserData = () => {
  const [user, setUser] = usePersistedUser();

  useEffect(() => {
    if (user) {
      api
        .get(`/user/get_user/${user._id}`)
        .then((res) => {
          if (res.data.status === 1) {
            setUser(res.data.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, []);

  return { user };
};

export default UpdateUserData;
