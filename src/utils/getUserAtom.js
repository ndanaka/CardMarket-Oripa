import { UserAtom } from "../store/user";
import { useAtom } from "jotai";

export default function GetUser() {
  const [user, setUser] = useAtom(UserAtom);
  return { user };
}
