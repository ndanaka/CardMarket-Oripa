import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import formatDate from "../../utils/formatDate";
import { showToast } from "../../utils/toastUtil";

import usePersistedUser from "../../store/usePersistedUser";

import SubHeader from "../../components/Forms/SubHeader";
import PrizeCard from "../../components/Others/PrizeCard";
import Spinner from "../../components/Others/Spinner";

function UserCard() {
  const { t } = useTranslation();
  const [user] = usePersistedUser();

  const [userCards, setUserCards] = useState();
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setAuthToken();
    getUserCards();
  }, []);

  const getUserCards = async () => {
    setSpinFlag(true);
    const res = await api.get(`/user/get_cards/${user?._id}`);
    setSpinFlag(false);

    if (res.data.status === 1) setUserCards(res.data.cards);
  };

  return (
    <div className="w-full flex flex-grow md:w-4/6 p-3 mx-auto mt-14">
      {spinFlag && <Spinner />}
      <div className="flex flex-col mx-auto">
        <SubHeader text={t("my") + " " + t("cards")} />
        <div className="fitems-stretch">
          <div className="contents">
            {userCards ? (
              userCards.map((gacha, i) => {
                return (
                  <div className="my-1" key={i}>
                    <div className="text-center">{gacha.gacha_name}</div>
                    <div className="text-center">
                      {formatDate(gacha.gacha_date)}
                    </div>
                    <div className="flex flex-wrap justify-center">
                      {gacha.prizes?.length > 0
                        ? gacha.prizes.map((card, i) => (
                            <div className="mt-2 mr-2" key={i}>
                              <PrizeCard
                                img_url={card.img_url}
                                width={100}
                                height={150}
                              />
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
                {t("noCard")}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
