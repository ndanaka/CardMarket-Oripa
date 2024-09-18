import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Papa from "papaparse";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import formatDate from "../../utils/formatDate";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import GetUser from "../../utils/getUserAtom";

import PrizeList from "../../components/Tables/PrizeList";
import PrizeCard from "../../components/Others/PrizeCard";

const GachaEdit = () => {
  const [gacha, setGacha] = useState(); //selected gacha
  const [prizes, setPrizes] = useState([]); //prizes from csv file
  const [firstPrizes, setFirstprizes] = useState([]); //prizes from csv file
  const [secondPrizes, setSecondprizes] = useState([]); //prizes from csv file
  const [thirdPrizes, setThirdprizes] = useState([]); //prizes from csv file
  const [fourthPrizes, setFourthprizes] = useState([]); //prizes from csv file
  const [loadFlag, setLoadFlag] = useState(false); //flag fro loading registered prize
  const [isLastPrize, setIsLastPrize] = useState(false); //flag for setting prize as lastPrize
  const [trigger, setTrigger] = useState(false);
  const { user } = GetUser();
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { gachaId } = location.state || {};

  useEffect(() => {
    setAuthToken();
    getGacha();
  }, []);

  //get Gacha by id
  const getGacha = () => {
    api
      .get(`/admin/gacha/${gachaId}`)
      .then((res) => {
        setGradePrizes(res.data.gacha[0].remain_prizes);
        setGacha(res.data.gacha[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  // divide remain prizes by grade
  const setGradePrizes = (remainPrizes) => {
    let firstPrizes = [];
    let secondPrizes = [];
    let thirdPrizes = [];
    let fourthPrizes = [];

    remainPrizes.map((remainPrize) => {
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

  // drawing prizes by grade
  const drawGradePrizes = (prizes, grade) => {
    return (
      <div>
        <div className="my-3 text-lg text-center font-bold">{t(grade)}</div>
        <div className="flex flex-wrap justify-evenly items-stretch">
          {prizes.map((prize, i) => (
            <div className="group relative m-2" key={i}>
              <PrizeCard
                key={i}
                name={prize?.name}
                rarity={prize?.rarity}
                cashback={prize?.cashback}
                img_url={prize?.img_url}
              />
              <div className="absolute top-0 w-full h-full bg-gray-200 opacity-0 hover:opacity-10"></div>
              <button
                className="absolute top-0 right-0 rounded-bl-[100%] rounded-tr-lg w-8 h-8 hidden group-hover:block text-center bg-red-500 z-10 opacity-80 hover:opacity-100"
                onClick={() => unsetPrize(false, grade, i)}
              >
                <i className="fa fa-close text-gray-200 middle"></i>
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  //handle loading data from csv file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          results.data.pop();
          setPrizes(results.data); // Store the parsed data in state
        },
        header: true, // Set to true if your CSV has headers
      });
    }
  };

  //upload bulk prizes from csv file
  const uploadPrize = () => {
    if (user.authority.gacha !== 2 && user.authority.gacha !== 4) {
      showToast("You have no permission for this action", "error");
      return;
    }

    setAuthToken();

    if (gachaId.trim() === "") {
      showToast("Not Found Gacha", "error");
    } else if (prizes.length === 0) {
      showToast("Must choose csv file", "error");
    } else {
      api
        .post("/admin/gacha/upload_bulk", {
          gachaId: gachaId,
          prizes: prizes,
        })
        .then((res) => {
          if (res.data.status === 1) {
            showToast(res.data.msg);
            getGacha();
          } else {
            showToast(res.data.msg, "error");
          }
        })
        .catch((err) => console.log(err));
    }
  };

  //unset registered prizes from gacha
  const unsetPrize = (last, grade, index) => {
    if (user.authority.gacha !== 3 && user.authority.gacha !== 4) {
      showToast("You have no permission for this action", "error");
      return;
    }

    let prizeId = "";
    if (last) {
      prizeId = gacha.last_prize._id;
    } else {
      switch (grade) {
        case "first":
          prizeId = firstPrizes[index]._id;
          break;
        case "second":
          prizeId = secondPrizes[index]._id;
          break;
        case "third":
          prizeId = thirdPrizes[index]._id;
          break;
        case "fourth":
          prizeId = fourthPrizes[index]._id;
          break;

        default:
          break;
      }
    }

    api
      .post("/admin/gacha/unset_prize/", {
        gachaId: gachaId,
        prizeId: prizeId,
        last: last, // if i is -1, handle unset last prize
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Unseting Prize Success.");
          getGacha();
          setTrigger(!trigger);
        } else {
          showToast(res.data.msg, "error");
        }
      });
  };

  //set prize from registerd prizes by manualy
  const setprizes = (id) => {
    if (user.authority.gacha !== 2 && user.authority.gacha !== 4) {
      showToast("You have no permission for this action", "error");
      return;
    }
    api
      .post("/admin/gacha/set_prize", {
        isLastPrize: isLastPrize,
        gachaId: gachaId,
        prizeId: id,
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast("setPrize success.");
          setTrigger(!trigger);
          getGacha();
        } else {
          showToast("setPrize failed.");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="p-3 w-full h-full md:w-[70%] m-auto">
      <div className="text-xl text-center text-slate-600">
        <i
          className="fa fa-chevron-left float-left"
          onClick={() => navigate("/admin/gacha")}
        ></i>
        <span className="my-3 text-xl text-center font-bold">
          {t("gacha") + " " + t("detail")}
        </span>
      </div>
      <hr className="w-5/6 my-2 text-sm mx-auto"></hr>

      {/* Gacha display table */}
      <div className="mx-auto mt-3 overflow-auto">
        <table className="border-[1px] m-auto">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <th>{t("no")}</th>
            <th>{t("image")}</th>
            <th>{t("name")}</th>
            <th>{t("price")}</th>
            <th>{t("total") + " " + t("number")}</th>
            <th>{t("category")}</th>
            <th>{t("created") + " " + t("date")}</th>
          </thead>
          <tbody>
            {gacha ? (
              <tr key={gacha._id} className="border-2">
                <td></td>
                <td>
                  <img
                    src={
                      process.env.REACT_APP_SERVER_ADDRESS +
                      gacha.gacha_thumnail_url
                    }
                    alt="gacha thumnail"
                    width="100px"
                    height="100px"
                    className="m-auto"
                  ></img>
                </td>
                <td>{gacha?.name}</td>
                <td>{gacha?.price}</td>
                <td>{gacha?.total_number}</td>
                <td>{gacha?.category}</td>
                <td>{formatDate(gacha?.create_date)}</td>
              </tr>
            ) : (
              <tr>
                <td colSpan="6">{t("nogacha")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <hr className="my-2"></hr>

      {/* Gacha Prizes */}
      <div>
        {gacha?.remain_prizes?.length > 0 ? (
          <div>
            {firstPrizes?.length > 0
              ? drawGradePrizes(firstPrizes, "first")
              : ""}
            {secondPrizes?.length > 0
              ? drawGradePrizes(secondPrizes, "second")
              : ""}
            {thirdPrizes?.length > 0
              ? drawGradePrizes(thirdPrizes, "third")
              : ""}
            {fourthPrizes?.length > 0
              ? drawGradePrizes(fourthPrizes, "fourth")
              : ""}
          </div>
        ) : (
          <div className="py-2">{t("noprize")}</div>
        )}

        {/* last prize */}
        {gacha?.last_prize ? (
          <div>
            <div className="my-2 text-lg text-center font-bold">
              {t("last") + " " + t("prize")}
            </div>
            <div className="group relative mt-2 mr-1">
              <PrizeCard
                name={gacha.last_prize?.name}
                rarity={gacha.last_prize?.rarity}
                cashback={gacha.last_prize?.cashback}
                img_url={gacha.last_prize?.img_url}
              />
              <div className="absolute top-0 w-full h-full bg-gray-100 opacity-0 hover:opacity-10"></div>
              <button
                className="absolute top-0 right-0 rounded-bl-[100%] rounded-tr-lg w-8 h-8 hidden group-hover:block text-center bg-red-500 z-10 opacity-80 hover:opacity-100"
                onClick={() => unsetPrize(true)}
              >
                <i className="fa fa-close text-gray-200 middle"></i>
              </button>
            </div>
          </div>
        ) : (
          ""
        )}
      </div>

      {/* setting prize to gacha */}
      <div className="mx-auto w-full mt-3">
        <hr className="my-2 text-sm"></hr>
        <div className="my-2 text-lg text-center font-bold">{t("set_CSV")}</div>
        <div className="flex flex-wrap justify-between items-center w-5/6 mt-2">
          <a
            className="button-38 my-1"
            href={
              process.env.REACT_APP_SERVER_ADDRESS + `/template/template.csv`
            }
            download
          >
            template.csv
            <i className="fa fa-download ml-1"></i>
          </a>
          <input
            type="file"
            accept=".csv"
            className="my-1"
            onChange={handleFileChange}
          />
          <button
            className={`button-22 my-1 ${prizes ? "" : "disable"}`}
            onClick={uploadPrize}
          >
            {t("upload") + " " + t("all") + " " + t("prize")}
          </button>
        </div>
        <div className="overflow-auto">
          <table className="border-[1px]  mx-auto mt-2 w-full">
            <thead className="bg-admin_theme_color font-bold text-gray-200">
              <tr>
                <th>{t("no")}</th>
                <th>{t("name")}</th>
                <th>{t("rarity")}</th>
                <th>{t("cashback") + " " + t("point")}</th>
                <th>{t("Grade")}</th>
                <th>{t("image")}</th>
              </tr>
            </thead>
            <tbody>
              {prizes ? (
                prizes.map((data, i) => (
                  <tr key={i} className="border-2">
                    <td>{i + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.rarity}</td>
                    <td>{data.cashback}</td>
                    <td>
                      {(() => {
                        switch (parseInt(data.grade)) {
                          case 1:
                            return t("first");
                          case 2:
                            return t("second");
                          case 3:
                            return t("third");
                          case 4:
                            return t("foruth");
                          default:
                            break;
                        }
                      })()}
                    </td>
                    <td>
                      <img
                        width="100"
                        height="200"
                        src={
                          process.env.REACT_APP_SERVER_ADDRESS + data.img_url
                        }
                        alt="prize"
                        className="m-auto"
                      ></img>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6">{t("noprize")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-3 overflow-auto">
        <hr className="w-full text-theme_text_color my-1"></hr>
        <div className="my-2 text-lg text-center font-bold">
          {t("set_registered_prize")}
        </div>
        <div className="flex justify-between items-end mx-auto my-2">
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
            }}
          >
            {t("load_prizes")}
          </button>
          <div className="form-check form-check-inline">
            <label className="form-check-label">
              <input
                className="form-check-input"
                type="checkbox"
                checked={isLastPrize}
                onChange={() => setIsLastPrize((prev) => !prev)}
              />
              {t("set_as_lastPrize")}
            </label>
          </div>
        </div>
        {loadFlag ? (
          <PrizeList trigger={trigger} selprizes={setprizes} role="setPrize" />
        ) : null}
      </div>
    </div>
  );
};

export default GachaEdit;
