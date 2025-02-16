import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import bannerImage1 from "../../assets/Banner1.png";
import bannerImage2 from "../../assets/Banner2.png";
import bannerImage3 from "../../assets/Banner3.png";
import { Link } from "react-router-dom";

const Banner = () => {
  const images = [bannerImage1, bannerImage2, bannerImage3];

  return (
    <div className="w-full mx-auto -mt-2 relative">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={0}
        slidesPerView={1}
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 3000, disableOnInteraction: false }}
        loop
        className="shadow-lg"
      >
        {images.map((img, index) => (
          <SwiperSlide key={index} className="relative">
            {/* Banner image */}
            <div className="relative w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] xl:h-[650px]">
              <img
                src={img}
                alt={`Banner ${index + 1}`}
                loading="lazy"
                className="w-full h-full object-cover rounded-lg"
              />

              {/* Gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-black/70 rounded-lg"></div>

              {/* Text and button */}
              <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-6">
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold drop-shadow-lg">
                  Best Deals of the Year!
                </h2>
                <p className="mt-2 text-sm sm:text-lg md:text-xl lg:text-2xl font-medium drop-shadow-md">
                  Get amazing discounts on your favorite products.
                </p>
                <Link to={'/products'}>
                  <button className="mt-6 px-6 py-3 bg-white text-black font-semibold rounded-full shadow-lg text-lg md:text-xl hover:bg-gray-200 transition duration-300 transform hover:scale-105">
                    Shop Now
                  </button>
                </Link>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default Banner;
