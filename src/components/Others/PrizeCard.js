import React from "react";

function PrizeCard({ name, rarity, cashback, img_url }) {
  return (
    <div className=" bg-gray-200 h-full rounded-md border-[1px] p-2">
      <div className="flex flex-col h-full bg-white items-center p-2">
        <img
          src={process.env.REACT_APP_SERVER_ADDRESS + img_url}
          width="100px"
          height="60px"
          max-width="100px"
          max-height="60px"
        ></img>
        <div className="flex flex-col items-center mt-1">
          <div className="flex justify-between items-center">
            <span>name : </span>
            <span>{name}</span>
          </div>
          <hr className="w-full"></hr>
          <div className="flex justify-between">
            <div>rarity : </div>
            <div>{rarity}</div>
          </div>
          <hr className="w-full"></hr>
          <div className="flex justify-between">
            <span>cashback : </span>
            <span>{cashback}</span>
          </div>
          <hr className="w-full"></hr>
        </div>
      </div>
    </div>
  );
}

export default PrizeCard;
