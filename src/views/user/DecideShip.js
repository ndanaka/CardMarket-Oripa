import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import api from "../../utils/api";
import { showToast } from "../../utils/toastUtil";
import { setAuthToken } from "../../utils/setHeader";

import NotSelected from "../../components/Aquicision/NotSelected";
import Spinner from "../../components/Others/Spinner";

const DecideShip = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const { prizes } = location.state || {};

  const [spinFlag, setSpinFlag] = useState(false);

  // skip shipping
  const submitSetNotSelectedPrizes = async () => {
    setAuthToken();
    setSpinFlag(true);
    const res = await api.post("/admin/gacha/setNotSelectedPrizes", {
      prizes: prizes,
    });
    setSpinFlag(false);

    if (res.data.status === 1) {
      navigate("/user/redrawGacha", {
        state: { gachaId: res.data.gachaId },
      });
    } else {
      showToast(t("failedReq"), "error");
    }
  };

  return (
    <div className="flex flex-grow">
      {spinFlag && <Spinner />}
      <div className="w-full md:w-4/6 p-3 mx-auto">
        <div
          className="text-end text-xl text-slate-600 py-2 cursor-pointer"
          onClick={submitSetNotSelectedPrizes}
        >
          {t("skipShipping")}
          <i className="fa fa-chevron-right m-1.5 float-right"></i>
          <hr className="w-full mt-2"></hr>
        </div>
        <NotSelected initialPrizes={prizes} />
      </div>
    </div>
  );
};

export default DecideShip;
