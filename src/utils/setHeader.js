import api from "./api";
import Cookies from "universal-cookie";

// store our JWT in LS and set axios headers if we do have a token

export function setAuthToken() {
  const cookie = new Cookies();
  const token = cookie.get("TOKEN");

  if (token) {
    api.defaults.headers.common["Token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["token"];
    localStorage.removeItem("token");
  }
}

export function setMultipart() {
  // /"Content-Type": "multipart/form-data",
  api.defaults.headers["Content-Type"] = "multipart/form-data";
}
