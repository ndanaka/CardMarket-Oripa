import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
// import { Navigation, Pagination, Autoplay } from "swiper";

import React from "react";

function ImageCarousel({items}) {
  return (
    <div>
      <Swiper
        // modules={[Navigation, Autoplay, Pagination]}
        navigation={{
          nextEl: ".swiper-button-next-ex2",
          prevEl: ".swiper-button-prev-ex2",
        }}
        pagination={{ clickable: true }}
        autoplay={{ delay: 2000 }}
        className="swiper max-w-3xl mx-auto mb-5"
        id="slider2"
        key={"true"}
      >
        <div className="swiper-wrapper">
          {items.map((item, i) => {
            return (
              <SwiperSlide key={i}>
                <img
                  src={`../../assets/img/${item.imgUrl}`}
                  className="w-full max-h-80 object-cover"
                  alt="itemImage"
                />
                <div className="absolute z-[999] text-white top-1/4 ltr:left-12 rtl:right-12">
                  <div className="sm:text-3xl text-base font-bold">
                    This is blog Image
                  </div>
                  <div className="sm:mt-5 mt-1 w-4/5 text-base sm:block hidden font-medium">
                    Lorem Ipsum is simply dummy text of the printing and
                    typesetting industry. Lorem Ipsum has been the industry's
                    standard.
                  </div>
                  <button type="button" className="mt-4 btn btn-primary">
                    Learn more
                  </button>
                </div>
              </SwiperSlide>
            );
          })}
        </div>
        <button className="swiper-button-prev-ex2 grid place-content-center ltr:left-2 rtl:right-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2">
          prev
        </button>
        <button className="swiper-button-next-ex2 grid place-content-center ltr:right-2 rtl:left-2 p-1 transition text-primary hover:text-white border border-primary  hover:border-primary hover:bg-primary rounded-full absolute z-[999] top-1/2 -translate-y-1/2">
          next
        </button>
      </Swiper>
    </div>
  );
}

export default ImageCarousel;
