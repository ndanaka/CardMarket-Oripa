import React from "react";
import formatPrice from "../../utils/formatPrice";

function PrizeCard({ name, rarity, cashback, img_url }) {
  return (
    <div className=" bg-gray-200 h-[inherit] rounded-md border-[1px] p-2">
      <div className="flex flex-col h-[inherit] bg-white items-center p-2">
        <img
          src={process.env.REACT_APP_SERVER_ADDRESS + img_url}
          className="w-[200px] h-[120px] max-w-[200px] max-h-[120px] object-cover"
        ></img>
        <div className="flex flex-col items-center mt-1">
          <div className="flex justify-between items-center">
            <span className="mr-1">Name : </span>
            <span>{name}</span>
          </div>
          <hr className="w-full"></hr>
          <div className="flex justify-between">
            <div className="mr-1">Rarity : </div>
            <div>{rarity}</div>
          </div>
          <hr className="w-full"></hr>
          <div className="flex justify-between">
            <span className="mr-1">Cashback : </span>
            <span>{formatPrice(cashback)} pt</span>
          </div>
          <hr className="w-full"></hr>
        </div>
      </div>
    </div>
  );
}

export default PrizeCard;
