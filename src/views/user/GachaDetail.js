import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";

import PrizeCard from "../../components/Others/PrizeCard";

function GachaDetail() {
  const [gacha, setGacha] = useState(null); //gacha to be display
  const [firstPrizes, setFirstprizes] = useState([]); //prizes from csv file
  const [secondPrizes, setSecondprizes] = useState([]); //prizes from csv file
  const [thirdPrizes, setThirdprizes] = useState([]); //prizes from csv file
  const [fourthPrizes, setFourthprizes] = useState([]); //prizes from csv file

  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const { gachaId } = location.state || {}; //gacha id came from previous page through navigate

  useEffect(() => {
    getGacha();
  }, []);

  // get gacha by gacha id
  const getGacha = () => {
    api
      .get(`/admin/gacha/${gachaId}`)
      .then((res) => {
        if (res.data.status === 1) {
          setGradePrizes(res.data.gacha[0].remain_prizes);
          setGacha(res.data.gacha[0]);
        } else {
          showToast("Get gacha failed.", "error");
        }
      })
      .catch((err) => console.log(err));
  };

  // divide remaining prizes by grade
  const setGradePrizes = (remainPrizes) => {
    let firstPrizes = [];
    let secondPrizes = [];
    let thirdPrizes = [];
    let fourthPrizes = [];

    remainPrizes.map((remainPrize) => {
      switch (remainPrize.grade) {
        case 1:
          firstPrizes.push(remainPrize);
          break;
        case 2:
          secondPrizes.push(remainPrize);
          break;
        case 3:
          thirdPrizes.push(remainPrize);
          break;
        case 4:
          fourthPrizes.push(remainPrize);
          break;
        default:
          break;
      }
    });

    setFirstprizes(firstPrizes);
    setSecondprizes(secondPrizes);
    setThirdprizes(thirdPrizes);
    setFourthprizes(fourthPrizes);
  };

  // append remaining prizes to dom element
  const drawGradePrizes = (prizes, grade) => {
    return (
      <div>
        <div className="my-3 text-lg text-center font-bold">{t(grade)}</div>
        <div className="flex flex-wrap justify-center items-stretch">
          {prizes.map((prize, i) => (
            <div className="group relative m-2" key={i}>
              <PrizeCard
                key={i}
                name={prize?.name}
                rarity={prize?.rarity}
                cashback={prize?.cashback}
                img_url={prize?.img_url}
              />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-w-full bg-gray-100 md:px-0 mt-20">
      <div className="text-center text-xl py-3 mb-3 bg-white">
        <span className="text-indigo-600 font-black text-xl px-2">{gacha?.category}</span>
        {gacha?.name}
      </div>
      <div className="relative flex flex-col w-full md:w-1/2 m-auto">
        <div className="relative rounded-lg shadow-md shadow-gray-400 border-gray-300 bg-white mx-auto p-2">
          <img
            src={
              gacha
                ? process.env.REACT_APP_SERVER_ADDRESS +
                  gacha.gacha_thumnail_url
                : ""
            }
            alt="gacha thumnail"
            className="rounded-lg mx-auto"
          ></img>
        </div>

        <div className="w-auto py-3">
          <div className="flex flex-wrap justify-evenly items-stretch">
            {gacha?.remain_prizes?.length > 0 ? (
              <div>
                {firstPrizes?.length > 0
                  ? drawGradePrizes(firstPrizes, "first")
                  : ""}
                {secondPrizes?.length > 0
                  ? drawGradePrizes(secondPrizes, "second")
                  : ""}
                {thirdPrizes?.length > 0
                  ? drawGradePrizes(thirdPrizes, "third")
                  : ""}
                {fourthPrizes?.length > 0
                  ? drawGradePrizes(fourthPrizes, "fourth")
                  : ""}
              </div>
            ) : (
              <div className="py-2">{t("noprize")}</div>
            )}
          </div>
        </div>
        <div className="w-full py-2">
          {gacha?.last_prize ? (
            <div>
              <div className="my-2 text-lg text-center font-bold">
                {t("last") + " " + t("prize")}
              </div>
              <div className="group relative mt-2 mr-1">
                <PrizeCard
                  name={gacha.last_prize?.name}
                  rarity={gacha.last_prize?.rarity}
                  cashback={gacha.last_prize?.cashback}
                  img_url={gacha.last_prize?.img_url}
                />
              </div>
            </div>
          ) : (
            ""
          )}
        </div>
        <button
          className="py-2 px-5 my-3 rounded-sm bg-theme_color text-center text-white text-xl"
          onClick={() => navigate("/user/index")}
        >
          {t("return")}
        </button>
      </div>
    </div>
  );
}

export default GachaDetail;
