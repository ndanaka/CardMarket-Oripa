import { useState, useEffect } from "react";
import api from "../../utils/api";
import GetUser from "../../utils/getUserAtom";
import SubHeader from "../../components/Forms/SubHeader";
import PrizeCard from "../../components/Others/PrizeCard";
function UserCard() {
  const [userCards, setUserCards] = useState();
  const { user } = GetUser();

  useEffect(() => {
    getUserCards();
  }, []);

  const getUserCards = () => {
    api
      .get(`/user/get_cards/${user._id}`)
      .then((res) => {
        if (res.data.status === 1) setUserCards(res.data.cards);
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-full md:w-4/6 p-3 mx-auto mt-16">
      <SubHeader text="My Cards" />
      <div className="flex flex-wrap justify-evenly items-center">
        <div className="w-full p-2">
          <div className="flex flex-wrap justify-evenly"></div>
          {userCards ? (
            userCards.map((gacha, i) => {
              return (
                <div className="my-1">
                  <div>
                    {gacha.gacha_name} {gacha.gacha_date}
                  </div>
                  <div className="flex flex-wrap ">
                    {gacha.prizes?.length > 0
                      ? gacha.prizes.map((card) => (
                          <div className="mt-2 mr-2">
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
              There is no card.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UserCard;
