import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../utils/api";
import { setAuthToken } from "../utils/setHeader";
import { showToast } from "../utils/toastUtil";
import subCategories from "../utils/subCategories";

import Progressbar from "../components/Others/progressbar";
import GachaPriceLabel from "../components/Others/GachaPriceLabel";
import ImageCarousel from "../components/Others/ImageCarousel";
import NotEnoughPoints from "../components/Modals/NotEnoughPoints";
import SucceedModal from "../components/Modals/SucceedModal";
import Spinner from "../components/Others/Spinner";

import usePersistedUser from "../store/usePersistedUser";
import { bgColorAtom } from "../store/theme";

const Index = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language;
  const navigate = useNavigate();
  const [user, setUser] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const [category, setCategory] = useState(null);
  const [subCategory, setSubCategory] = useState(subCategories);
  const [gacha, setGacha] = useState(null);
  const [filteredGacha, setFilteredGacha] = useState();
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [filter, setFilter] = useState(["all"]);
  const [order, setOrder] = useState("recommended");
  const [isOpenPointModal, setIsOpenPointModal] = useState(false);
  const [isOpenLoggedModal, setIsOpenLoggedModal] = useState(false);
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("loggedIn")) {
      setIsOpenLoggedModal(true);
    }

    getCategory();
    getGacha();
  }, []);

  useEffect(() => {
    // Get gachas by main category
    let filteredGachas = gacha?.filter(
      (gacha) =>
        gacha.isRelease === true &&
        gacha.total_number > 0 &&
        (categoryFilter === "all"
          ? true
          : gacha.category._id === categoryFilter)
    );

    // Get gachas by sub category
    if (filter.includes("lessThan100")) {
      filteredGachas = filteredGachas.filter(
        (item) => item.remain_prizes.length <= 100
      );
    }
    if (filter.includes("last_prize")) {
    }
    if (filter.includes("last_prize")) {
      filteredGachas = filteredGachas.filter((item) =>
        // Array.isArray(item.kind)
        //   ? item.kind.some((kindItem) => kindItem.value === "last_prize")
        //   : item.kind.value === "last_prize"
        item.remain_prizes.some((item) => item.kind === "last_prize")
      );
    }

    // Get gachas by order
    switch (order) {
      case "recommended":
        break;

      case "newest":
        filteredGachas?.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        break;

      case "popularity":
        filteredGachas?.sort(
          (a, b) =>
            Number(b.total_number - b.remain_prizes.length) -
            Number(a.total_number - a.remain_prizes.length)
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
  }, [gacha, filter, categoryFilter, order]);

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
        showToast(err, "error");
      });
  };

  // get all gachas
  const getGacha = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get("/admin/gacha");
      setSpinFlag(false);

      if (res.data.status === 1) {
        setGacha(res.data.gachaList);
        setFilteredGacha(res.data.gachaList);
      } else {
        showToast(t("failedReq"), "error");
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  // change gacha by sub order
  const changeMainCat = (cat) => {
    getGacha();
    setCategoryFilter(cat);
  };

  // change gacha by sub category
  const changeSubCat = (selSubGat) => {
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

    // // Ordering selected categories by selecting
    // if (!selSubCats.includes("all")) {
    //   if (filter.includes(selSubGat)) {
    //     const restCategories = subCategory.filter(
    //       (item) => !selSubCats.includes(item)
    //     );
    //     // Add those values to the filter array
    //     const updatedFilter = [...selSubCats, ...restCategories];
    //     setSubCategory(updatedFilter);
    //   } else {
    //     // Find values from subCategory that are not in the filter array
    //     const restCategories = subCategory.filter(
    //       (item) => !selSubCats.includes(item)
    //     );
    //     // Add those values to the filter array
    //     const updatedFilter = [...selSubCats, ...restCategories];
    //     setSubCategory(updatedFilter);
    //   }
    // } else {
    //   setSubCategory(subCategories);
    // }

    // Set the final selSubCats array in one go
    setFilter(selSubCats);
  };

  // change gacha by sub order
  const changeOrder = (e) => {
    getGacha();
    setOrder(e.currentTarget.value);
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
      gacha.price * (counts === "all" ? gacha.remain_prizes.length : counts);
    const remainPoints = user.point_remain;
    if (remainPoints < totalPoints) {
      setIsOpenPointModal(true);
      return;
    }

    try {
      setAuthToken();

      setSpinFlag(true);
      const res = await api.post("/admin/gacha/draw_gacha", {
        gachaId: gacha._id,
        counts: counts,
        drawDate: new Date(),
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
    <div className="flex flex-grow">
      {spinFlag && <Spinner />}
      <div className="w-full lg:w-[90%] xm:w-[80%] xmd:w-[70%] xl:w-[60%] md:mx-2 mt-16 mx-auto xm:p-2">
        <ImageCarousel />
        <div className="px-2">
          <div className="w-full flex justify-between overflow-auto text-red-800 shadow-md shadow-gray-200 px-2">
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
              ? category.map((data, i) => {
                  let catName;
                  switch (lang) {
                    case "ch1":
                      catName = data.ch1Name;
                      break;
                    case "ch2":
                      catName = data.ch2Name;
                      break;
                    case "vt":
                      catName = data.vtName;
                      break;
                    case "en":
                      catName = data.enName;
                      break;

                    default:
                      catName = data.jpName;
                      break;
                  }

                  return (
                    <button
                      key={i}
                      id={data.id}
                      className={`p-2 text-[18px] break-keep whitespace-nowrap font-bold border-b-red-500 hover:bg-gray-100 focus:bg-gray-100 hover:text-red-900 ${
                        categoryFilter === data._id
                          ? "bg-gray-100 border-t-4"
                          : ""
                      } `}
                      style={{
                        color: categoryFilter === data._id ? bgColor : "gray", // Set text color based on condition
                        borderColor:
                          categoryFilter === data._id ? bgColor : "transparent",
                      }}
                      onClick={() => changeMainCat(data._id)}
                    >
                      {catName}
                    </button>
                  );
                })
              : null}{" "}
          </div>
        </div>
        <div className="flex flex-wrap justify-between px-2">
          <div
            className={`${
              lang !== "jp" ? "w-[calc(99%-180px)]" : "w-[calc(99%-112px)]"
            } flex justify-start items-center overflow-auto px-2 pt-2`}
          >
            <div
              className={`py-2 px-3 rounded-2xl min-w-fit text-gray-700 hover:text-white text-sm font-bold mr-1 cursor-pointer ${
                filter.includes("all") ? "text-white" : ""
              }`}
              style={{
                backgroundColor: filter.includes("all") ? bgColor : "#e2e8f0",
              }}
              onClick={() => changeSubCat("all")}
            >
              {t("all")}
            </div>
            {subCategory.map((category, i) => {
              return (
                <div
                  key={i}
                  className={`p-2 mx-1 rounded-2xl min-w-fit text-gray-700 hover:text-white text-sm font-bold mr-1 cursor-pointer ${
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
              );
            })}
            <div
              className={`py-2 px-3 rounded-2xl min-w-fit text-gray-700 hover:text-white text-sm font-bold mr-1 cursor-pointer ${
                filter.includes("lessThan100") ? "text-white" : ""
              }`}
              style={{
                backgroundColor: filter.includes("lessThan100")
                  ? bgColor
                  : "#e2e8f0",
              }}
              onClick={() => changeSubCat("lessThan100")}
            >
              {t("lessThan100")}
            </div>
          </div>
          <div
            className={`${
              lang !== "jp" ? "w-[180px]" : "w-[112px]"
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
              <option value="recommended">{t("recommended")}</option>
              <option value="newest">{t("newest")}</option>
              <option value="popularity">{t("popularity")}</option>
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
            filteredGacha.map((data, i) => {
              return (
                <div
                  className="w-full xsm:w-[90%] xxsm:w-[70%] md:w-[50%] mx-auto p-2 p-1"
                  key={i}
                >
                  <div className="p-2 flex flex-col justify-between border-2 hover:bg-white rounded-lg shadow-md shadow-gray-400 border-gray-300 hover:scale-[101%] outline-2 hover:outline-pink-500">
                    <button
                      className="relative cursor-pointer w-full"
                      onClick={() => {
                        navigate("/user/gachaDetail", {
                          state: { gachaId: data._id },
                        });
                      }}
                    >
                      <img
                        src={
                          process.env.REACT_APP_SERVER_ADDRESS + data.img_url
                        }
                        alt="img_url"
                        className="rounded-t h-[250px] xsm:h-[300px] xxsm:h-[300px] md:h-[320px] lg:h-[350px] w-full object-cover"
                      />
                      <div className="w-full h-[35px]">
                        <div className="w-4/6 flex flex-col justify-center items-center absolute left-1/2 -translate-x-1/2 bottom-0 text-center">
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
                    <div className="w-full flex flex-wrap justify-center">
                      {data.remain_prizes.length === 0 ? (
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
                              submitDrawGacha(data, 1);
                            }}
                          >
                            {t("drawOne")}
                          </button>
                          {!data.kind.some(
                            (item) => item.value === "once_per_day"
                          ) ? (
                            <>
                              {data.remain_prizes.length >= 10 && (
                                <button
                                  className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-1 py-2.5 border-r-[1px] border-t-2 border-white rounded-lg m-0 xs:px-4 w-[30%]"
                                  onClick={() => {
                                    submitDrawGacha(data, 10);
                                  }}
                                  style={{
                                    backgroundColor: bgColor,
                                  }}
                                >
                                  {t("drawTen")}
                                </button>
                              )}
                              {data.type === 2 &&
                                data.remain_prizes.length !== 1 && (
                                  <button
                                    className="mx-1 cursor-pointer hover:opacity-50 text-white text-center px-1 py-2.5  rounded-lg border-t-2 border-white m-0 xs:px-4 w-[30%]"
                                    onClick={() => {
                                      submitDrawGacha(data, "all");
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
                </div>
              );
            })
          )}
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
      <SucceedModal
        isOpen={isOpenLoggedModal}
        setIsOpen={setIsOpenLoggedModal}
        text={t("successLogin")}
      />
    </div>
  );
};

export default Index;
