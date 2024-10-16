import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import SubHeader from "../../components/Forms/SubHeader";

function Shipping() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = usePersistedUser();
  const [shipAddress, setShipAddress] = useState("address1");

  useEffect(() => {
    setAuthToken();
  }, []);

  const saveShipAddress = async () => {
    console.log(shipAddress);
  };

  const deleteShipAddress = async (address) => {
    console.log(address);
  };

  const updateShipAddress = async (address) => {
    console.log(address);
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-2/3 lg:w-1/2 p-3 mx-auto mt-12">
        <SubHeader text={t("manageShippingAddress")} />
        <div
          className={`${
            shipAddress === "address1" && "bg-gray-200 rounded-md"
          } flex flex-wrap justify-between py-3 px-2`}
        >
          <div
            className={`flex flex-wrap items-center cursor-pointer flex-grow`}
            onClick={() => setShipAddress("address1")}
          >
            <label>
              <input
                className="cursor-pointer"
                type="radio"
                checked={shipAddress === "address1" ? true : false}
                onChange={() => console.log()}
              />
            </label>
            <div className="flex flex-col px-2 text-gray-600">
              <span className="font-bold">Henrry Smiss</span>
              <span>
                {"〒231-0012"} {"神奈川県"} {"横浜市中区相生町 17"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 rounded-md text-center mx-1 px-3 py-1 text-white outline-none"
              onClick={() => {
                deleteShipAddress("address1");
              }}
            >
              {t("delete")}
            </button>
            <button
              className="bg-theme_color rounded-md text-center px-3 py-1 hover:bg-red-800 text-white outline-none"
              onClick={() => {
                updateShipAddress("address1");
              }}
            >
              {t("update")}
            </button>
          </div>
        </div>
        <hr className="w-full my-2"></hr>
        <div
          className={`${
            shipAddress === "address2" && "bg-gray-200 rounded-md"
          } flex flex-wrap justify-between py-3 px-2`}
        >
          <div
            className={`flex flex-wrap items-center cursor-pointer flex-grow`}
            onClick={() => setShipAddress("address2")}
          >
            <label>
              <input
                className="cursor-pointer"
                type="radio"
                checked={shipAddress === "address2" ? true : false}
                onChange={() => console.log()}
              />
            </label>
            <div className="flex flex-col px-2 text-gray-600">
              <span className="font-bold">Henrry Smiss</span>
              <span>
                {"〒231-0012"} {"神奈川県"} {"横浜市中区相生町 17"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 rounded-md text-center mx-1 px-3 py-1 text-white outline-none"
              onClick={() => {
                deleteShipAddress("address2");
              }}
            >
              {t("delete")}
            </button>
            <button
              className="bg-theme_color rounded-md text-center px-3 py-1 hover:bg-red-800 text-white outline-none"
              onClick={() => {
                updateShipAddress("address2");
              }}
            >
              {t("update")}
            </button>
          </div>
        </div>
        <hr className="w-full my-2"></hr>
        <div
          className={`${
            shipAddress === "address3" && "bg-gray-200 rounded-md"
          } flex flex-wrap justify-between py-3 px-2`}
        >
          <div
            className={`flex flex-wrap items-center cursor-pointer flex-grow`}
            onClick={() => setShipAddress("address3")}
          >
            <label>
              <input
                className="cursor-pointer"
                type="radio"
                checked={shipAddress === "address3" ? true : false}
                onChange={() => console.log()}
              />
            </label>
            <div className="flex flex-col px-2 text-gray-600">
              <span className="font-bold">Henrry Smiss</span>
              <span>
                {"〒231-0012"} {"神奈川県"} {"横浜市中区相生町 17"}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap items-center">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 rounded-md text-center mx-1 px-3 py-1 text-white outline-none"
              onClick={() => {
                deleteShipAddress("address3");
              }}
            >
              {t("delete")}
            </button>
            <button
              className="bg-theme_color rounded-md text-center px-3 py-1 hover:bg-red-800 text-white outline-none"
              onClick={() => {
                updateShipAddress("address3");
              }}
            >
              {t("update")}
            </button>
          </div>
        </div>
        <hr className="w-full my-2"></hr>
        <div className="w-full xxsm:w-2/3 flex flex-col justify-center mx-auto my-4">
          <button
            className="bg-indigo-600 rounded-md text-center mx-2 px-5 py-2 my-2 hover:bg-indigo-700 text-white outline-none"
            onClick={saveShipAddress}
          >
            {t("decide")}
          </button>
          <button
            className="bg-theme_color rounded-md text-center mx-2 px-5 py-2 my-2 hover:bg-red-800 text-white outline-none"
            onClick={() => navigate("/user/userShipingAdd")}
          >
            {"+ " + t("addAddress")}
          </button>
        </div>
      </div>
    </div>
  );
}

export default Shipping;
