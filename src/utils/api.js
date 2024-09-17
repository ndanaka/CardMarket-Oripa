import axios from "axios";
// Create an instance of axios
const api = axios.create({
  baseURL: process.env.REACT_APP_SERVER_ADDRESS,
  headers: {
    "Content-Type": "application/json",
  },
});
/*
  NOTE: intercept any error responses from the api
 and check if the token is no longer valid.
 ie. Token has expired or user is no longer
 authenticated.
 logout the user if the token has expired
*/

// api.interceptors.response.use(
//   (res) => res,
//   (err) => {
//     // alert("interceptors");
//     alert(err.response.data.msg);
//     // alert(err.response.status);
//     if (err.response.status === 401) {
//       Logout();
//       // store.dispatch({ type: LOGOUT });
//     }
//     return Promise.reject(err);
//   }
// );

export default api;
