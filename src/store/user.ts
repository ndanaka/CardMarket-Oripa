import { atom } from "jotai";

// export const UserAtom = atom<Object>({});

// Retrieve the stored user from localStorage or set to null if not found
const getInitialUser = () => {
  
  const savedUser = localStorage.getItem("user");

  return savedUser ? JSON.parse(savedUser) : null;
};

export const UserAtom = atom(getInitialUser());
