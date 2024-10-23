import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import formatDate from "../../utils/formatDate";

import PrizeCard from "../../components/Others/PrizeCard";
import SubHeader from "../../components/Forms/SubHeader";

import usePersistedUser from "../../store/usePersistedUser";
import { useTranslation } from "react-i18next";

function UserDelivery() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user, setUser] = usePersistedUser();

  const [pendingDelievers, setPendingDelievers] = useState([]);
  const [delieveringDelievers, setDelieveringDelievers] = useState([]);
  const [flag, setFlag] = useState(false);
  const [bgColor, setBgColor] = useState("");

  useEffect(() => {
    setAuthToken();
    getDeliver();
    getThemeData();
  }, []);

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");
    if (res.data.status === 1 && res.data.theme.bgColor) {
      setBgColor(res.data.theme.bgColor);
      localStorage.setItem("bgColor", res.data.theme.bgColor);
    }
  };

  const updateUserData = async () => {
    setAuthToken();
    try {
      if (user) {
        // update user date
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
      const res = await api.get(`/user/get_deliver/${user?._id}`);

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
      console.log(error);
    }
  };

  const returnPrize = (deliver_id, prize_id) => {
    api
      .post("/user/return_prize", {
        deliver_id: deliver_id,
        prize_id: prize_id,
      })
      .then((res) => {
        if (res.data.status === 1) {
          getDeliver();
          setFlag(false);
          showToast(t(res.data.msg), "success");
        } else showToast(t(res.data.msg), "error");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-4/6 p-3 mx-auto mt-16">
        <SubHeader text={t("my") + " " + t("delivery")} />
        <div className="w-full w-full">
          <p className="text-center text-xl text-base font-Lexend font-bold text-gray-500">
            {t("Pending") + " " + t("cards")} ({t("returnable")})
          </p>
          {pendingDelievers?.length > 0 ? (
            pendingDelievers.map((data, i) => {
              return (
                <div key={i} className="my-1 pb-3">
                  <div className="text-center">{data.gacha_name}</div>
                  <div className="text-center">
                    {formatDate(data.gacha_date)}
                  </div>
                  <div className="mt-2 mr-2 flex flex-wrap justify-center items-stretch">
                    {data.prizes?.length > 0
                      ? data.prizes.map((card, i) => (
                          <div key={i} className="group relative">
                            <PrizeCard
                              name={card.name}
                              rarity={card.rarity}
                              cashback={card.cashback}
                              img_url={card.img_url}
                            />
                            <div
                              className="hover:opacity-90 w-[calc(100%-8px)] hidden rounded-b-md absolute bottom-1 left-1 group-hover:block transition-all duration-300 text-base text-white text-center cursor-pointer z-3 animate-[displayEase_linear]"
                              style={{ backgroundColor: bgColor }}
                            >
                              {flag === true ? (
                                <div className="flex justify-center">
                                  <i
                                    className="fa fa-check text-2xl font-extrabold text-green-600 px-2"
                                    onClick={() =>
                                      returnPrize(data._id, card._id)
                                    }
                                  ></i>
                                  <i
                                    className="fa fa-close text-2xl font-extrablod text-red-600 px-2"
                                    onClick={() => setFlag(false)}
                                  ></i>
                                </div>
                              ) : (
                                <div className="py-1">
                                  <span onClick={() => setFlag(true)}>
                                    {t("returnCard")}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))
                      : null}
                  </div>{" "}
                  {i === pendingDelievers.length - 1 ? (
                    ""
                  ) : (
                    <hr className="w-full my-2"></hr>
                  )}
                </div>
              );
            })
          ) : (
            <div className="text-lg text-gray-600 text-center">
              {t("noDeliveringCards")}
            </div>
          )}
        </div>
        <hr className="w-full my-2"></hr>
        <div className="w-full w-full">
          <p className="text-center text-xl text-base font-Lexend font-bold text-gray-500">
            {t("Delivering") + " " + t("cards")}
          </p>
          {delieveringDelievers?.length > 0 ? (
            delieveringDelievers.map((data, i) => {
              return (
                <div key={i} className="my-1 pb-3">
                  <div className="text-center">{data.gacha_name}</div>
                  <div className="text-center">
                    {formatDate(data.gacha_date)}
                  </div>
                  <div className="mt-2 mr-2 flex flex-wrap justify-center items-stretch">
                    {data.prizes?.length > 0
                      ? data.prizes.map((card) => (
                          <PrizeCard
                            key={card._id}
                            name={card.name}
                            rarity={card.rarity}
                            cashback={card.cashback}
                            img_url={card.img_url}
                          />
                        ))
                      : null}
                  </div>
                  <hr className="w-full my-2"></hr>
                </div>
              );
            })
          ) : (
            <div className="text-lg text-gray-600 text-center">
              {t("noPendingCards")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDelivery;
