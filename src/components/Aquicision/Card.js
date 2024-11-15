import PrizeCard from "../Others/PrizeCard";
import { useTranslation } from "react-i18next";

const Card = ({ prize, checkbox }) => {
  const { t } = useTranslation();

  return (
    <div className="px-2 py-3">
      <div
        className={`flex ${
          prize.selected && "bg-gray-400"
        } flex-wrap justify-between border-1 border-gray-100 shadow-sm shadow-gray-400 rounded-md`}
      >
        <div className="rotate-[-8deg] ml-2.5 mt-[-8px]">
          <PrizeCard
            img_url={prize.img_url}
            width={60}
            height={100}
            rounded="md"
          />
        </div>
        <div className="flex flex-col justify-between p-1">
          {checkbox && (
            <div className="flex flex-wrap justify-end">
              <div
                className={`mt-[-12px] ${
                  prize.selected ? "bg-green-500" : "bg-gray-300"
                } h-6 w-6 rounded-full p-2 flex items-center justify-center`}
              >
                <i className="fa fa-check text-white text-sm"></i>
              </div>
            </div>
          )}
          <div className="flex flex-wrap justify-end p-2">
            <p className="text-gray-600 font-bold">{prize.name}</p>
          </div>
          <div className="flex flex-wrap justify-end items-center p-2">
            <img
              alt="pointImg"
              src={require("../../assets/img/icons/coin.png")}
              className="text-center w-6 mx-1"
            />
            <p className="text-gray-600 font-bold">{prize.cashback}</p>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap justify-end p-2 mt-[-24px]">
        <p className="text-blue-600 text-lg font-bold">
          {prize.kind !== "first" &&
            prize.kind !== "second" &&
            prize.kind !== "third" &&
            prize.kind !== "fourth" &&
            t(prize.kind)}
        </p>
      </div>
    </div>
  );
};

export default Card;
