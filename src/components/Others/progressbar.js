const Progress_bar = ({ label, progress }) => {
  return (
    <div className="w-full text-center">
      <div className="h-[20px] bg-[#bbb] flex items-center w-full">
        <div
          className={`h-[18px] mx-[1px]`}
          style={{
            width: `${Math.round(progress)}%`,
            backgroundColor:
              Math.round(progress) < 30
                ? "#FF0800"
                : Math.round(progress) < 60
                ? "#FF8C00"
                : "#4CBB17",
          }}
        />
      </div>
      <p className="text-gray-500 font-bold">{label}</p>
    </div>
  );
};

export default Progress_bar;
