import { useState, useEffect } from "react";
import { t } from "i18next";

import api from "../../utils/api";
import usePersistedUser from "../../store/usePersistedUser";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import formatDate from "../../utils/formatDate";

import GroupHeader from "../../components/Forms/GroupHeader";
import PrizeCard from "../../components/Others/PrizeCard";
import SubHeader from "../../components/Forms/SubHeader";

function UserDelivery() {
  const [user, setUser] = usePersistedUser();
  const [pendingDelievers, setPendingDelievers] = useState([]);
  const [delieveringDelievers, setDelieveringDelievers] = useState([]);
  const [flag, setFlag] = useState(false); //return card confirm span flag

  useEffect(() => {
    setAuthToken();
    getDeliver();
  }, []);

  const updateUserData = () => {
    setAuthToken();
    if (user) {
      api
        .get(`/user/get_user/${user._id}`)
        .then((res) => {
          if (res.data.status === 1) {
            setUser(res.data.user);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };

  const getDeliver = async () => {
    try {
      const res = await api.get(`/user/get_deliver/${user._id}`);

      if (res.data.deliver.length > 0) {
        let pendings = [];
        let deliverings = [];

        res.data.deliver.map((deliver) => {
          if (deliver.status === "Pending") {
            pendings.push(deliver);
          } else {
            deliverings.push(deliver);
          }
        });

        setPendingDelievers(pendings);
        setDelieveringDelievers(deliverings);
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
          updateUserData();
          showToast(res.data.msg, "success");
        } else showToast(res.data.msg, "error");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="w-full md:w-4/6 p-3 mx-auto mt-16">
      <SubHeader text={t("my") + " " + t("delievery")} />
      <div className="w-full w-full">
        <p className="text-center text-lg text-base font-Lexend font-bold text-gray-500">
          Pending Cards (Returnable)
        </p>
        <div className="px-3">
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
                      ? data.prizes.map((card) => (
                          <div
                            key={card._id}
                            className="group relative mt-1 mr-1"
                          >
                            <PrizeCard
                              name={card.name}
                              rarity={card.rarity}
                              cashback={card.cashback}
                              img_url={card.img_url}
                            />
                            <div className="absolute bottom-0 w-full bg-red-200 hidden group-hover:block transition-all duration-300 text-base text-gray-800 text-center cursor-pointer z-3 py-2 animate-[displayEase_linear]">
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
                                <span onClick={() => setFlag(true)}>
                                  Return Card
                                </span>
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
              There is no pending card.
            </div>
          )}
        </div>
      </div>
      <hr className="w-full my-2"></hr>
      <div className="w-full w-full">
        <p className="text-center text-lg text-base font-Lexend font-bold text-gray-500">
          Delivering Cards
        </p>
        <div className="px-3">
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
                          <div key={card._id}>
                            <PrizeCard
                              name={card.name}
                              rarity={card.rarity}
                              cashback={card.cashback}
                              img_url={card.img_url}
                            />
                          </div>
                        ))
                      : null}
                  </div>
                  <hr className="w-full my-2 pb-3"></hr>
                </div>
              );
            })
          ) : (
            <div className="text-lg text-gray-600 text-center">
              There is no delivering card.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserDelivery;
