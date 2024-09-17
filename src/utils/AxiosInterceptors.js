import { useEffect, useState } from "react";
import axios from "axios";
import api from "./api";
import { useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { showToast } from "../utils/toast";
import { UserAtom } from "../store/user";
import { useAtom } from "jotai";
const useAxiosInterceptor = () => {
  const navigate = useNavigate();
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const cookie = new Cookies();
  const [user, setUser] = useAtom(UserAtom);
  useEffect(() => {
    const interceptor = api.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response) {
          switch (error.response.status) {
            case 401:
              // Unauthorized error
              setIsLoggedOut(true);
              showToast(error.response.data.msg, "error");
              // Clear user data from local storage or state
              // localStorage.removeItem("token");
              cookie.remove("TOKEN");
              setUser({});
              // Redirect to login page
              navigate("/login");
              break;
            case 403:
              // Forbidden error
              showToast("You do not have permission to access this resource", "error")
              break;
            // Add more cases as needed
            default:
              console.log("An error occurred:", error.response.data);
          }
        } else if (error.request) {
          console.log("No response received:", error.request);
        } else {
          console.log("Error setting up request:", error.message);
        }
        return Promise.reject(error);
      }
    );

    // Clean up the interceptor when the component unmounts
    return () => {
      axios.interceptors.response.eject(interceptor);
    };
  }, [navigate]);

  return { isLoggedOut };
};

export default useAxiosInterceptor;
