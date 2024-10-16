import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import SubHeader from "../../components/Forms/SubHeader";
import { showToast } from "../../utils/toastUtil";

function Shipping() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [user, setUser] = usePersistedUser();
  const [pickedShipAddress, setPickedShipAddress] = useState();
  const [shipAddressData, setShipAddressData] = useState();

  useEffect(() => {
    setAuthToken();
    getShippingAddress();
  }, []);

  const getShippingAddress = async () => {
    try {
      const res = await api.get(`user/shipping_address/${user?._id}`);
      if (res.data.status === 1) {
        setShipAddressData(res.data.shippingAddress);
        setPickedShipAddress(user?.shipAddress_id);
      }
    } catch (error) {
      showToast("Something went wrong", "error");
    }
  };

  const saveShipAddress = async () => {
    try {
      const res = await api.post("user/add_shipping_address", {
        userId: user?._id,
        shipAddress: pickedShipAddress,
      });

      if (res.data.status === 1) {
        showToast("Successfully set shipping address.", "success");
      } else {
        showToast("Failed to set shipping address.", "error");
      }
    } catch (error) {
      showToast("Something went wrong.", "error");
    }
  };

  const deleteShipAddress = async (address) => {
    try {
      const res = await api.delete(`user/del_shipping_address/${address}`);

      if (res.data.status === 1) {
        getShippingAddress();
        showToast("Successfully deleted data.", "success");
      } else {
        showToast("Failed to delete data.", "error");
      }
    } catch (error) {
      showToast("Something went wrong.", "error");
    }
  };

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-2/3 lg:w-1/2 p-3 mx-auto mt-12">
        <div className="w-full py-2">
          <div className="text-center text-xl text-slate-600">
            <i
              className="fa fa-chevron-left mt-1 float-left items-center cursor-pointer"
              onClick={() => navigate(-1)}
            ></i>
            {t("manageShippingAddress")}
          </div>
          <hr className="w-full my-2"></hr>
        </div>
        {shipAddressData?.map((data, i) => {
          return (
            <div key={i}>
              <div
                className={`${
                  pickedShipAddress === data._id && "bg-gray-200 rounded-md"
                } flex flex-wrap justify-between py-3 px-2`}
              >
                <div
                  className={`flex flex-wrap items-center cursor-pointer flex-grow`}
                  onClick={() => setPickedShipAddress(data._id)}
                >
                  <label>
                    <input
                      className="cursor-pointer"
                      type="radio"
                      checked={pickedShipAddress === data._id ? true : false}
                      onChange={() => console.log()}
                    />
                  </label>
                  <div className="flex flex-col px-2 text-gray-600">
                    <span className="font-bold">
                      {data.firstName} {data.lastName}
                    </span>
                    <span>
                      {data.postCode} {data.prefecture} {data.address}{" "}
                      {data.building}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center">
                  <button
                    className="bg-indigo-600 hover:bg-indigo-700 rounded-md text-center mx-1 px-3 py-1 text-white outline-none"
                    onClick={() => {
                      deleteShipAddress(data._id);
                    }}
                  >
                    {t("delete")}
                  </button>
                  <button
                    className="bg-theme_color rounded-md text-center px-3 py-1 hover:bg-red-800 text-white outline-none"
                    onClick={() =>
                      navigate("/user/userShipingAdd", {
                        state: { initialData: data },
                      })
                    }
                  >
                    {t("edit")}
                  </button>
                </div>
              </div>
              <hr className="w-full my-2"></hr>
            </div>
          );
        })}
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
