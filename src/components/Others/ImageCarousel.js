import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

function ImageCarousel({ items }) {
  return (
    <div className="">
      <Swiper
        navigation={{
          nextEl: ".swiper-button-next-ex2",
          prevEl: ".swiper-button-prev-ex2",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        className="swiper max-w-sm mx-auto mb-5"
        id="slider2"
        key={"true"}
      >
        <div className="swiper-wrapper">
          {items.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <img
                  src={require(`../../assets/img/${item.imgUrl}`)}
                  className="w-full max-h-80 object-cover rounded-lg cursor-pointer bg-blend-lighten hover:opacity-50"
                  alt="itemImage"
                />
                {/* <button
                  type="button"
                  className="bottom-0 right-0 absolute btn btn-primary"
                >
                  Go To
                </button> */}
              </SwiperSlide>
            );
          })}
        </div>
      </Swiper>
    </div>
  );
}

export default ImageCarousel;
