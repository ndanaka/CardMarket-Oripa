import { useState, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";

import Spinner from "../../components/Others/Spinner";
import NotEnoughPoints from "../../components/Modals/NotEnoughPoints";
import GachaPriceLabel from "../../components/Others/GachaPriceLabel";
import Progressbar from "../../components/Others/progressbar";

const RedrawGacha = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);
  const { gachaId } = location.state || {};

  const [gacha, setGacha] = useState(null);
  const [isOpenPointModal, setIsOpenPointModal] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    getGacha();
  }, [bgColor]);

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

      if (res.data.status === 1) setGacha(res.data.gacha);
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  // draw gacha
  const submitDrawGacha = async (gacha, counts) => {
    if (!user) {
      navigate("/auth/login");
      return;
    }

    if (user.role === "admin") {
      showToast(t("drawnAdmin"), "error");
      return;
    }

    const totalPoints =
      gacha?.price * (counts === "all" ? gacha?.remain_prizes.length : counts);
    const remainPoints = user.point_remain;
    if (remainPoints < totalPoints) {
      setIsOpenPointModal(true);
      return;
    }

    try {
      setAuthToken();

      setSpinFlag(true);
      const res = await api.post("/admin/gacha/draw_gacha", {
        gachaId: gacha?._id,
        counts: counts,
      });
      setSpinFlag(false);

      if (res.data.status === 1) {
        updateUserData();

        navigate("/user/showDrawedPrizes", {
          state: { prizes: res.data.prizes },
        });
      } else {
        switch (res.data.msg) {
          case 0:
            showToast(t("drawnEnoughPrize"), "error");
            break;

          case 1:
            showToast(t("noEnoughPoints"), "error");
            break;

          default:
            showToast(t("faileReq", "error"));
            break;
        }
      }
    } catch (error) {
      showToast(t("faileReq", "error"));
    }
  };

  return (
    <div className="flex flex-wrap w-full h-screen mx-auto">
      {spinFlag && <Spinner />}
      <div className="flex flex-col w-[90%] sm:w-[400px] mt-[10%] xs:mt-[50px] mx-auto">
        <p className="text-center text-xl font-bold">{t("gachaAgain")}</p>
        <div className="relative cursor-pointer w-full border-1 border-gray-100 shadow-md shadow-gray-300 rounded-md pb-2 w-[80%] mx-auto my-3">
          <img
            src={process.env.REACT_APP_SERVER_ADDRESS + gacha?.img_url}
            alt="img_url"
            className="rounded-t h-[200px] w-full object-cover"
          />
          <div className="w-full py-8">
            <div className="w-4/6 flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 bottom-2 text-center">
              <GachaPriceLabel price={gacha?.price} />
              <Progressbar
                progress={
                  (gacha?.remain_prizes.length / gacha?.total_number) * 100
                }
                label={
                  gacha?.remain_prizes.length + " / " + gacha?.total_number
                }
                height={20}
              />
            </div>
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-center py-2">
          {gacha?.remain_prizes.length === 0 ? (
            <button
              className="mx-1 text-white cursor-not-allowed bg-gray-400 text-center px-1 py-2.5 border-r-[1px] border-t-2 border-white rounded-lg m-0 xs:px-4 w-[60%]"
              disabled={true}
            >
              {t("soldOut")}
            </button>
          ) : (
            <>
              <button
                className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-1 py-2.5 border-r-[1px] border-t-2 border-white rounded-lg m-0 xs:px-4 w-[30%]"
                style={{
                  backgroundColor: bgColor,
                }}
                onClick={() => {
                  submitDrawGacha(gacha, 1);
                }}
              >
                {t("drawOne")}
              </button>
              {!gacha?.kind.some((item) => item.value === "once_per_day") ? (
                <>
                  {gacha?.remain_prizes.length >= 10 && (
                    <button
                      className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-1 py-2.5 border-r-[1px] border-t-2 border-white rounded-lg m-0 xs:px-4 w-[30%]"
                      onClick={() => {
                        submitDrawGacha(gacha, 10);
                      }}
                      style={{
                        backgroundColor: bgColor,
                      }}
                    >
                      {t("drawTen")}
                    </button>
                  )}
                  {gacha?.type === 2 && gacha?.remain_prizes.length !== 1 && (
                    <button
                      className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-1 py-2.5  rounded-lg border-t-2 border-white m-0 xs:px-4 w-[30%]"
                      onClick={() => {
                        submitDrawGacha(gacha, "all");
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
      </div>
      <div className="flex flex-col fixed bottom-0 py-3 px-2 border-t-[1px] border-gray-200 w-full">
        <div className="flex flex-col w-[90%] sm:w-[420px] mx-auto">
          <p className="text-center font-bold">{t("gotPoints")}</p>
          <p className="text-center">{t("gotPointsDesc")}</p>
          <button
            className="mx-auto text-white bg-gray-600 hover:opacity-50 px-1 py-2.5 rounded-md w-[60%] mt-3"
            onClick={() => navigate("/")}
          >
            {t("returnHome")}
          </button>
        </div>
      </div>
      <NotEnoughPoints
        headerText={t("noEnoughPoints")}
        bodyText={t("noEnoughPointsDesc")}
        okBtnClick={() => navigate("/user/purchasePoint")}
        isOpen={isOpenPointModal}
        setIsOpen={setIsOpenPointModal}
        bgColor={bgColor}
      />
    </div>
  );
};

export default RedrawGacha;
