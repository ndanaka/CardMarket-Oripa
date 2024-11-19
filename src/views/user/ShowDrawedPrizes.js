import { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAtom } from "jotai";
import { useTranslation } from "react-i18next";

import { bgColorAtom } from "../../store/theme";

import PrizeCard from "../../components/Others/PrizeCard";

const ShowDrawedPrizes = () => {
  const { t } = useTranslation();
  const [bgColor] = useAtom(bgColorAtom);
  const location = useLocation();
  const videoRef = useRef(null);
  const navigate = useNavigate();

  const { prizes } = location.state || {};

  const [index, setIndex] = useState(0);
  const [showPrizeFlag, setShowPrizeFlag] = useState(false);
  const [showNext, setShowNext] = useState(true);

  useEffect(() => {
    // Reset to the beginning and play
    videoRef.current.currentTime = 0;
    videoRef.current.play();

    if (index === prizes.length - 1) {
      setShowNext(false);
    }
  }, [index, prizes.length]);

  // skip video
  const skipVideo = () => {
    setShowPrizeFlag(true);
  };

  // show next prize
  const nextPrize = () => {
    videoRef.current.pause();
    setIndex(index + 1);
    setShowPrizeFlag(false);
  };

  // go to shipping page
  const finishPrize = () => {
    videoRef.current.pause();

    navigate("/user/decideShip", {
      state: { prizes: prizes },
    });
  };

  return (
    <>
      <div className={`${showPrizeFlag ? "hidden" : ""}`}>
        <video
          className="min-h-screen max-h-screen object-cover w-full"
          ref={videoRef}
          onEnded={skipVideo}
          src={process.env.REACT_APP_SERVER_ADDRESS + prizes[index].video}
        />
        <button
          className="fixed flex flex-wrap items-center bottom-4 left-4 border-1 cursor-pointer hover:opacity-50 opacity-80 text-white text-center text-lg rounded-md px-3 py-1"
          style={{ backgroundColor: bgColor }}
          onClick={() => skipVideo()}
        >
          {t("skipVideo")}
        </button>
      </div>
      <div className={`m-auto ${!showPrizeFlag ? "hidden" : ""}`}>
        <PrizeCard img_url={prizes[index].img_url} width={300} height={500} />
      </div>
      {showNext && (
        <button
          className="fixed flex flex-wrap items-center bottom-4 right-28 border-1 cursor-pointer hover:opacity-50 opacity-80 text-white text-center text-lg rounded-md px-3 py-1"
          style={{ backgroundColor: bgColor }}
          onClick={() => nextPrize()}
        >
          {t("next")}
        </button>
      )}
      <button
        className="fixed flex flex-wrap items-center bottom-4 right-4 border-1 cursor-pointer hover:opacity-50 opacity-80 text-white text-center text-lg rounded-md px-3 py-1"
        style={{ backgroundColor: bgColor }}
        onClick={() => finishPrize()}
      >
        {t("finish")}
      </button>
    </>
  );
};

export default ShowDrawedPrizes;
