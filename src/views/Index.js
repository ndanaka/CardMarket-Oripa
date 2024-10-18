import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../utils/api";
import { setAuthToken } from "../utils/setHeader";
import { showToast } from "../utils/toastUtil";
import useAffiliateID from "../utils/useAffiliateID";

import GachaModal from "../components/Modals/GachaModal";
import PrizeCard from "../components/Others/PrizeCard";
import Progressbar from "../components/Others/progressbar";
import GachaPriceLabel from "../components/Others/GachaPriceLabel";
import ImageCarousel from "../components/Others/ImageCarousel";
import NotEnoughPoints from "../components/Modals/NotEnoughPoints";

import usePersistedUser from "../store/usePersistedUser";

const Index = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const defaultCategory = [
    "last_prize",
    "extra_prize",
    "appraised_item",
    "once_per_day",
  ];
  const [category, setCategory] = useState(null); //category list
  const [subCategory, setSubCategory] = useState(defaultCategory);
  const [gacha, setGacha] = useState(null); //gacah list
  const [filteredGacha, setFilteredGacha] = useState();
  const [categoryFilter, setCategoryFilter] = useState("all"); //gacha filter
  const [filter, setFilter] = useState(["all"]);
  const [order, setOrder] = useState("newest");
  const [isOpenPointModal, setIsOpenPointModal] = useState(false); //gacha confirm modal show flag
  const [isOpenGachaModal, setIsOpenGachaModal] = useState(false); //gacha confirm modal show flag
  const [selGacha, setSelGacha] = useState([0, 0]); //variable that determine which gacha and which draw
  const [popedPrizes, setPopedPrizes] = useState(null); //obtained prize through gacha draw
  const [showCardFlag, setShowCardFlag] = useState(); //showflag for obtained prize
  const [user, setUser] = usePersistedUser();
  const [existLastFlag, setExistLastFlag] = useState(false);
  const [lastEffect, setLastEffect] = useState(false);
  const lang = i18n.language;
  const [bgColor, setBgColor] = useState(localStorage.getItem("bgColor"));

  const carouselItems = [
    { id: 1, imgUrl: "theme/carousel/rank_banner.png" },
    { id: 2, imgUrl: "theme/carousel/point.png" },
    { id: 2, imgUrl: "theme/carousel/001.png" },
    { id: 2, imgUrl: "theme/carousel/002.png" },
  ];

  // check the URL parameters on page load to see if the affiliate ID is present.
  const handleAffiliateID = (affiliateID) => {};
  useAffiliateID(handleAffiliateID);

  useEffect(() => {
    getCategory();
    getGacha();
    getThemeData();
  }, [showCardFlag]);

  useEffect(() => {
    // Get gachas by main category
    let filteredGachas = gacha?.filter(
      (gacha) =>
        gacha.isRelease === true &&
        (categoryFilter === "all" ? true : gacha.category === categoryFilter)
    );

    // Get gachas by sub category
    if (!filter.includes("all")) {
      // get gachas has 'last_prize'
      if (filter.includes("last_prize")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) => gacha.last_prize !== undefined && gacha.last_prize !== null
        );
      }

      // get gachas has 'round_number_prize'
      if (filter.includes("round_number_prize")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.rounded_number_prize !== undefined &&
            gacha.rounded_number_prize !== null
        );
      }

      // get gachas has 'extra_prize'
      if (filter.includes("extra_prize")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.extra_prize !== undefined && gacha.extra_prize !== null
        );
      }

      // get gachas has 'appraised_item'
      if (filter.includes("appraised_item")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.appraised_item !== undefined && gacha.appraised_item !== null
        );
      }

      // get gachas has 'once_per_day'
      if (filter.includes("once_per_day")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.once_per_day !== undefined && gacha.once_per_day !== null
        );
      }
    }

    // Get gachas by order
    switch (order) {
      case "recommended":
        filteredGachas?.sort(() => Math.random() - 0.5);
        break;
      case "newest":
        filteredGachas?.sort(
          (a, b) => new Date(b.create_date) - new Date(a.create_date)
        );
        break;
      case "popularity":
        filteredGachas?.sort(
          (a, b) =>
            Number(b.poped_prizes.length) - Number(a.poped_prizes.length)
        );
        break;
      case "highToLowPrice":
        filteredGachas?.sort((a, b) => Number(b.price) - Number(a.price));
        break;
      case "lowToHighPrice":
        filteredGachas?.sort((a, b) => Number(a.price) - Number(b.price));
        break;

      default:
        break;
    }

    // Set the final filtered array
    setFilteredGacha(filteredGachas);
  }, [gacha, categoryFilter, filter, order]);

  const getThemeData = async () => {
    const res = await api.get("/admin/getThemeData");
    if (res.data.status === 1) {
      setBgColor(res.data.theme.bgColor);
      localStorage.setItem("bgColor", JSON.stringify(res.data.theme.bgColor));
    }
  };

  // get main categories
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

  // get all gachas
  const getGacha = () => {
    api
      .get("/admin/gacha")
      .then((res) => {
        if (res.data.status === 1) {
          setGacha(res.data.gachaList);
          setFilteredGacha(res.data.gachaList);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // update user data and update localstorage
  const updateUserData = async () => {
    setAuthToken();

    if (user) {
      // update user date
      const res = await api.get(`/user/get_user/${user._id}`);
      if (res.data.status === 1) {
        setUser(res.data.user);
      }
    }
  };

  // change gacha by sub order
  const changeMainCat = (cat) => {
    getGacha();
    setCategoryFilter(cat);
  };

  // change gacha by sub category
  const changeSubCat = (selSubGat) => {
    getGacha();

    // Make selected categories array
    let selSubCats;
    if (selSubGat === "all") {
      // If "all" is selected, reset the filter to contain only "all"
      selSubCats = ["all"];
    } else {
      if (filter.includes(selSubGat)) {
        // If the filter already includes the item, remove it
        selSubCats = filter.filter(
          (item) => item !== selSubGat && item !== "all"
        );

        // If the filter becomes empty, reset it to contain "all"
        if (selSubCats.length === 0) {
          selSubCats = ["all"];
        }
      } else {
        // If the filter does not include the item, add it and remove "all" if present
        selSubCats = filter.filter((item) => item !== "all");
        selSubCats = [...selSubCats, selSubGat];
      }
    }

    // Ordering selected categories by selecting
    if (!selSubCats.includes("all")) {
      if (filter.includes(selSubGat)) {
        const restCategories = defaultCategory.filter(
          (item) => !selSubCats.includes(item)
        );
        // Add those values to the filter array
        const updatedFilter = [...selSubCats, ...restCategories];
        setSubCategory(updatedFilter);
      } else {
        // Find values from subCategory that are not in the filter array
        const restCategories = subCategory.filter(
          (item) => !selSubCats.includes(item)
        );
        // Add those values to the filter array
        const updatedFilter = [...selSubCats, ...restCategories];
        setSubCategory(updatedFilter);
      }
    } else {
      setSubCategory(defaultCategory);
    }

    // Set the final selSubCats array in one go
    setFilter(selSubCats);
  };

  // change gacha by sub order
  const changeOrder = (e) => {
    getGacha();
    setOrder(e.currentTarget.value);
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

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] md:mx-2 mt-16 mx-auto xm:p-2">
        <div className="mx-auto p-1">
          <ImageCarousel items={carouselItems} />
        </div>
        <div className="w-full flex justify-between overflow-auto px-3 mt-[-40px] text-red-800 shadow-md shadow-gray-200">
          <button
            className={`p-2 text-[18px] break-keep whitespace-nowrap font-bold border-b-red-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-900 ${
              categoryFilter === "all" ? "bg-gray-100 border-t-4" : ""
            } `}
            style={{
              color: categoryFilter === "all" ? bgColor : "gray", // Set text color based on condition
              borderColor: categoryFilter === "all" ? bgColor : "transparent",
            }}
            onClick={() => changeMainCat("all")}
          >
            {t("all")}
          </button>
          {category != null
            ? category.map((data, i) => (
                <button
                  key={i}
                  id={data.id}
                  className={`p-2 text-[18px] break-keep whitespace-nowrap font-bold border-b-red-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-900 ${
                    categoryFilter === data.name ? "bg-gray-100 border-t-4" : ""
                  } `}
                  style={{
                    color: categoryFilter === data.name ? bgColor : "gray", // Set text color based on condition
                    borderColor:
                      categoryFilter === data.name ? bgColor : "transparent",
                  }}
                  onClick={() => changeMainCat(data.name)}
                >
                  {data.name}
                </button>
              ))
            : null}{" "}
        </div>
        <div className="flex flex-wrap justify-between px-2">
          <div
            className={`${
              lang === "en" ? "w-[calc(99%-172px)]" : "w-[calc(99%-112px)]"
            } flex justify-start items-center overflow-auto px-2 pt-2`}
          >
            <div
              className={`p-2 px-3 rounded-full min-w-fit text-gray-700 hover:text-white text-sm font-bold mr-1 cursor-pointer ${
                filter.includes("all") ? "text-white" : ""
              }`}
              style={{
                backgroundColor: filter.includes("all")
                  ? bgColor
                  : "#e2e8f0",
              }} // Set bgColor if 'all' is included
              onClick={() => changeSubCat("all")}
            >
              {t("all")}
            </div>
            {subCategory.map((category, i) => (
              <div
                key={i}
                className={`p-2 px-3 rounded-full min-w-fit text-gray-700 hover:text-white text-sm font-bold mr-1 cursor-pointer ${
                  filter.includes(category) ? "text-white" : ""
                }`}
                style={{
                  backgroundColor: filter.includes(category)
                    ? bgColor
                    : "#e2e8f0",
                }}
                onClick={() => changeSubCat(category)}
              >
                {t(category)}
              </div>
            ))}
          </div>
          <div
            className={`${
              lang === "en" ? "w-[172px]" : "w-[112px]"
            } flex justify-end items-center p-1 border-l-2 border-gray-[#e5e7eb]`}
          >
            <select
              className="w-auto border-transparent bg-transparent cursor-pointer focus:outline-none focus:border-none"
              name="changeOrder"
              id="changeOrder"
              autoComplete="changeOrder"
              onChange={(e) => changeOrder(e)}
              value={order}
            >
              <option value="newest">{t("newest")}</option>
              <option value="popularity">{t("popularity")}</option>
              <option value="recommended">{t("recommended")}</option>
              <option value="highToLowPrice">{t("highToLowPrice")}</option>
              <option value="lowToHighPrice">{t("lowToHighPrice")}</option>
            </select>
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-between xm:px-3">
          {filteredGacha === null ||
          filteredGacha === undefined ||
          filteredGacha.length === 0 ? (
            <div className="text-center mx-auto text-lg mt-4">
              {t("nogacha")}
            </div>
          ) : (
            filteredGacha.map((data, i) => (
              <div className="w-full xxsm:w-1/2 xm:p-2 p-1" key={i}>
                <div className="p-2 h-full flex flex-col justify-between border-2 hover:bg-white rounded-lg shadow-md shadow-gray-400 border-gray-300 hover:scale-[101%] outline-2 hover:outline-pink-500">
                  <button
                    className="relative cursor-pointer h-[450px] w-full"
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
                      className="rounded-t h-[410px] w-full object-cover"
                      alt=""
                    />
                    <div className="w-full h-[50px]">
                      <div className="w-4/6 flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 bottom-0 text-center">
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
                      className="cursor-pointer hover:bg-[#f00] text-white text-center py-3 px-2 border-r-[1px] border-t-2 border-white rounded-bl-lg m-0 xs:px-4 w-1/2"
                      style={{ backgroundColor: bgColor }}
                      onClick={() => {
                        drawGacha(data, 1);
                      }}
                    >
                      1 {t("draw")}
                    </div>
                    <div
                      className="bg-theme_color cursor-pointer hover:bg-gray-200 text-white text-center py-3 px-2 rounded-br-lg border-t-2 border-white m-0 xs:px-4 w-1/2"
                      onClick={() => {
                        drawGacha(data, 10);
                      }}
                      style={{ backgroundColor: bgColor }}
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
    </div>
  );
};

export default Index;
