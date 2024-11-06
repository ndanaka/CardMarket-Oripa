import { atom } from "jotai";

const getInitialUser = () => {
  const savedUser = localStorage.getItem("user");

  return savedUser ? JSON.parse(savedUser) : null;
};

export const UserAtom = atom(getInitialUser());
