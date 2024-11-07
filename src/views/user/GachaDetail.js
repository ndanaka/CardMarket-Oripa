import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

import PrizeCard from "../../components/Others/PrizeCard";
import GachaPriceLabel from "../../components/Others/GachaPriceLabel";
import Progressbar from "../../components/Others/progressbar";
import GachaModal from "../../components/Modals/GachaModal";
import NotEnoughPoints from "../../components/Modals/NotEnoughPoints";
import Spinner from "../../components/Others/Spinner";

function GachaDetail() {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const { gachaId } = location.state || {};

  const [gacha, setGacha] = useState(null);
  const [gachaNum, setGachaNum] = useState(0);
  const [firstPrizes, setFirstprizes] = useState([]);
  const [secondPrizes, setSecondprizes] = useState([]);
  const [thirdPrizes, setThirdprizes] = useState([]);
  const [fourthPrizes, setFourthprizes] = useState([]);
  const [extraPrizes, setExtraprizes] = useState([]);
  const [lastPrizes, setLastprizes] = useState([]);
  const [roundPrizes, setRoundprizes] = useState([]);
  const [blurLevel, setBlurLevel] = useState(0);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpenPointModal, setIsOpenPointModal] = useState(false);
  const [isOpenGachaModal, setIsOpenGachaModal] = useState(false);
  const [selGacha, setSelGacha] = useState([0, 0]);
  const [label, setLabel] = useState("");
  const [totalNum, setTotalNum] = useState("");
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    getGacha();
  }, [bgColor]);

  useEffect(() => {
    window.scrollTo(0, 0);

    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const newBlurLevel = Math.min(scrollPos / 50, 20);
      setBlurLevel(newBlurLevel);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [location]);

  // update user data and update localstorage
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

  // get gacha by gacha id
  const getGacha = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get(`/admin/gacha/${gachaId}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        setGacha(res.data.gacha);
        devideRemainPrizes(res.data.gacha);
        setGachaNum(res.data.gacha.remain_prizes.length);
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  // divide remain prizes by grade
  const devideRemainPrizes = (gacha) => {
    let firstPrizes = [];
    let secondPrizes = [];
    let thirdPrizes = [];
    let fourthPrizes = [];
    let roundPrizes = [];
    let extraPrizes = [];
    let lastPrizes = [];

    if (gacha.remain_prizes.length > 0) {
      gacha.remain_prizes.forEach((prize) => {
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

          case "round_number_prize":
            roundPrizes.push(prize);
            break;

          case "extra_prize":
            extraPrizes.push(prize);
            break;

          case "last_prize":
            lastPrizes.push(prize);
            break;
          default:
            break;
        }
      });
    }

    setFirstprizes(firstPrizes);
    setSecondprizes(secondPrizes);
    setThirdprizes(thirdPrizes);
    setFourthprizes(fourthPrizes);
    setRoundprizes(roundPrizes);
    setExtraprizes(extraPrizes);
    setLastprizes(lastPrizes);
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
            </div>
          ))}
        </div>
      </div>
    );
  };

  // check draw conditions
  const drawGacha = (gacha, num, label, totalNum) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (user.role === "admin") {
      showToast(t("drawnAdmin"), "error");
      return;
    }

    const totalPoints = gacha.price * (num === "all" ? totalNum : num);
    const remainPoints = user.point_remain;
    if (remainPoints < totalPoints) {
      setIsOpenPointModal(true);
      return;
    }

    setSelGacha([gacha, num]);
    setLabel(label);
    setTotalNum(totalNum);
    setIsOpenGachaModal(true);
  };

  // draw gacha
  const submitDrawGacha = async () => {
    try {
      setAuthToken();
      setIsOpenGachaModal(false);

      const res = await api.post("/admin/gacha/draw_gacha", {
        gachaId: selGacha[0]._id,
        drawCounts: selGacha[1],
        drawDate: new Date(),
      });
      console.log(res.data);

      if (res.data.status === 1) {
        showToast(t("drawnSuccess"), "success");
        // setPopedPrizes(res.data.prizes);
        // setExistLastFlag(res.data.existLastFlag);
        // setLastEffect(res.data.lastEffect);
        // setShowCardFlag(true);
        // updateUserData();
      } else {
        switch (res.data.msg) {
          // case 0:
          //   showToast(t("dranAdmin"), "error");
          //   break;

          case 0:
            showToast(t("noEnoughPoints"), "error");
            break;

          case 1:
            showToast(t("drawnEnoughPrize"), "error");
            break;

          default:
            break;
        }
      }
    } catch (error) {
      showToast(t("faileReq", "error"));
    }
  };

  return (
    <>
      {spinFlag && <Spinner />}
      <div className="xxsm:mx-auto" ref={mainContent}>
        <div
          className={`w-full xxsm:w-[500px] fixed top-0 transition-all duration-100 bg-gray-800 h-screen h-[calc(100vh-160px)] shadow-md shadow-gray-400 mt-[66px] mx-auto`}
          style={{
            filter: `blur(${blurLevel}px)`,
            transition: "filter 0.2s ease",
          }}
        >
          <img
            src={process.env.REACT_APP_SERVER_ADDRESS + gacha?.img_url}
            alt="gacha thumnail"
            className="object-contain"
          />
        </div>
        <div
          className="w-full xxsm:w-[500px] relative pb-48 mt-[calc(100vh-100px)] z-10 bg-[#f3f4f6]"
          style={{ boxShadow: "10px 10px 100px 0px rgba(0, 0, 0, 0.6)" }}
        >
          <div className="flex flex-wrap py-3 justify-center items-center">
            <div className="border border-1 h-[2px] w-[10%] border-black mx-3"></div>
            <p className="font-bold text-center text-3xl">
              {t("prize") + " " + t("list")}
            </p>
            <div className="border border-1 h-[2px] w-[10%] border-black mx-3"></div>
          </div>
          <hr className="my-2 text-sm mx-auto"></hr>
          {firstPrizes.length > 0 && drawPrizesByKind(firstPrizes, "first")}
          {secondPrizes.length > 0 && drawPrizesByKind(secondPrizes, "second")}
          {thirdPrizes.length > 0 && drawPrizesByKind(thirdPrizes, "third")}
          {fourthPrizes.length > 0 && drawPrizesByKind(fourthPrizes, "fourth")}
          {extraPrizes.length > 0 &&
            drawPrizesByKind(extraPrizes, "extra_prize")}
          {roundPrizes.length > 0 &&
            drawPrizesByKind(roundPrizes, "round_number_prize")}
          {lastPrizes.length > 0 && drawPrizesByKind(lastPrizes, "last_prize")}
        </div>
        <div className="z-20 w-full xxsm:w-[500px] fixed bottom-[65px] flex flex-col items-center text-center px-20 pb-2">
          <GachaPriceLabel price={gacha?.price} />
          <Progressbar
            progress={(gachaNum / gacha?.total_number) * 100}
            label={gachaNum + " / " + gacha?.total_number}
            height={20}
          />
        </div>
        <div
          className="z-10 w-full xxsm:w-[500px] fixed bottom-0 flex justify-center pb-3 pt-12 px-8 bg-[#f3f4f6]"
          style={{ boxShadow: "10px 10px 100px 0px rgba(0, 0, 0, 0.5)" }}
        >
          {gachaNum === 0 ? (
            <button
              className="mx-1 text-white cursor-not-allowed bg-gray-400 text-center px-3 py-2.5 border-r-[1px] border-t-2 border-white rounded-lg m-0 xs:px-4 w-[60%]"
              disabled={true}
            >
              {t("soldOut")}
            </button>
          ) : (
            <>
              <button
                className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-3 py-2.5 border-r-[1px] border-t-2 border-white rounded-lg m-0 xs:px-4 w-[30%]"
                style={{
                  backgroundColor: bgColor,
                }}
                onClick={() => {
                  drawGacha(gacha, 1, t("drawOne"), gachaNum);
                }}
              >
                {t("drawOne")}
              </button>
              {!gacha.kind.some((item) => item.value === "once_per_day") ? (
                <>
                  {gachaNum >= 10 && (
                    <button
                      className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-3 py-2.5 border-r-[1px] border-t-2 border-white rounded-lg m-0 xs:px-4 w-[30%]"
                      onClick={() => {
                        drawGacha(gacha, 10, t("drawTen"), gachaNum);
                      }}
                      style={{
                        backgroundColor: bgColor,
                      }}
                    >
                      {t("drawTen")}
                    </button>
                  )}
                  {gachaNum !== 1 && (
                    <button
                      className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-3 py-2.5  rounded-lg border-t-2 border-white m-0 xs:px-4 w-[30%]"
                      onClick={() => {
                        drawGacha(gacha, "all", t("drawAll"), gachaNum);
                      }}
                      style={{
                        backgroundColor: bgColor,
                      }}
                    >
                      {t("drawAll")}
                    </button>
                  )}
                </>
              ) : (
                ""
              )}
            </>
          )}
        </div>
        {selGacha?.length > 0 ? (
          <GachaModal
            label={label}
            gachaName={selGacha[0].name}
            price={selGacha[0].price}
            draws={selGacha[1]}
            totalNum={totalNum}
            onDraw={submitDrawGacha}
            isOpen={isOpenGachaModal}
            setIsOpen={setIsOpenGachaModal}
            bgColor={bgColor}
          />
        ) : null}
        <NotEnoughPoints
          headerText={t("noEnoughPoints")}
          bodyText={t("noEnoughPointsDesc")}
          okBtnClick={() => navigate("/user/pur-point")}
          isOpen={isOpenPointModal}
          setIsOpen={setIsOpenPointModal}
          bgColor={bgColor}
        />
      </div>
    </>
  );
}

export default GachaDetail;
