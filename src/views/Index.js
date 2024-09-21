import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";

import api from "../utils/api";
import { setAuthToken } from "../utils/setHeader";
import { showToast } from "../utils/toastUtil";

import GachaModal from "../components/Modals/GachaModal";
import PrizeCard from "../components/Others/PrizeCard";
import Progressbar from "../components/Others/progressbar";
import GachaPriceLabel from "../components/Others/GachaPriceLabel";
import ChangeLanguage from "../components/Others/ChangeLanguage";
import ImageCarousel from "../components/Others/ImageCarousel";
import NotEnoughPoints from "../components/Modals/NotEnoughPoints";

import usePersistedUser from "../store/usePersistedUser";

const Index = () => {
  const [category, setCategory] = useState(null); //category list
  const [gacha, setGacha] = useState(null); //gacah list
  const [filteredGacha, setFilteredGacha] = useState();
  const [categoryFilter, setCategoryFilter] = useState("all"); //gacha filter
  const [filter, setFilter] = useState([]);
  const [isOpenPointModal, setIsOpenPointModal] = useState(false); //gacha confirm modal show flag
  const [isOpenGachaModal, setIsOpenGachaModal] = useState(false); //gacha confirm modal show flag
  const [selGacha, setSelGacha] = useState([0, 0]); //variable that determine which gacha and which draw
  const [obtains, setObtains] = useState(null); //obtained prize through gacha draw
  const [showCardFlag, setShowCardFlag] = useState(); //showflag for obtained prize
  const [user, setUser] = usePersistedUser();
  const { t } = useTranslation();

  const navigate = useNavigate();

  const carouselItems = [
    { id: 1, imgUrl: "theme/carousel/rank_banner.png" },
    { id: 2, imgUrl: "theme/carousel/point.png" },
    { id: 2, imgUrl: "theme/carousel/001.png" },
    { id: 2, imgUrl: "theme/carousel/002.png" },
  ];

  useEffect(() => {
    getCategory();
    getGacha();
  }, []);

  useEffect(() => {
    setFilteredGacha(
      gacha?.filter(
        (gacha) =>
          gacha.isRelease === true &&
          (categoryFilter === "all" ? true : gacha.category === categoryFilter)
      )
    );

    if (filter?.length > 0) {
      if (filter.includes("all")) return;
      if (filter.includes("last_prize")) {
        setFilteredGacha(
          gacha?.filter(
            (gacha) =>
              gacha.last_prize !== undefined && gacha.last_prize !== null
          )
        );
      }
    }
  }, [gacha, categoryFilter, filter]);

  const getCategory = () => {
    api
      .get("admin/get_category")
      .then((res) => {
        if (res.data.status === 1) {
          setCategory(res.data.category);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const getGacha = () => {
    api
      .get("/admin/gacha")
      .then((res) => {
        if (res.data.status === 1) {
          setGacha(res.data.gachaList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

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

  // draw gacha
  const drawGacha = (gacha, num) => {
    const totalPoints = gacha.price * num;
    const remainPoints = user.point_remain;

    if (remainPoints === 0 || remainPoints < totalPoints) {
      setIsOpenPointModal(true);
    } else {
      setSelGacha([gacha, num]);
      setIsOpenGachaModal(true);
    }
  };

  const submitDrawGacha = () => {
    setAuthToken();
    setIsOpenGachaModal(false);

    api
      .post("/admin/gacha/draw_gacha", {
        gachaId: selGacha[0]._id,
        draw: selGacha[1],
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Gacha Draw Success.");
          getGacha();
          setObtains(res.data.prizes);
          showCards();
          updateUserData();
        } else {
          showToast(res.data.msg, "error");
        }
      })
      .catch((err) => console.log(err));
  };

  const showCards = () => {
    setShowCardFlag(true);
  };

  const handleSetfilter = (filterItem) => {
    if (filter.includes(filterItem)) {
      const newFilter = filter.filter((item) => item !== filterItem);
      setFilter(newFilter);
    } else setFilter([...filter, filterItem]);
  };

  return (
    <>
      <div className="w-full md:w-[70%] md:mx-2 mt-16 mx-auto p-2">
        <div className="float-right mt-4">
          <ChangeLanguage />
        </div>
        <div className="mx-auto mt-20">
          <ImageCarousel items={carouselItems} />
        </div>

        <div className="w-full flex justify-between overflow-auto my-3 text-red-800 shadow-md shadow-gray-200">
          <button
            className={`p-3 text-xl break-keep whitespace-nowrap font-bold border-b-red-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-900 ${
              categoryFilter === "all"
                ? "bg-gray-100 text-red-900 border-b-4"
                : ""
            } `}
            onClick={() => setCategoryFilter("all")}
          >
            {t("All")}
          </button>
          {category != null
            ? category.map((data, i) => (
                <button
                  key={i}
                  id={data.id}
                  className={`p-3 text-xl break-keep whitespace-nowrap font-bold border-b-red-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-900 ${
                    categoryFilter === data.name
                      ? "bg-gray-100 text-red-900 border-b-4"
                      : ""
                  } `}
                  onClick={() => setCategoryFilter(data.name)}
                >
                  {data.name}
                </button>
              ))
            : null}{" "}
        </div>
        <div className="w-full flex justify-start items-center overflow-auto my-1">
          <div
            className={`p-2 px-4 rounded-full bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-white mr-1 cursor-pointer ${
              filter.includes("all") ? "bg-red-600 text-white " : ""
            }`}
            onClick={() => handleSetfilter("all")}
          >
            All
          </div>
          <div
            className={`p-2 px-4 rounded-full bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-white mr-1 cursor-pointer ${
              filter.includes("round_number_prize")
                ? "bg-red-600 text-white "
                : ""
            }`}
            onClick={() => handleSetfilter("round_number_prize")}
          >
            Round Number Prize
          </div>
          <div
            className={`p-2 px-4 rounded-full bg-gray-200 hover:bg-red-600 text-gray-700 hover:text-white mr-1 cursor-pointer ${
              filter.includes("last_prize") ? "bg-red-600 text-white " : ""
            }`}
            onClick={() => handleSetfilter("last_prize")}
          >
            Last One Prize
          </div>
        </div>
        <hr className="w-full text-theme_text_color my-2 text-3xl"></hr>

        <div className="w-full flex flex-wrap justify-between">
          {filteredGacha === null ||
          filteredGacha === undefined ||
          filteredGacha.length === 0 ? (
            <div className="text-center mx-auto text-lg">{t("nogacha")}</div>
          ) : (
            filteredGacha.map((data, i) => (
              <div className="w-full xxsm:w-1/2 p-2" key={i}>
                <div className="p-2 h-full flex flex-col justify-between border-2 bg-gray-100 hover:bg-white rounded-lg shadow-md shadow-gray-400 border-gray-300 hover:scale-[101%] outline-2 hover:outline-pink-500">
                  <button
                    className="relative cursor-pointer h-[inherit] w-full"
                    onClick={() =>
                      navigate("/user/gacha-detail", {
                        state: {
                          gachaId: data._id,
                          progress:
                            ((data.remain_prizes.length +
                              (data.last_prize ? 1 : 0)) /
                              data.total_number) *
                            100,
                        },
                      })
                    }
                  >
                    <img
                      src={
                        process.env.REACT_APP_SERVER_ADDRESS +
                        data.gacha_thumnail_url
                      }
                      className="border-b-2 border-white rounded h-[inherit] w-full"
                      alt=""
                    ></img>
                    <div className="w-full bg-gray-300">
                      <div className="w-4/6 flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 bottom-3 text-center">
                        <GachaPriceLabel price={data.price} />
                        <Progressbar
                          progress={
                            ((data.remain_prizes.length +
                              (data.last_prize ? 1 : 0)) /
                              data.total_number) *
                            100
                          }
                          label={
                            data.remain_prizes.length +
                            (data.last_prize ? 1 : 0) +
                            " / " +
                            data.total_number
                          }
                          height={20}
                        />
                      </div>
                    </div>
                  </button>
                  <div className="w-full flex justify-center">
                    <div
                      className="bg-theme_color cursor-pointer hover:bg-[#f00] text-white text-center py-3 px-2 border-r-[1px] border-t-2 border-white rounded-bl-lg m-0 xs:px-4 w-1/2"
                      onClick={() => {
                        // openModal();
                        // setSelGacha([data, 1]);
                        drawGacha(data, 1);
                      }}
                    >
                      1 {t("draw")}
                    </div>
                    <div
                      className="bg-theme_color cursor-pointer hover:bg-[#f00] text-white text-center py-3 px-2 rounded-br-lg border-t-2 border-white m-0 xs:px-4 w-1/2"
                      onClick={() => {
                        // openModal();
                        // setSelGacha([data, 10]);
                        drawGacha(data, 10);
                      }}
                    >
                      10 {t("draws")}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {selGacha?.length > 0 ? (
          <GachaModal
            headerText="Draw Gacha"
            name={selGacha[0].name}
            price={selGacha[0].price}
            draws={selGacha[1]}
            onDraw={submitDrawGacha}
            isOpen={isOpenGachaModal}
            setIsOpen={setIsOpenGachaModal}
          />
        ) : null}

        <NotEnoughPoints
          headerText="Not enough points"
          bodyText="Points are required to play the gacha. Points can be recharged on the point purchase page."
          okBtnClick={() => navigate("/user/pur-point")}
          isOpen={isOpenPointModal}
          setIsOpen={setIsOpenPointModal}
        />
      </div>

      <div
        className={`z-[10] bg-gray-800 py-4 px-3 w-full h-full bg-opacity-50 fixed top-0 left-0 ${
          showCardFlag ? "" : "hidden"
        } `}
      >
        <div className="fixed top-20 right-10 text-gray-200 text-3xl">
          <i
            className="fa fa-close cursor-pointer"
            onClick={() => setShowCardFlag(false)}
          ></i>
        </div>
        <div className="flex flex-wrap justify-center items-center mt-32">
          {obtains?.length > 0 ? (
            obtains.map((prize, i) => (
              <div
                key={prize._id}
                className="mt-5 mr-3 bg-white rounded-lg animate-[animatezoom_1s_ease-in-out]"
              >
                <PrizeCard
                  key={prize._id}
                  name={prize.name}
                  rarity={prize.rarity}
                  cashback={prize.cashback}
                  img_url={prize.img_url}
                />
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg animate-[animatezoom_1s_ease-in-out] delay-1000 m-auto">
              <PrizeCard
                name={obtains?.name}
                rarity={obtains?.rarity}
                cashback={obtains?.cashback}
                img_url={obtains?.img_url}
              />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Index;
