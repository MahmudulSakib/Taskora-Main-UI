"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./swiper-custom.css";

export default function CarouselSection() {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      const res = await axios.get<any>(
        "https://taskora-main-backend.onrender.com/client/carousel-images"
      );
      setImages(res.data.map((img: any) => img.url));
    };
    fetchImages();
  }, []);

  return (
    <section
      className="w-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url('/your-background.jpg')`,
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 py-10">
        <div className="rounded-lg overflow-hidden shadow-xl bg-transparent">
          <Swiper
            spaceBetween={10}
            slidesPerView={1}
            autoplay={{ delay: 3000 }}
            loop={true}
            navigation
            pagination={{ clickable: true }}
            modules={[Autoplay, Navigation, Pagination]}
          >
            {images.map((url, idx) => (
              <SwiperSlide key={idx}>
                <img
                  src={url}
                  alt={`slide-${idx}`}
                  className="w-full h-[300px] object-cover rounded-lg"
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
