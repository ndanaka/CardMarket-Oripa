import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import usePersistedUser from "../../store/usePersistedUser";
import { setAuthToken } from "../../utils/setHeader";

import PrizeCard from "../../components/Others/PrizeCard";
import GachaPriceLabel from "../../components/Others/GachaPriceLabel";
import Progressbar from "../../components/Others/progressbar";
import GachaModal from "../../components/Modals/GachaModal";
import NotEnoughPoints from "../../components/Modals/NotEnoughPoints";

function GachaDetail() {
  const mainContent = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();
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
  const [blur, setBlur] = useState("blur-[0px]");
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isOpenPointModal, setIsOpenPointModal] = useState(false);
  const [isOpenGachaModal, setIsOpenGachaModal] = useState(false);
  const [selGacha, setSelGacha] = useState([0, 0]);
  const [popedPrizes, setPopedPrizes] = useState(null);
  const [showCardFlag, setShowCardFlag] = useState();
  const [existLastFlag, setExistLastFlag] = useState(false);
  const [lastEffect, setLastEffect] = useState(false);
  const [bgColor, setBgColor] = useState("");
  const [label, setLabel] = useState("");
  const [totalNum, setTotalNum] = useState("");

  useEffect(() => {
    getThemeData();
    getGacha();
  }, [bgColor, showCardFlag]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
  }, []);

  const handleScroll = () => {
    const currentScrollY = window.scrollY;
    const delta = currentScrollY - lastScrollY;

    // Calculate blur based on scroll direction
    if (delta > 0) {
      // Scrolling down
      setBlur((prev) => {
        const currentBlur = Math.floor(parseInt(prev.match(/\d+/)[0]));
        return `blur-[${Math.min(currentBlur + 1, 20)}px]`; // Increase blur but cap at 20px
      });
    } else if (delta < 0) {
      // Scrolling up
      setBlur((prev) => {
        const currentBlur = Math.floor(parseInt(prev.match(/\d+/)[0]));
        return `blur-[${Math.max(currentBlur - 1, 0)}px]`; // Decrease blur but not below 0px
      });
    }

    // Update last scroll position
    setLastScrollY(currentScrollY);
  };

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");
    if (res.data.status === 1 && res.data.theme) {
      if (res.data.theme.bgColor) {
        setBgColor(res.data.theme.bgColor);
        localStorage.setItem("bgColor", res.data.theme.bgColor);
      } else {
        setBgColor("#e50e0e");
      }
    } else {
      setBgColor("#e50e0e");
    }
  };

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

    const totalPoints = gacha.price * num;
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
    setAuthToken();
    setIsOpenGachaModal(false);

    api
      .post("/admin/gacha/draw_gacha", {
        gachaId: selGacha[0]._id,
        drawCounts: selGacha[1],
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast(t("drawnSuccess"), "success");
          setPopedPrizes(res.data.prizes);
          setExistLastFlag(res.data.existLastFlag);
          setLastEffect(res.data.lastEffect);
          setShowCardFlag(true);
          updateUserData();
        } else {
          switch (res.data.msg) {
            case 0:
              showToast(t("drawnAdmin"), "error");
              break;
            case 1:
              showToast(t("noEnoughPoints"), "error");
              break;
            case 2:
              showToast(t("drawnEnoughPrize"), "error");
              break;

            default:
              break;
          }
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="xxsm:mx-auto" ref={mainContent}>
      <div
        className={`w-full xxsm:w-[500px] fixed top-0 ${blur} transition-all duration-100 bg-gray-800 h-screen h-[calc(100vh-160px)] shadow-md shadow-gray-400 mt-[66px] mx-auto`}
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
        {extraPrizes.length > 0 && drawPrizesByKind(extraPrizes, "extra_prize")}
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
            {!gacha.kind.some((item) => item.value === "once_per_day") && (
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
  );
}

export default GachaDetail;
