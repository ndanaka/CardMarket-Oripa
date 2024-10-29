import { useState, useEffect } from "react";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import formatDate from "../../utils/formatDate";

import SubHeader from "../../components/Forms/SubHeader";
import PrizeCard from "../../components/Others/PrizeCard";

import usePersistedUser from "../../store/usePersistedUser";
import { useTranslation } from "react-i18next";
import { showToast } from "../../utils/toastUtil";

function UserCard() {
  const [userCards, setUserCards] = useState();
  const [user] = usePersistedUser();
  const { t } = useTranslation();

  useEffect(() => {
    setAuthToken();
    getUserCards();
  }, []);

  const getUserCards = () => {
    api
      .get(`/user/get_cards/${user?._id}`)
      .then((res) => {
        if (res.data.status === 1) setUserCards(res.data.cards);
      })
      .catch((err) => showToast(err, "error"));
  };

  return (
    <div className="w-full flex flex-grow md:w-4/6 p-3 mx-auto mt-16">
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
                                name={card.name}
                                rarity={card.rarity}
                                cashback={card.cashback}
                                img_url={card.img_url}
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
