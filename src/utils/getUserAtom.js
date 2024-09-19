import usePersistedUser from "../store/usePersistedUser";
import { UserAtom } from "../store/user";
import { useAtom } from "jotai";

export default function GetUser() {
  const [user, setUser] = usePersistedUser();
  return { user };
}
