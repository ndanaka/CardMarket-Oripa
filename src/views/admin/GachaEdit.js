import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import PrizeList from "../../components/Tables/PrizeList";
import PrizeCard from "../../components/Others/PrizeCard";
import formatPrice from "../../utils/formatPrice";

const GachaEdit = () => {
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();
  const lang = i18n.language;

  const { gachaId } = location.state || {};

  const [gacha, setGacha] = useState();
  const [gachaNum, setGachaNum] = useState(0);
  const [gachaCat, setGachaCat] = useState(0);
  const [loadFlag, setLoadFlag] = useState(false);
  const [prizeType, setPrizeType] = useState(false);
  const [trigger, setTrigger] = useState(false);
  const [firstPrizes, setFirstprizes] = useState([]);
  const [secondPrizes, setSecondprizes] = useState([]);
  const [thirdPrizes, setThirdprizes] = useState([]);
  const [fourthPrizes, setFourthprizes] = useState([]);
  const [extraPrizes, setExtraprizes] = useState([]);
  const [lastPrizes, setLastprizes] = useState([]);
  const [roundPrizes, setRoundprizes] = useState([]);

  useEffect(() => {
    setAuthToken();
    getGacha();
  }, [lang]);

  //get Gacha by id
  const getGacha = async () => {
    try {
      const res = await api.get(`/admin/gacha/${gachaId}`);

      if (res.data.status === 1) {
        setGacha(res.data.gacha);
        setGradePrizes(res.data.gacha);
        setGachaNum(
          res.data.gacha.grade_prizes.length +
            res.data.gacha.extra_prizes.length +
            res.data.gacha.round_prizes.length +
            res.data.gacha.last_prizes.length
        );

        switch (lang) {
          case "ch1":
            setGachaCat(res.data.gacha.category.ch1Name);
            break;
          case "ch2":
            setGachaCat(res.data.gacha.category.ch2Name);
            break;
          case "vt":
            setGachaCat(res.data.gacha.category.vtName);
            break;
          case "en":
            setGachaCat(res.data.gacha.category.enName);
            break;

          default:
            setGachaCat(res.data.gacha.category.jpName);
            break;
        }
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  // divide remain prizes by grade
  const setGradePrizes = (gacha) => {
    if (gacha.grade_prizes.length !== 0) {
      let firstPrizes = [];
      let secondPrizes = [];
      let thirdPrizes = [];
      let fourthPrizes = [];

      gacha.grade_prizes.forEach((prize) => {
        switch (prize.kind) {
          case "first":
            firstPrizes.push(prize);
            break;
          case "second":
            secondPrizes.push(prize);
            break;
          case "third":
            thirdPrizes.push(prize);
            break;
          case "fourth":
            fourthPrizes.push(prize);
            break;
          default:
            break;
        }
      });

      setFirstprizes(firstPrizes);
      setSecondprizes(secondPrizes);
      setThirdprizes(thirdPrizes);
      setFourthprizes(fourthPrizes);
    } else {
      setFirstprizes([]);
      setSecondprizes([]);
      setThirdprizes([]);
      setFourthprizes([]);
    }

    if (gacha.extra_prizes.length !== 0) {
      let extraPrizes = [];

      gacha.extra_prizes.forEach((prize) => {
        extraPrizes.push(prize);
      });

      setExtraprizes(extraPrizes);
    } else {
      setExtraprizes([]);
    }

    if (gacha.last_prizes.length !== 0) {
      let lastPrizes = [];

      gacha.last_prizes.forEach((prize) => {
        lastPrizes.push(prize);
      });

      setLastprizes(lastPrizes);
    } else {
      setLastprizes([]);
    }

    if (gacha.round_prizes.length !== 0) {
      let roundPrizes = [];

      gacha.round_prizes.forEach((prize) => {
        roundPrizes.push(prize);
      });

      setRoundprizes(roundPrizes);
    } else {
      setRoundprizes([]);
    }
  };

  // drawing prizes by kind
  const drawPrizesByKind = (prizes, kind) => {
    return (
      <div>
        <div className="my-2 text-3xl text-center font-bold">{t(kind)}</div>
        {kind === "round_number_prize" && (
          <div className="my-2 text-3xl text-center font-bold">
            1 / {gacha.award_rarity}
          </div>
        )}
        <div className="flex flex-wrap justify-center items-stretch">
          {prizes.map((prize, i) => (
            <div className="group relative" key={i}>
              <PrizeCard img_url={prize?.img_url} />
              <button
                className="absolute top-1 right-1 rounded-bl-[100%] w-8 h-8 hidden group-hover:block text-center bg-red-500 z-10 opacity-80 hover:opacity-100"
                onClick={() => unsetPrize(prize)}
              >
                <i className="fa fa-close text-gray-200 middle"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // unset registered prizes from gacha
  const unsetPrize = async (prize) => {
    try {
      if (!user.authority["gacha"]["write"]) {
        showToast(t("noPermission"), "error");
        return;
      }

      const res = await api.post("/admin/gacha/unset_prize", {
        gachaId: gachaId,
        prizeId: prize._id,
      });

      if (res.data.status === 1) {
        showToast(t("successUnset"), "success");
        setTrigger(!trigger);
        getGacha();
      } else {
        showToast(t("failedUnset"), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  return (
    <div className="p-3 w-full h-full md:w-[70%] m-auto">
      <div className="text-xl text-center text-slate-600">
        <i
          className="fa fa-chevron-left float-left cursor-pointer"
          onClick={() => navigate("/admin/gacha")}
        ></i>
        <span className="my-3 text-xl text-center font-bold">
          {t("gacha") + " " + t("detail")}
        </span>
      </div>
      <hr className="my-2" />

      <div className="overflow-auto">
        <table className="m-auto">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <tr>
              <td>{t("category")}</td>
              <td>{t("image")}</td>
              <td>{t("name")}</td>
              <td>{t("price")}</td>
              <td>{t("kind")}</td>
              <td>{t("number")}</td>
              <td>{t("order")}</td>
            </tr>
          </thead>
          <tbody>
            {gacha ? (
              <tr key={gacha._id}>
                <td>{gachaCat}</td>
                <td>
                  <img
                    src={process.env.REACT_APP_SERVER_ADDRESS + gacha.img_url}
                    alt="img"
                    className="m-auto w-[100px] h-auto"
                  />
                </td>
                <td>{gacha?.name}</td>
                <td>{formatPrice(gacha?.price)}pt</td>
                <td>
                  {gacha?.kind.map((item, i) => (
                    <p key={i}>{t(item.value)}</p>
                  ))}
                </td>
                <td>
                  {gachaNum} / {gacha.total_number}
                </td>
                <td>{gacha?.order}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="8">{t("nogacha")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <hr className="my-2" />

      <div className="w-full">
        <div className="text-lg text-center font-bold">{t("load_prizes")}</div>
        <div className="flex justify-between my-2 overflow-auto">
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("");
            }}
          >
            {t("uploadAll")}
          </button>
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("grade");
            }}
          >
            {t("grade_prizes")}
          </button>
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("round");
            }}
          >
            {t("round_prizes")}
          </button>
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("extra");
            }}
          >
            {t("extra_prize")}
          </button>
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
              setPrizeType("last");
            }}
          >
            {t("last_prize")}
          </button>
        </div>
        {loadFlag ? (
          <div className="overflow-auto">
            <PrizeList
              trigger={trigger}
              prizeType={prizeType}
              role="gacha"
              gachaId={gacha._id}
              getGacha={getGacha}
            />
          </div>
        ) : null}
      </div>
      <hr className="my-2" />

      {firstPrizes.length > 0 && drawPrizesByKind(firstPrizes, "first")}
      {secondPrizes.length > 0 && drawPrizesByKind(secondPrizes, "second")}
      {thirdPrizes.length > 0 && drawPrizesByKind(thirdPrizes, "third")}
      {fourthPrizes.length > 0 && drawPrizesByKind(fourthPrizes, "fourth")}
      {extraPrizes.length > 0 && drawPrizesByKind(extraPrizes, "extra_prize")}
      {roundPrizes.length > 0 &&
        drawPrizesByKind(roundPrizes, "round_number_prize")}
      {lastPrizes.length > 0 && drawPrizesByKind(lastPrizes, "last_prize")}

      {gachaNum === 0 && <div className="py-2 text-center">{t("noprize")}</div>}
    </div>
  );
};

export default GachaEdit;
