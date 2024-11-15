import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import { showToast } from "../../utils/toastUtil";

import usePersistedUser from "../../store/usePersistedUser";
import { bgColorAtom } from "../../store/theme";

import Spinner from "../../components/Others/Spinner";
import SucceedModal from "../../components/Modals/SucceedModal";

function ChangeShippingAddress() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [user] = usePersistedUser();
  const [bgColor] = useAtom(bgColorAtom);

  const [pickedShipAddress, setPickedShipAddress] = useState();
  const [shipAddressData, setShipAddressData] = useState();
  const [spinFlag, setSpinFlag] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [text, setText] = useState("");

  useEffect(() => {
    setAuthToken();
    getShippingAddress();
  }, []);

  const getShippingAddress = async () => {
    try {
      setSpinFlag(true);
      const res = await api.get(`user/shipping_address/${user?._id}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        setShipAddressData(res.data.shippingAddress);
        setPickedShipAddress(user?.shipAddress_id);
      }
    } catch (error) {
      showToast(t("failedReq"), "error");
    }
  };

  const setShipAddress = async () => {
    try {
      if (!pickedShipAddress) {
        return showToast(t("selectShipAddr"), "error");
      }
      setSpinFlag(true);
      const res = await api.post("user/set_shipping_address", {
        userId: user?._id,
        shipAddressId: pickedShipAddress,
      });
      setSpinFlag(false);

      if (res.data.status === 1) {
        setIsOpen(true);
        setText(t("successSet"));
      } else {
        showToast(t("failedSet"), "error");
      }
    } catch (error) {
      showToast(t("faileReq"), "error");
    }
  };

  const deleteShipAddress = async (address) => {
    try {
      setSpinFlag(true);
      const res = await api.delete(`user/del_shipping_address/${address}`);
      setSpinFlag(false);

      if (res.data.status === 1) {
        getShippingAddress();
        showToast(t("successDeleted"), "success");
      } else {
        showToast(t("failedDeleted"), "error");
      }
    } catch (error) {
      showToast(t("faileReq"), "error");
    }
  };

  return (
    <div className="flex flex-grow">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-2/3 p-3 mx-auto">
        <div className="w-full py-2">
          <div className="text-center text-xl text-slate-600">
            <i
              className="fa fa-chevron-left mt-1.5 float-left items-center cursor-pointer"
              onClick={() => navigate(-1)}
            ></i>
            {t("setShippingAddress")}
          </div>
          <hr className="w-full my-2"></hr>
        </div>
        {shipAddressData?.length === 0 && (
          <div className="text-center">{t("noShippingAddress")}</div>
        )}
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
                      {data.lastName} {data.firstName}
                    </span>
                    <span>
                      {(data?.country !== undefined
                        ? t(data?.country) + ", "
                        : "") +
                        (data?.prefecture !== undefined
                          ? data?.prefecture + ", "
                          : "") +
                        (data?.address !== undefined
                          ? data?.address + ", "
                          : "") +
                        (data?.addressLine1 !== undefined
                          ? data?.addressLine1 + ", "
                          : "") +
                        (data?.addressLine2 !== undefined
                          ? data?.addressLine2 + ", "
                          : "") +
                        (data?.building !== undefined
                          ? data?.building + ", "
                          : "") +
                        (data?.districtCity !== undefined
                          ? data?.districtCity + ", "
                          : "") +
                        (data?.cityTown !== undefined
                          ? data?.cityTown + ", "
                          : "") +
                        (data?.cityDistrict !== undefined
                          ? data?.cityDistrict + ", "
                          : "") +
                        (data?.islandCity !== undefined
                          ? data?.islandCity + ", "
                          : "") +
                        (data?.suburbCity !== undefined
                          ? data?.suburbCity + ", "
                          : "") +
                        (data?.state !== undefined ? data?.state + ", " : "") +
                        (data?.stateProvinceRegion !== undefined
                          ? data?.stateProvinceRegion + ", "
                          : "") +
                        (data?.zipCode !== undefined
                          ? data?.zipCode + ", "
                          : "")}
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center">
                  <button
                    className="bg-gray-600 rounded-md text-center mx-1 px-3 py-1 text-white outline-none"
                    onClick={() => {
                      deleteShipAddress(data._id);
                    }}
                  >
                    {t("delete")}
                  </button>
                  <button
                    className="hover:opacity-50 rounded-md text-center px-3 py-1 text-white outline-none"
                    onClick={() =>
                      navigate("/user/addShippingAddress", {
                        state: { initialData: data },
                      })
                    }
                    style={{ backgroundColor: bgColor }}
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
            className="hover:opacity-50 rounded-md text-center m-2 px-5 py-2 text-white outline-none"
            onClick={() => navigate("/user/addShippingAddress")}
            style={{ backgroundColor: bgColor }}
          >
            {"+ " + t("addAddress")}
          </button>
          <button
            className="hover:opacity-50 rounded-md text-center m-2 px-5 py-2 text-white outline-none bg-gray-600"
            onClick={setShipAddress}
          >
            {t("decide")}
          </button>
        </div>
      </div>
      <SucceedModal isOpen={isOpen} setIsOpen={setIsOpen} text={text} />
    </div>
  );
}

export default ChangeShippingAddress;
