import { useState, useEffect } from "react";
import SubHeader from "../../components/Forms/SubHeader";
import api from "../../utils/api";
import GetUser from "../../utils/getUserAtom";
import GroupHeader from "../../components/Forms/GroupHeader";
import PrizeCard from "../../components/Others/PrizeCard";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";
import formatDate from "../../utils/formatDate";
function UserDelivery() {
  const { user } = GetUser();
  const [deliver, setDeliver] = useState();
  const [flag, setFlag] = useState(false); //return card confirm span flag
  console.log("flag", flag);
  useEffect(() => {
    setAuthToken();
    getDeliver();
  }, []);

  const getDeliver = () => {
    api
      .get(`/user/get_deliver/${user._id}`)
      .then((res) => {
        if (res.data.status === 1) setDeliver(res.data.deliver);
      })
      .catch((err) => console.log(err));
  };

  const returnPrize = (deliver_id, id) => {
    console.log("deliver_id", deliver_id);
    api
      .post("/user/return_prize", {
        deliver_id: deliver_id,
        prize_id: id,
      })
      .then((res) => {
        if (res.data.status === 1) {
          getDeliver();
          showToast("Return Prize Successful")
        } else showToast("Return Prize Failed:", res.data.msg)
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-full mt-16">
      <SubHeader text="My Delivery" />
      <div className="flex flex-wrap">
        <div className="w-full md:w-1/2 px-5">
          <GroupHeader text="Pending" />
          <div className="px-3">
            {deliver?.length > 0 ? (
              deliver
                .filter((data) => data.status == "pending")
                .map((data, i) => {
                  return (
                    <div className="my-1">
                      <div>
                        {data.gacha_name} {formatDate(data.gacha_date)}
                      </div>
                      <div className="flex flex-wrap mt-2 mr-2">
                        {data.prizes?.length > 0
                          ? data.prizes.map((card) => (
                              <div className="group relative mt-1 mr-1">
                                <PrizeCard
                                  name={card.name}
                                  rarity={card.rarity}
                                  cashback={card.cashback}
                                  img_url={card.img_url}
                                />
                                <div className="absolute bottom-0 w-full bg-gray-200 hidden group-hover:block transition-all duration-300 text-base text-gray-800 text-center cursor-pointer z-3 py-2 animate-[displayEase_linear]">
                                  {flag == true ? (
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
                      </div>
                      <hr className="w-full my-2"></hr>
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
        <div className="w-full md:w-1/2 px-5">
          <GroupHeader text="Delivering" />
          <div className="px-3">
            {deliver?.length > 0 ? (
              deliver
                .filter((data) => data.status == "delivering")
                .map((data, i) => {
                  return (
                    <div className="my-1">
                      <div>
                        {data.gacha_name} {data.gacha_date}
                      </div>
                      <div className="flex flex-wrap mt-2 mr-2">
                        {data.prizes?.length > 0
                          ? data.prizes.map((card) => (
                              <PrizeCard
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
                There is no delivering card.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDelivery;
