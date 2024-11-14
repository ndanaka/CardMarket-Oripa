import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import formatDate from "../../utils/formatDate";

import PrizeCard from "../../components/Others/PrizeCard";
import NavBar from "../../components/Aquicision/NavBar";
import NotSelected from "../../components/Aquicision/NotSelected";
import Awaiting from "../../components/Aquicision/Awaiting";
import Shipped from "../../components/Aquicision/Shipped";
import Spinner from "../../components/Others/Spinner";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

function AcquisitionHistory() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const [spinFlag, setSpinFlag] = useState(false);
  const [navItem, setNavItem] = useState("notSelected");
  const [flag, setFlag] = useState(false);
  const [pendingDelievers, setPendingDelievers] = useState([]);
  const [delieveringDelievers, setDelieveringDelievers] = useState([]);

  useEffect(() => {
    setAuthToken();
    getDeliver();
  }, []);

  const updateUserData = async () => {
    setAuthToken();

    try {
      if (user) {
        const res = await api.get(`/user/get_user/${user._id}`);
        if (res.data.status === 1) {
          setUser(res.data.user);
        } else {
          showToast(t("tryLogin"), "error");
          navigate("user/index");
        }
      }
    } catch (error) {
      showToast(t("tryLogin"), "error");
      navigate("user/index");
    }
  };

  const getDeliver = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get(`/user/get_deliver/${user?._id}`);
      setSpinFlag(false);

      if (res.data.deliver.length > 0) {
        let pendings = [];
        let deliverings = [];

        res.data.deliver.forEach((deliver) => {
          if (deliver.status === "Pending") {
            pendings.push(deliver);
          } else {
            deliverings.push(deliver);
          }
        });

        setPendingDelievers(pendings);
        setDelieveringDelievers(deliverings);
        updateUserData();
      }
    } catch (error) {
      showToast(error, "error");
    }
  };

  const returnPrize = async (deliver_id, prize_id) => {
    setSpinFlag(true);
    const res = await api.post("/user/return_prize", {
      deliver_id: deliver_id,
      prize_id: prize_id,
    });
    setSpinFlag(false);

    if (res.data.status === 1) {
      getDeliver();
      setFlag(false);
      showToast(t(res.data.msg), "success");
    } else showToast(t(res.data.msg), "error");
  };

  return (
    <div className="flex flex-grow">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-4/6 p-3 mx-auto">
        <div
          className="text-start text-xl text-slate-600 py-2 cursor-pointer"
          onClick={() => navigate(-1)}
        >
          <i className="fa fa-chevron-left m-1.5 float-left"></i>
          {t("back")}
          <hr className="w-full mt-2"></hr>
        </div>
        <NavBar setNavItem={setNavItem} navItem={navItem} />
        {navItem === "notSelected" ? (
          <NotSelected />
        ) : navItem === "awaiting" ? (
          <Awaiting />
        ) : navItem === "shipped" ? (
          <Shipped />
        ) : (
          ""
        )}
      </div>
    </div>
  );
}

export default AcquisitionHistory;
