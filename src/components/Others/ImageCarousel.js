import { useState, useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import api from "../../utils/api";
import { setAuthToken } from "../../utils/setHeader";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function ImageCarousel() {
  const [carousels, setCarousels] = useState([]);

  useEffect(() => {
    setAuthToken();
    getCarousels();
  }, []);

  const getCarousels = async () => {
    setAuthToken();

    const res = await api.get("/admin/get_carousels");
    if (res.data.status === 1) {
      setCarousels(res.data.carousels);
    } else console.log("getCarousels Error---->", res.data.err);
  };

  return (
    <Swiper
      navigation={{
        nextEl: ".swiper-button-next-ex2",
        prevEl: ".swiper-button-prev-ex2",
      }}
      pagination={{ clickable: true }}
      autoplay={{ delay: 2000 }}
      className="swiper max-w-sm mx-auto my-2"
      id="slider2"
      key={"true"}
    >
      <div className="swiper-wrapper">
        {carousels?.map((carousel, i) => {
          return (
            <SwiperSlide key={i}>
              <a href={carousel.link} target="_blank">
                <img
                  src={process.env.REACT_APP_SERVER_ADDRESS + carousel.img_url}
                  className="w-full max-h-80 object-cover rounded-lg cursor-pointer bg-blend-lighten hover:opacity-50"
                  alt="carouselImage"
                />
              </a>
            </SwiperSlide>
          );
        })}
      </div>
    </Swiper>
  );
}

export default ImageCarousel;
