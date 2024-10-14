import api from "./api";

export function setAuthToken() {
  const token = localStorage.getItem("token");

  if (token) {
    api.defaults.headers.common["Token"] = token;
    localStorage.setItem("token", token);
  } else {
    delete api.defaults.headers.common["token"];
    localStorage.removeItem("token");
  }
}

export function setMultipart() {
  api.defaults.headers["Content-Type"] = "multipart/form-data";
}

export function removeMultipart() {
  delete api.defaults.headers["Content-Type"];
}
