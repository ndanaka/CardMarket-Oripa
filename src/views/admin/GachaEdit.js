import { useState, useEffect } from "react";
import Papa from "papaparse";
import api from "../../utils/api";
import formatDate from "../../utils/formatDate";
import { useLocation, useNavigate } from "react-router-dom";
import PrizeList from "../../components/Tables/PrizeList";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";
import PrizeCard from "../../components/Others/PrizeCard";
import GetUser from "../../utils/getUserAtom";
import { useTranslation } from "react-i18next";
const GachaEdit = () => {
  const [gacha, setGacha] = useState(); //selected gacha
  const [prizes, setPrizes] = useState([]); //prizes from csv file
  const [loadFlag, setLoadFlag] = useState(false); //flag fro loading registered prize
  const [isLastPrize, setIsLastPrize] = useState(false); //flag for setting prize as lastPrize
  const [trigger, setTrigger] = useState(false);
  const {user} = GetUser();
  const {t} = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();
  const { gachaId } = location.state || {};
  console.log("gacha ", gacha);
  useEffect(() => {
    setAuthToken();
    getGacha();
  }, []);

  //get Gacha by id
  const getGacha = () => {
    api
      .get(`/admin/gacha/${gachaId}`)
      .then((res) => {
        setGacha(res.data.gacha[0]);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  //handle loading data from csv file
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          console.log("Parsed CSV Data:", results.data.pop());
          setPrizes(results.data); // Store the parsed data in state
        },
        header: true, // Set to true if your CSV has headers
      });
    }
  };
  //upload bulk prizes from csv file
  const uploadPrize = () => {
    if(user.authority.gacha != 2 && user.authority.gacha != 4) {
      showToast("You have no permission for this action", 'error');
      return;
    }
    setAuthToken();
    console.log("uploadPrize");
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
          console.log(res.data.err);
        }
      })
      .catch((err) => console.log(err));
  };
  //unset registered prizes from gacha
  const unsetPrize = (i) => {
    if(user.authority.gacha != 3 && user.authority.gacha != 4) {
      showToast("You have no permission for this action", 'error');
      return;
    }
    api
      .post("/admin/gacha/unset_prize/", {
        gachaId: gachaId,
        prizeId: i == -1 ? gacha.last_prize._id : gacha.remain_prizes[i]._id,
        flag: i, // if i is -1, handle unset last prize
      })
      .then((res) => {
        if (res.data.status === 1) {
          showToast("Unseting Prize Success.");
          getGacha();
          setTrigger(!trigger);
        } else {
          showToast(res.data.msg, "error");
          console.log("Prize unset error---->", res.data.err);
        }
      });
  };

  //set prize from registerd prizes by manualy
  const setprizes = (id) => {
    if(user.authority.gacha != 2 && user.authority.gacha != 4) {
      showToast("You have no permission for this action", 'error');
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
          console.log("setPrize error", res.data.err);
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
        <span className="text-center">{t('gacha') + " " + t('detail')}</span>
      </div>
      <hr className="w-5/6 my-2 text-sm mx-auto"></hr>

      {/* Gacha display table */}
      <div className="mx-auto mt-5 overflow-auto">
        <table className="border-[1px] m-auto">
          <thead className="bg-admin_theme_color font-bold text-gray-200">
            <th>{t('no')}</th>
            <th>{t('image')}</th>
            <th>{t('name')}</th>
            <th>{t('price')}</th>
            <th>{t('total')+ " " + t("number")}</th>
            <th>{t("category")}</th>
            <th>{t('created') + " " +  t('date')}</th>
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
                <td colSpan="6">{t('nogacha')}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <hr className="my-2"></hr>

      {/* Gacha Prizes */}
      <div>
        <div className="text-lg">{t('prize') + " " + t('list')}</div>
        <div className="flex flex-wrap justify-evenly  items-stretch">
          {gacha?.remain_prizes?.length > 0
            ? gacha.remain_prizes.map((prize, i) => (
                <div className="group relative mt-2 mr-1">
                  <PrizeCard
                    key={i}
                    name={prize?.name}
                    rarity={prize?.rarity}
                    cashback={prize?.cashback}
                    img_url={prize?.img_url}
                  />
                  <div className="absolute top-0 w-full h-full bg-gray-200 opacity-0 hover:opacity-10"></div>
                  <div className="absolute top-0 right-0 rounded-bl-[100%] rounded-tr-lg w-8 h-8 hidden group-hover:block text-center bg-red-500 z-10 opacity-80 hover:opacity-100">
                    <i
                      className="fa fa-close text-gray-200 middle"
                      onClick={() => unsetPrize(i)}
                    ></i>
                  </div>
                </div>
              ))
            : null}
        </div>

        {/* last prize */}
        <div className="my-2 text-left text-lg">{t('last') + " " + t('prize')}</div>
        {gacha?.last_prize ? (
          <div className="group relative mt-2 mr-1">
            <PrizeCard
              name={gacha.last_prize?.name}
              rarity={gacha.last_prize?.rarity}
              cashback={gacha.last_prize?.cashback}
              img_url={gacha.last_prize?.img_url}
            />
            <div className="absolute top-0 w-full h-full bg-gray-100 opacity-0 hover:opacity-10"></div>
            <div className="absolute top-0 right-0 rounded-bl-[100%] rounded-tr-lg w-8 h-8 hidden group-hover:block text-center bg-red-500 z-10 opacity-80 hover:opacity-100">
              <i
                className="fa fa-close text-gray-200 middle"
                onClick={() => unsetPrize(-1)}
              ></i>
            </div>
          </div>
        ) : null}
      </div>

      {/* setting prize to gacha */}
      <div className="mx-auto w-full">
        <hr className="my-2 text-sm"></hr>
        <div className="text-left text-lg text-slate-600">{t('set') + " " + t('prize')}</div>
        <div className="text-theme_text_color mt-4">
          {t('set_CSV')}
        </div>
        <hr className="w-full text-theme_text_color"></hr>
        <div className="flex flex-wrap justify-between items-center w-5/6 mt-2">
          <div className="button-38 my-1">
            <a
              href={
                process.env.REACT_APP_SERVER_ADDRESS + `/template/template.csv`
              }
              download
            >
              template.csv
            </a>
            <i className="fa fa-download"></i>
          </div>
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
            {t('upload') + " " + t('all') + " " + t('prize')}
          </button>
        </div>
        <div className="mt-3 overflow-auto">
          <table className="border-[1px]  mx-auto mt-2 w-full">
            <thead className="bg-admin_theme_color font-bold text-gray-200">
              <tr>
                <th>{t('no')}</th>
                <th>{t('name')}</th>
                <th>{t('rarity')}</th>
                <th>{t('cashback') + " " + t("point")}</th>
                <th>{t('image')}</th>
              </tr>
            </thead>
            <tbody>
              {prizes ? (
                prizes.map((data, i) => (
                  <tr key={data._id} className="border-2">
                    <td>{i + 1}</td>
                    <td>{data.name}</td>
                    <td>{data.rarity}</td>
                    <td>{data.cashback}</td>
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
                  <td colSpan="6">{t('noprize')}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="w-full mt-5 overflow-auto">
        <div className="text-theme_text_color mx-auto">
          {t('set_registered_prize')}
          <hr className="w-full text-theme_text_color my-1"></hr>
        </div>
        <div className="flex justify-between items-end mx-auto my-2">
          <button
            className="button-38"
            onClick={() => {
              setLoadFlag(true);
            }}
          >
            {t('load_prizes')}
          </button>
          <div class="form-check form-check-inline">
            <label class="form-check-label">
              <input
                class="form-check-input"
                type="checkbox"
                checked={isLastPrize}
                onChange={() => setIsLastPrize((prev) => !prev)}
              />
              {t('set_as_lastPrize')}
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
