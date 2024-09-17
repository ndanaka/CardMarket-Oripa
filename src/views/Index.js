import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useAtom } from "jotai";

import { UserAtom } from "../store/user";
import api from "../utils/api";

import { setAuthToken } from "../utils/setHeader";
import { showToast } from "../utils/toastUtil";

import GachaModal from "../components/Modals/GachaModal";
import PrizeCard from "../components/Others/PrizeCard";
import Progressbar from "../components/Others/progressbar";
import GachaPriceLabel from "../components/Others/GachaPriceLabel";
import ChangeLanguage from "../components/Others/ChangeLanguage";
import ImageCarousel from "../components/Others/ImageCarousel";

const Index = () => {
  const [category, setCategory] = useState(null); //category list
  const [gacha, setGacha] = useState(null); //gacah list
  const [filteredGacha, setFilteredGacha] = useState();
  const [categoryFilter, setCategoryFilter] = useState("all"); //gacha filter
  const [filter, setFilter] = useState([]);
  const [isOpen, setIsOpen] = useState(false); //gacha confirm modal show flag
  const [selGacha, setSelGacha] = useState([0, 0]); //variable that determine which gacha and which draw
  const [obtains, setObtains] = useState(null); //obtained prize through gacha draw
  const [showCardFlag, setShowCardFlag] = useState(); //showflag for obtained prize
  const [user, setUser] = useAtom(UserAtom);
  const { t, i18n } = useTranslation();

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
        if (res.data.status === 1) setGacha(res.data.gachaList);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const updateUserData = () => {
    setAuthToken();
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
  };

  //handle gacha draw
  const handleDraw = () => {
    setAuthToken();
    setIsOpen(false);

    api
      .post("/admin/gacha/draw_gacha", {
        gachaId: gacha[selGacha[0]]._id,
        draw: selGacha[1],
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Gacha Draw Success.");
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

  const openModal = () => {
    setIsOpen(true);
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
        {/* display categoy */}
        <div className="w-full flex justify-start overflow-auto my-3 text-red-800 shadow-md shadow-gray-200">
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

        {/* display gacha  with filter */}
        <div className="w-full flex flex-wrap justify-between">
          {filteredGacha != null
            ? filteredGacha.map((data, i) => (
                <div className="w-full xxsm:w-1/2 mb-2 ">
                  <div className="flex flex-col justify-center p-2 mr-2 border-2 bg-gray-100 hover:bg-white rounded-lg shadow-md shadow-gray-400 border-gray-300 hover:scale-[101%] outline-2 hover:outline-pink-500">
                    <button
                      className="relative cursor-pointer"
                      onClick={() =>
                        navigate("/user/gacha-detail", {
                          state: { gachaId: data._id },
                        })
                      }
                    >
                      <img
                        src={
                          process.env.REACT_APP_SERVER_ADDRESS +
                          data.gacha_thumnail_url
                        }
                        className="w-full m-auto border-b-2 border-white"
                      ></img>
                      {/* prize remain display progressbar */}
                      <div className="w-full bg-gray-300">
                        <div className="w-4/6 flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 bottom-3 text-center">
                          <GachaPriceLabel price={data.price} />
                          <Progressbar
                            progress={
                              (data.remain_prizes.length / data.total_number) *
                              100
                            }
                            label={
                              data.remain_prizes.length +
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
                          openModal();
                          setSelGacha([i, 1]);
                        }}
                      >
                        1 {t("draw")}
                      </div>
                      <div
                        className="bg-theme_color cursor-pointer hover:bg-[#f00] text-white text-center py-3 px-2 rounded-br-lg border-t-2 border-white m-0 xs:px-4 w-1/2"
                        onClick={() => {
                          openModal();
                          setSelGacha([i, 10]);
                        }}
                      >
                        10 {t("draws")}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            : ""}
        </div>

        {/* gacha confirm modal */}
        {gacha?.length > 0 ? (
          <GachaModal
            headerText="Draw Gacha"
            name={gacha[selGacha[0]].name}
            price={gacha[selGacha[0]].price}
            draws={selGacha[1]}
            onDraw={handleDraw}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
          />
        ) : null}
      </div>

      {/* display prize after drawing gacha */}
      <div
        className={`bg-gray-800 py-4 px-3 w-full h-full bg-opacity-50 fixed top-0 left-0 ${
          showCardFlag ? "" : "hidden"
        } `}
      >
        <div className="fixed top-20 right-10 text-gray-200 text-3xl">
          <i className="fa fa-close" onClick={() => setShowCardFlag(false)}></i>
        </div>
        <div className="flex justify-evenly items-center mt-32">
          {obtains?.length > 0 ? (
            obtains.map((prize, i) => (
              <div className="mt-5 mr-3 bg-white rounded-lg animate-[animatezoom_1s_ease-in-out]">
                <PrizeCard
                  key={i}
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
