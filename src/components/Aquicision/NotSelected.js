import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAtom } from "jotai";

import api from "../../utils/api";
import { bgColorAtom } from "../../store/theme";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import Spinner from "../Others/Spinner";
import Card from "./Card";
import ConfirmShippingModal from "../Modals/ConfirmShippingModal";

const NotSelected = ({ initialPrizes }) => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [bgColor] = useAtom(bgColorAtom);
  const [user, setUser] = usePersistedUser();

  const [cashback, setCashback] = useState(0);
  const [popedPrizes, setPopedPrizes] = useState([]);
  const [returnedPrizes, setReturnedPrizes] = useState([]);
  const [notSelectedPrizes, setNotSelectedPrizes] = useState([]);
  const [spinFlag, setSpinFlag] = useState(false);
  const [shipAddress, setShipAddress] = useState(null);
  const [isOpenConfirmModal, setIsConfirmOpenModal] = useState(false);

  useEffect(() => {
    setInitialData();
  }, [initialPrizes]);

  const setInitialData = async () => {
    setAuthToken();

    try {
      setSpinFlag(true);
      const res = await api.get(`user/getUserData/${user?._id}`);
      setSpinFlag(false);

      if (initialPrizes) {
        // calculate total return cashbacks
        calcCashbak(initialPrizes);

        // sort array based on priz kind
        const order = ["last_prize", "round_number_prize", "extra_prize"];
        initialPrizes.sort((a, b) => {
          const indexA = order.indexOf(a.kind);
          const indexB = order.indexOf(b.kind);

          if (indexA === -1 && indexB === -1) return 0; // both are not in the order
          if (indexA === -1) return 1; // a is not in the order, b comes first
          if (indexB === -1) return -1; // b is not in the order, a comes first

          return indexA - indexB; // sort based on the defined order
        });

        setNotSelectedPrizes(initialPrizes);
        setReturnedPrizes(initialPrizes);
      } else {
        if (res.data.status === 1) {
          if (res.data.userData.shipAddress_id)
            setShipAddress(res.data.userData.shipAddress_id);
          setNotSelectedPrizes(res.data.userData.notselected_prizes);
          setReturnedPrizes(res.data.userData.notselected_prizes);
          calcCashbak(res.data.userData.notselected_prizes);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  // calculate total cashback of prize to return
  const calcCashbak = (prizes) => {
    let total = 0;
    for (let index = 0; index < prizes.length; index++) {
      const element = prizes[index];
      total += element.cashback;
      prizes[index].selected = false;
    }
    setCashback(total);
  };

  // shipping selected prize and return unselected prize
  const submitShipping = async () => {
    setIsConfirmOpenModal(false);

    setSpinFlag(true);
    const res = await api.post("/admin/gacha/shipping", {
      popedPrizes: popedPrizes,
      returnedPrizes: returnedPrizes,
      cashback: cashback,
    });
    setSpinFlag(false);

    if (res.data.status === 1 && initialPrizes) {
      navigate("/user/redrawGacha", {
        state: { gachaId: notSelectedPrizes[0].gacha_id },
      });
    }
  };

  // choose returned prize and shipped prize
  const onChangePrize = (index) => {
    // Create a new array with the updated selected prize
    const updatedPrizes = notSelectedPrizes.map((prize, i) => {
      if (i === index) {
        // Return a new object with the updated selected property
        return { ...prize, selected: !prize.selected };
      }
      return prize; // Return the unchanged prize
    });
    setNotSelectedPrizes(updatedPrizes);

    // Create two arrays: one for selected and one for not selected
    const selectedPrizes = updatedPrizes.filter(
      (prize) => prize.selected === true
    );
    const unselectedPrizes = updatedPrizes.filter(
      (prize) => prize.selected === false
    );

    // Log or use the arrays as needed
    setPopedPrizes(selectedPrizes);
    setReturnedPrizes(unselectedPrizes);
    calcCashbak(unselectedPrizes);
  };

  return (
    <>
      {spinFlag && <Spinner />}
      <p className="py-2">{t("selectProducts")}</p>
      <div className="card-list overflow-auto py-2 flex flex-wrap max-h-[650px]">
        {notSelectedPrizes?.length !== 0 &&
          notSelectedPrizes?.map((prize, i) => {
            return (
              <div
                key={i}
                className="relative w-full md:w-1/2 cursor-pointer"
                onClick={() => onChangePrize(i)}
              >
                <Card prize={prize} />
              </div>
            );
          })}
      </div>
      {notSelectedPrizes?.length !== 0 && (
        <div
          className="rounded-md hover:opacity-50 flex flex-wrap items-center hover:bg-opacity-50 text-white outline-none w-full min-h-[70px] cursor-pointer p-2 mt-3"
          style={{ backgroundColor: bgColor }}
          onClick={() => setIsConfirmOpenModal(true)}
        >
          {popedPrizes.length === 0 ? (
            <div className="flex flex-col mx-auto">
              <p>{t("allReturn")}</p>
              <div className="flex flex-wrap justify-center items-center">
                <img
                  alt="pointImg"
                  src={require("../../assets/img/icons/coin.png")}
                  className="text-center w-6"
                />
                <p className="px-2">{cashback}</p>
              </div>
            </div>
          ) : (
            <span className="mx-auto">{t("selectedShipping")}</span>
          )}
        </div>
      )}
      <ConfirmShippingModal
        isOpen={isOpenConfirmModal}
        setIsOpen={setIsConfirmOpenModal}
        title={
          popedPrizes.length === 0 ? t("allReturn") : t("selectedShipping")
        }
        cashback={cashback}
        desc={
          popedPrizes.length === 0 ? t("shippingDesc1") : t("shippingDesc2")
        }
        submitShipping={submitShipping}
      />
    </>
  );
};

export default NotSelected;
