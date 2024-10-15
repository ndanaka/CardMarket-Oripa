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
  const [gacha, setGacha] = useState(null); //gacha to be display
  const [firstPrizes, setFirstprizes] = useState([]); //prizes from csv file
  const [secondPrizes, setSecondprizes] = useState([]); //prizes from csv file
  const [thirdPrizes, setThirdprizes] = useState([]); //prizes from csv file
  const [fourthPrizes, setFourthprizes] = useState([]); //prizes from csv file
  const mainContent = useRef(null);
  const [blur, setBlur] = useState("blur-[0px]");
  const [lastScrollY, setLastScrollY] = useState(0);
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();
  const [isOpenPointModal, setIsOpenPointModal] = useState(false); //gacha confirm modal show flag
  const [isOpenGachaModal, setIsOpenGachaModal] = useState(false); //gacha confirm modal show flag
  const [selGacha, setSelGacha] = useState([0, 0]);
  const { gachaId, progress } = location.state || {}; //gacha id came from previous page through navigate
  const [popedPrizes, setPopedPrizes] = useState(null); //obtained prize through gacha draw
  const [showCardFlag, setShowCardFlag] = useState();
  const [existLastFlag, setExistLastFlag] = useState(false);
  const [lastEffect, setLastEffect] = useState(false);

  useEffect(() => {
    getGacha();
  }, [showCardFlag]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [lastScrollY]); // Dependency array includes lastScrollY

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

  // update user data and update localstorage
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

  // check draw conditions
  const drawGacha = (gacha, num) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }
    const remainPrizes = gacha.last_prize
      ? gacha.remain_prizes.length + 1
      : gacha.remain_prizes.length;
    const totalPoints = gacha.price * num;
    const remainPoints = user.point_remain;

    // return when user is admin
    if (user.role === "admin") {
      showToast(t("drawnAdmin"), "error");
      return;
    }

    // return when remain prize is less than selected drawing counts
    if (remainPrizes < num) {
      showToast(t("drawnEnoughPrize"), "error");
      return;
    }

    // remain point is less than selected drawing points
    if (remainPoints < totalPoints) {
      setIsOpenPointModal(true);
      return;
    }

    setSelGacha([gacha, num]);
    setIsOpenGachaModal(true);
  };

  // draw gacha
  const submitDrawGacha = () => {
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

  // divide remaining prizes by grade
  const setGradePrizes = (remainPrizes) => {
    let firstPrizes = [];
    let secondPrizes = [];
    let thirdPrizes = [];
    let fourthPrizes = [];

    remainPrizes.forEach((remainPrize) => {
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
        <div className="py-2 text-3xl text-center font-bold">{t(grade)}</div>
        <div className="flex flex-wrap justify-center items-stretch">
          {prizes.map((prize, i) => (
            <PrizeCard
              key={i}
              name={prize?.name}
              rarity={prize?.rarity}
              cashback={prize?.cashback}
              img_url={prize?.img_url}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-grow">
      <div
        className="w-full md:w-[500px] md:mx-2 mt-15 mx-auto"
        ref={mainContent}
      >
        <div className="m-auto">
          <div className="fixed top-0">
            <div
              className={`h-screen ${blur} transition-all duration-100 bg-gray-800 h-[calc(100vh-160px)] mt-[62px] w-full md:w-[500px] shadow-md shadow-gray-400 mx-auto bg-black`}
            >
              <img
                src={
                  gacha
                    ? process.env.REACT_APP_SERVER_ADDRESS +
                      gacha.gacha_thumnail_url
                    : ""
                }
                alt="gacha thumnail"
                className="mx-auto w-full md:w-[500px] object-contain"
              />
            </div>
          </div>
          <div
            className="relative pt-10 pb-48 mt-[calc(100vh-100px)] z-10 bg-[#f3f4f6]"
            style={{ boxShadow: "10px 10px 100px 0px rgba(0, 0, 0, 0.6)" }}
          >
            {gacha?.remain_prizes?.length > 0 &&
              (firstPrizes?.length > 0
                ? drawGradePrizes(firstPrizes, "first")
                : "")}
            {gacha?.remain_prizes?.length > 0 &&
              (secondPrizes?.length > 0
                ? drawGradePrizes(secondPrizes, "second")
                : "")}
            {gacha?.remain_prizes?.length > 0 &&
              (thirdPrizes?.length > 0
                ? drawGradePrizes(thirdPrizes, "third")
                : "")}
            {gacha?.remain_prizes?.length > 0 &&
              (fourthPrizes?.length > 0
                ? drawGradePrizes(fourthPrizes, "fourth")
                : "")}
            {gacha?.remain_prizes?.length === 0 && (
              <div className="py-2 text-center text-lg font-bold">
                {t("noprize")}
              </div>
            )}
            {gacha?.last_prize ? (
              <div>
                <div className="my-2 text-3xl text-center font-bold">
                  {t("last") + " " + t("prize")}
                </div>
                <div className="flex flex-wrap justify-center items-stretch">
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
          <div className="z-30 w-full md:w-[500px] fixed bottom-[65px] flex flex-col items-center text-center px-20 pb-2">
            <GachaPriceLabel price={gacha?.price} />
            <Progressbar
              progress={progress}
              label={
                gacha?.remain_prizes.length +
                (gacha?.last_prize ? 1 : 0) +
                " / " +
                gacha?.total_number
              }
            />
          </div>
          <div className="z-20 w-full md:w-[500px] fixed bottom-0 flex justify-center pb-3 pt-12 px-8 bg-[#f3f4f6]">
            <div
              className="bg-theme_color cursor-pointer hover:bg-[#f00] text-white text-center py-2 border-r-[1px] border-t-2 border-white rounded-lg mx-2 w-2/5"
              onClick={() => {
                drawGacha(gacha, 1);
              }}
            >
              1 {t("draw")}
            </div>
            <div
              className="bg-theme_color cursor-pointer hover:bg-[#f00] text-white text-center py-2 rounded-lg border-t-2 border-white mx-2 w-2/5"
              onClick={() => {
                drawGacha(gacha, 10);
              }}
            >
              10 {t("draws")}
            </div>
          </div>
        </div>
        <div
          className={`flex flex-wrap justify-center items-center z-[50] overflow-auto bg-gray-800 py-4 px-3 w-full h-full bg-opacity-50 fixed top-0 left-0 ${
            showCardFlag ? "" : "hidden"
          } `}
        >
          <div className="relative h-fit flex flex-wrap w-full md:w-4/5 lg:w-3/5 xl:w-2/5 py-10">
            <div className="absolute top-0 right-0 text-gray-200 text-3xl">
              <i
                className="fa fa-close cursor-pointer"
                onClick={() => setShowCardFlag(false)}
              ></i>
            </div>
            {popedPrizes?.map((prize, i) => (
              <div
                key={i}
                className="rounded-lg animate-[animatezoom_1s_ease-in-out] mx-auto"
              >
                <PrizeCard
                  index={i}
                  prizeType={prize.type}
                  lastEffect={prize.last_effect}
                  name={prize.name}
                  rarity={prize.rarity}
                  cashback={prize.cashback}
                  img_url={prize.img_url}
                />
              </div>
            ))}
            <div
              className={`${
                lastEffect && existLastFlag ? "" : "hidden"
              } absolute top-[20%] w-full flex justify-center items-center`}
            >
              <div className="bg-white text-center rounded-lg p-4 shadow-xl">
                <h2 className="text-3xl font-bold text-pink-500 ">
                  🎉 {t("wonLast")} 🎉
                </h2>
                <p className="text-md mt-4 text-gray-700">{t("wonDesc")}</p>
                <div className="mt-6">
                  <button
                    className="bg-pink-500 hover:bg-pink-600 text-white py-1 px-3 rounded-lg"
                    onClick={() => setExistLastFlag(false)}
                  >
                    {t("wonConfirm")}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {selGacha?.length > 0 ? (
          <GachaModal
            headerText={t("drawGacha")}
            name={selGacha[0].name}
            price={selGacha[0].price}
            draws={selGacha[1]}
            onDraw={submitDrawGacha}
            isOpen={isOpenGachaModal}
            setIsOpen={setIsOpenGachaModal}
          />
        ) : null}

        <NotEnoughPoints
          headerText={t("noEnoughPoints")}
          bodyText={t("noEnoughPointsDesc")}
          okBtnClick={() => navigate("/user/pur-point")}
          isOpen={isOpenPointModal}
          setIsOpen={setIsOpenPointModal}
        />
      </div>
    </div>
  );
}

export default GachaDetail;
