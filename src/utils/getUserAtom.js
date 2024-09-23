import usePersistedUser from "../store/usePersistedUser";

export default function GetUser() {
  const [user] = usePersistedUser();
  return { user };
}
