function PrizeCard({ img_url, prizeType, lastEffect }) {
  return (
    <div
      className="flex flex-col border-[1px] shadow-md shadow-gray-400 bg-gray-200 items-center p-1.5 m-1"
      style={{
        animation:
          lastEffect && prizeType === "last" ? "bounce 1s infinite" : "none",
        animationTimingFunction: "ease-in-out",
        animationName:
          lastEffect && prizeType === "last" ? "customBounce" : "none",
      }}
    >
      <style>
        {`
      @keyframes customBounce {
        0%, 100% {
          transform: translateY(0);
        }
        50% {
          transform: translateY(-10px); /* Adjust this value for bounce height */
        }
      }
    `}
      </style>
      <img
        src={process.env.REACT_APP_SERVER_ADDRESS + img_url}
        className="w-[100px] h-[150px] object-cover"
        alt="img"
      />
    </div>
  );
}

export default PrizeCard;
