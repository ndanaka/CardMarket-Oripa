import { useEffect } from "react";
import { useAtom } from "jotai";
import { UserAtom } from "./user";

const usePersistedUser = () => {
  const [user, setUser] = useAtom(UserAtom);
  // console.log(user);
  useEffect(() => {
    // Save the user to localStorage whenever the user state changes
    if (user) {
      localStorage.setItem("user", JSON.stringify(user));
    } else {
      localStorage.removeItem("user");
    }
  }, [user]);

  return [user, setUser];
};

export default usePersistedUser;
