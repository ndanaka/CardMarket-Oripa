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
import ImageCarousel from "../components/Others/ImageCarousel";
import NotEnoughPoints from "../components/Modals/NotEnoughPoints";

import usePersistedUser from "../store/usePersistedUser";

const Index = () => {
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
    updateUserData();
    getCategory();
    getGacha();
  }, [gacha]);

  useEffect(() => {
    // Filter by main-category
    let filteredGachas = gacha?.filter(
      (gacha) =>
        gacha.isRelease === true &&
        (categoryFilter === "all" ? true : gacha.category === categoryFilter)
    );

    // Filter by sub-category
    if (!filter.includes("all")) {
      // Apply sub-category filter based on 'last_prize'
      if (filter.includes("last_prize")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) => gacha.last_prize !== undefined && gacha.last_prize !== null
        );
      }

      if (filter.includes("round_number_prize")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.rounded_number_prize !== undefined &&
            gacha.rounded_number_prize !== null
        );
      }

      if (filter.includes("extra_prize")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.extra_prize !== undefined && gacha.extra_prize !== null
        );
      }

      if (filter.includes("appraised_item")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.appraised_item !== undefined && gacha.appraised_item !== null
        );
      }

      if (filter.includes("once_per_day")) {
        filteredGachas = filteredGachas?.filter(
          (gacha) =>
            gacha.once_per_day !== undefined && gacha.once_per_day !== null
        );
      }
    }

    // Sort the filtered gachas by created_date in descending order
    switch (order) {
      case "newest":
        filteredGachas?.sort(
          (a, b) => new Date(b.create_date) - new Date(a.create_date)
        );
        break;
      case "popularity":
        filteredGachas?.sort(
          (a, b) =>
            Number(a.remain_prizes.length) - Number(b.remain_prizes.length)
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
    if (!user) {
      navigate("/auth/login");
    } else {
      const remainPrizes = gacha.remain_prizes.length;
      const totalPoints = gacha.price * num;
      const remainPoints = user.point_remain;

      if (remainPrizes < num) {
        showToast("Not enough prizes.", "error");
      } else if (remainPoints === 0 || remainPoints < totalPoints) {
        setIsOpenPointModal(true);
      } else {
        setSelGacha([gacha, num]);
        setIsOpenGachaModal(true);
      }
    }
  };

  const submitDrawGacha = () => {
    setAuthToken();
    setIsOpenGachaModal(false);

    api
      .post("/admin/gacha/draw_gacha", {
        gachaId: selGacha[0]._id,
        drawCounts: selGacha[1],
        email: user.email,
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast(res.data.msg, "success");
          getGacha();
          setObtains(res.data.prizes);
          showCards();
        } else {
          showToast(res.data.msg, "error");
        }
      })
      .catch((err) => console.log(err));
  };

  const showCards = () => {
    setShowCardFlag(true);
  };

  const handleSetfilter = (selectedCategory) => {
    let selectedCatetories;

    // Make selected categorie
    if (selectedCategory === "all") {
      // If "all" is selected, reset the filter to contain only "all"
      selectedCatetories = ["all"];
    } else {
      if (filter.includes(selectedCategory)) {
        // If the filter already includes the item, remove it
        selectedCatetories = filter.filter(
          (item) => item !== selectedCategory && item !== "all"
        );

        // If the filter becomes empty, reset it to contain "all"
        if (selectedCatetories.length === 0) {
          selectedCatetories = ["all"];
        }
      } else {
        // If the filter does not include the item, add it and remove "all" if present
        selectedCatetories = filter.filter((item) => item !== "all");
        selectedCatetories = [...selectedCatetories, selectedCategory];
      }
    }

    // Ordering selected categories by selecting
    if (!selectedCatetories.includes("all")) {
      if (filter.includes(selectedCategory)) {
        const restCategories = defaultCategory.filter(
          (item) => !selectedCatetories.includes(item)
        );
        // Add those values to the filter array
        const updatedFilter = [...selectedCatetories, ...restCategories];
        setSubCategory(updatedFilter);
      } else {
        // Find values from subCategory that are not in the filter array
        const restCategories = subCategory.filter(
          (item) => !selectedCatetories.includes(item)
        );
        // Add those values to the filter array
        const updatedFilter = [...selectedCatetories, ...restCategories];
        setSubCategory(updatedFilter);
      }
    } else {
      setSubCategory(defaultCategory);
    }

    // Set the final selectedCatetories array in one go
    setFilter(selectedCatetories);
  };

  const changeOrder = (e) => {
    setOrder(e.currentTarget.value);
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-[90%] lg:w-[80%] xl:w-[70%] md:mx-2 mt-16 mx-auto xm:p-2">
        {/* <div className="float-right mt-2">
          <ChangeLanguage />
        </div> */}
        <div className="mx-auto p-1">
          <ImageCarousel items={carouselItems} />
        </div>
        <div className="w-full flex justify-between overflow-auto px-3 mt-[-40px] text-red-800 shadow-md shadow-gray-200">
          <button
            className={`p-2 text-[18px] break-keep whitespace-nowrap font-bold border-b-red-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-900 ${
              categoryFilter === "all"
                ? "bg-gray-100 text-red-900 border-red-400 border-t-4"
                : ""
            } `}
            onClick={() => setCategoryFilter("all")}
          >
            {t("all")}
          </button>
          {category != null
            ? category.map((data, i) => (
                <button
                  key={i}
                  id={data.id}
                  className={`p-2 text-[18px] break-keep whitespace-nowrap font-bold border-b-red-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-900 ${
                    categoryFilter === data.name
                      ? "bg-gray-100 text-red-900 border-red-400 border-t-4"
                      : ""
                  } `}
                  onClick={() => setCategoryFilter(data.name)}
                >
                  {data.name}
                </button>
              ))
            : null}{" "}
        </div>
        <div className="flex flex-wrap justify-between px-2">
          <div className="w-[calc(99%-170px)] flex justify-start items-center overflow-auto px-2 pt-2">
            <div
              className={`p-2 px-3 rounded-full min-w-fit bg-gray-200 focus:bg-red-400 text-gray-700 hover:text-white text-sm font-bold mr-1 cursor-pointer ${
                filter.includes("all") ? "bg-red-600 text-white" : ""
              }`}
              onClick={() => handleSetfilter("all")}
            >
              {t("all")}
            </div>
            {subCategory.map((category, i) => (
              <div
                key={i}
                className={`p-2 px-3 rounded-full min-w-fit bg-gray-200 focus:bg-red-400 text-gray-700 hover:text-white text-sm font-bold mr-1 cursor-pointer ${
                  filter.includes(category) ? "bg-red-600 text-white" : ""
                }`}
                onClick={() => handleSetfilter(category)}
              >
                {t(category)}
              </div>
            ))}
          </div>
          <div className="w-[170px] flex justify-between items-center p-1 border-l-2 border-gray-[#e5e7eb]">
            <select
              className="w-auto border-transparent bg-transparent form-control form-control-sm cursor-pointer"
              name="changeOrder"
              id="changeOrder"
              autoComplete="changeOrder"
              onChange={(e) => changeOrder(e)}
              value={order}
            >
              <option value="newest" className="p-2">
                {t("newest")}
              </option>
              <option value="popularity" className="p-2">
                {t("popularity")}
              </option>
              <option value="highToLowPrice" className="p-2">
                {t("highToLowPrice")}
              </option>
              <option value="lowToHighPrice" className="p-2">
                {t("lowToHighPrice")}
              </option>
            </select>
            <i className="fa fa-arrows-v" />
          </div>
        </div>
        <div className="w-full flex flex-wrap justify-between xm:px-3">
          {filteredGacha === null ||
          filteredGacha === undefined ||
          filteredGacha.length === 0 ? (
            <div className="text-center mx-auto text-lg">{t("nogacha")}</div>
          ) : (
            filteredGacha.map((data, i) => (
              <div className="w-full xxsm:w-1/2 xm:p-2 p-1" key={i}>
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
                      className="border-b-2 border-white rounded h-[400px] w-full object-cover"
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
                        drawGacha(data, 1);
                      }}
                    >
                      1 {t("draw")}
                    </div>
                    <div
                      className="bg-theme_color cursor-pointer hover:bg-[#f00] text-white text-center py-3 px-2 rounded-br-lg border-t-2 border-white m-0 xs:px-4 w-1/2"
                      onClick={() => {
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
                className="rounded-lg animate-[animatezoom_1s_ease-in-out] delay-1000 m-auto"
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
            <div className="rounded-lg animate-[animatezoom_1s_ease-in-out] delay-1000 m-auto">
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
    </div>
  );
};

export default Index;
