function PrizeCard({ img_url, width, height, rounded }) {
  return (
    <div
      className={`shadow-md shadow-gray-400 bg-gray-200 items-center p-1 rounded-${rounded}`}
    >
      <img
        src={process.env.REACT_APP_SERVER_ADDRESS + img_url}
        className={`object-cover rounded-${rounded}`}
        alt="img"
        style={{ width: `${width}px`, height: `${height}px`}}
      />
    </div>
  );
}

export default PrizeCard;
