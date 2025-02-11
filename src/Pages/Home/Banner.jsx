import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Banner = () => {
    const images = [
        '/images/banner1.jpg',
        '/images/banner2.jpg',
        '/images/banner3.jpg',
        '/images/banner4.jpg',
        '/images/banner5.jpg'
    ];

    return (
        <div className="w-full max-w-7xl mx-auto">
            <Swiper
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={30}
                slidesPerView={1}
                navigation
                pagination={{ clickable: true }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop
                className="rounded-lg shadow-lg"
            >
                {images.map((img, index) => (
                    <SwiperSlide key={index}>
                        <img src={img} alt={`Banner ${index + 1}`} className="w-full h-[400px] object-cover rounded-lg" />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Banner;