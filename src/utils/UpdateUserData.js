import { useEffect } from "react";
import api from "./api";
import { UserAtom } from "../store/user";
import { useAtom } from "jotai";

const UpdateUserData = () => {
  const [user, setUser] = useAtom(UserAtom);

  useEffect(() => {
    api
      .get(`/user/get_user/${user._id}`)
      .then((res) => {
        if (res.data.status === 1) {
          alert(res.data.msg);
          setUser(res.data.user);
        } else alert(res.data.msg);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return { user };
};

export default UpdateUserData;
