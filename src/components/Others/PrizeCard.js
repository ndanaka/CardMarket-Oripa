import formatPrice from "../../utils/formatPrice";

function PrizeCard({ name, rarity, cashback, img_url }) {
  return (
    <div className="flex flex-col rounded-md border-[1px] shadow-md shadow-gray-400 bg-gray-200 items-center p-2 m-1">
      <img
        src={process.env.REACT_APP_SERVER_ADDRESS + img_url}
        className="w-[200px] h-[250px] shadow-md shadow-gray-400 object-cover rounded-md border-[1px]"
        alt="img"
      />
      {/* <div className="flex flex-col items-center mt-1">
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
        </div> */}
    </div>
  );
}

export default PrizeCard;
