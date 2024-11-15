import { useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import NotSelected from "../../components/Aquicision/NotSelected";

const DecideShip = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const location = useLocation();

  const { prizes } = location.state || {};

  return (
    <div className="flex flex-grow">
      <div className="w-full md:w-4/6 p-3 mx-auto">
        <div
          className="text-end text-xl text-slate-600 py-2 cursor-pointer"
          onClick={() =>
            navigate("/user/redrawGacha", {
              state: { gachaId: prizes[0].gacha_id },
            })
          }
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
