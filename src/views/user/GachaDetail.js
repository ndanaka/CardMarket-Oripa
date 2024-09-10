import { useState, useEffect } from "react";
import api from "../../utils/api";
import { useLocation, useNavigate } from "react-router-dom";
import { showToast } from "../../utils/toastUtil";
import PrizeCard from "../../components/Others/PrizeCard";
import { useTranslation } from "react-i18next";

function GachaDetail() {
  const [gacha, setGacha] = useState(null); //gacha to be display
  const navigate = useNavigate();
  const location = useLocation();
  const {t} = useTranslation();
  const { gachaId } = location.state || {}; //gacha id came from previous page through navigate


  console.log("gacha",gacha)
  useEffect(() => {
    getGacha();
  }, []);
  //get gacha by gacha id
  const getGacha = () => {
    api
      .get(`/admin/gacha/${gachaId}`)
      .then((res) => {
        if (res.data.status === 1) setGacha(res.data.gacha[0]);
        else {
          showToast("Get gacha failed.", "error");
          console.log(res.data.err);
        }
      })
      .catch((err) => console.log(err));
  };
  return (
    <div className="w-full  bg-gray-100 md:px-0 mt-16">
      <div className="text-center text-xl py-3 mb-3 bg-white">
        <span className="text-indigo-600 text-xl px-2">{gacha?.category}</span>
        {gacha?.name}
      </div>
      <div className="flex flex-col w-full md:w-1/2 m-auto">
        <div className="w-full px-2 rounded-lg shadow-lg shadow-gray-300 bg-white">
          <img
            src={
              gacha
                ? process.env.REACT_APP_SERVER_ADDRESS +
                  gacha.gacha_thumnail_url
                : ""
            }
            alt="gacha thumnail"
            className="rounded-lg m-auto"
          ></img>
        </div>
        <div className="w-full py-3">
          <div className="text-lg">{t('prize')}</div>
          <hr></hr>
          <div className="flex flex-wrap justify-evenly items-stretch">
            {gacha?.remain_prizes?.length > 0 ? (
              gacha.remain_prizes.map((prize, i) => (
                <div className=" py-2">
                  <div className="mt-1 mr-1 bg-white rounded-lg">
                    <PrizeCard
                      key={i}
                      name={prize?.name}
                      rarity={prize?.rarity}
                      cashback={prize?.cashback}
                      img_url={prize?.img_url}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="py-2">{t('noprize')}</div>
            )}
          </div>
          <hr></hr>
        </div>
        <div className="w-full py-2">
          <div className="text-xl">{t('last') + " " + t('prize')}</div>
          <hr className="mb-2"></hr>
          {gacha?.last_prize ? (
            <PrizeCard
              name={gacha?.last_prize ? gacha.last_prize.name : ""}
              rarity={gacha?.last_prize ? gacha.last_prize.rarity : ""}
              cashback={gacha?.last_prize ? gacha.last_prize.cashback : ""}
              img_url={gacha?.last_prize ? gacha.last_prize.img_url : ""}
            />
          ) : (
            <div className="py-2">{t('nolastprize')}</div>
          )}
        </div>
        <button
          className="py-2 px-5 my-3 rounded-sm bg-theme_color text-center text-white text-xl"
          onClick={() => navigate("/user/index")}
        >
          {t('return')}
        </button>
      </div>
    </div>
  );
}

export default GachaDetail;
