import formatPrice from "../../utils/formatPrice";

function GachaPriceLabel({ price }) {
  return (
    <div className="w-auto bg-gray-100 opacity-70 flex items-center justify-center h-5 border-2 border-dotted border-yellow-900 text-white px-1">
      <img
        src={require("../../assets/img/icons/dollar-coin.png")}
        alt="img"
        height="15"
        width="15"
      ></img>
      <span className="text-gray-900 px-1">{formatPrice(price)}</span>
      {/* <span className='absolute top-[18px] left-[30px] -translate-x-[50%] -translate-y-[50%] text-white font-bold'>{price}</span> */}
    </div>
  );
}

export default GachaPriceLabel;
