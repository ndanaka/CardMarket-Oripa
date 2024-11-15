import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";
import usePersistedUser from "../../store/usePersistedUser";

import Spinner from "../Others/Spinner";
import Card from "./Card";

const Delivering = ({ deliverStatus }) => {
  const { t } = useTranslation();
  const [user] = usePersistedUser();

  const [awaitingPrizes, setAwaitingPrizes] = useState([]);
  const [spinFlag, setSpinFlag] = useState(false);

  useEffect(() => {
    setInitialData();
  }, [deliverStatus]);

  const setInitialData = async () => {
    setAuthToken();

    try {
      setSpinFlag(true);
      const res = await api.get(`user/obtainedPrizes/${user?._id}`);
      setSpinFlag(false);

      let tempPrizes = [];
      if (res.data.status === 1) {
        tempPrizes = res.data.obtainedPrizes;
        tempPrizes = tempPrizes.filter(
          (item) => item.deliverStatus === deliverStatus
        );
      }

      // sort array based on priz kind
      const order = ["last_prize", "round_number_prize", "extra_prize"];
      tempPrizes.sort((a, b) => {
        const indexA = order.indexOf(a.kind);
        const indexB = order.indexOf(b.kind);

        if (indexA === -1 && indexB === -1) return 0; // both are not in the order
        if (indexA === -1) return 1; // a is not in the order, b comes first
        if (indexB === -1) return -1; // b is not in the order, a comes first

        return indexA - indexB; // sort based on the defined order
      });

      setAwaitingPrizes(tempPrizes);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="card-list overflow-auto py-2 flex flex-wrap">
      {spinFlag && <Spinner />}
      {awaitingPrizes?.length !== 0 &&
        awaitingPrizes?.map((prize, i) => {
          return (
            <div key={i} className="relative w-full md:w-1/2 cursor-pointer">
              <Card prize={prize} />
            </div>
          );
        })}
    </div>
  );
};

export default Delivering;
