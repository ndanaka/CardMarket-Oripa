import axios from "axios";
// Create an instance of axios

const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ADDRESS,
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
