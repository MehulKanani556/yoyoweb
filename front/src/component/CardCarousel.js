import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, EffectCoverflow, Navigation, Pagination } from "swiper/modules";
import { getAllGames } from "../Redux/Slice/game.slice";
import { useDispatch, useSelector } from "react-redux";

const CardCarousel = ({
  images,
  // autoplayDelay = 1500,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
    .swiper {
      width: 100%;
      padding-bottom: 50px;
    }
    .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 300px;
    }
    .swiper-slide img {
      display: block;
      width: 100%;
    }
    .swiper-3d .swiper-slide-shadow-left {
      background-image: none;
    }
    .swiper-3d .swiper-slide-shadow-right{
      background: none;
    }
  `;
  const dispatch = useDispatch();
  const { games } = useSelector((state) => state.game);

  const displayImages = (Array.isArray(games) && games.length > 0)
    ? games
        .map((g) => ({
          src: g?.cover_image?.url || (Array.isArray(g?.images) && g.images[0]?.url) || null,
          alt: g?.title || "Game image",
        }))
        .filter((img) => Boolean(img.src))
    : images;
  useEffect(() => {
    dispatch(getAllGames());
  }, []);

  return (
    <section className="w-full bg-black">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-5xl rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          {/* <Badge
            variant="outline" 
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
          >
            <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
            Latest component
          </Badge> */}
          {/* <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-4xl opacity-85 font-bold tracking-tight">
                  Card Carousel
                </h3>
                <p>Seamless Images carousel animation.</p>
              </div>
            </div>
          </div> */}

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={50}
                autoplay={{
                  // delay: autoplayDelay,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                coverflowEffect={{
                  rotate: 0,
                  stretch: 0,
                  depth: 100,
                  modifier: 2.5,
                }}
                pagination={showPagination}
                navigation={
                  showNavigation
                    ? {
                      nextEl: ".swiper-button-next",
                      prevEl: ".swiper-button-prev",
                    }
                    : undefined
                }
                modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
              >
                {displayImages.map((image, index) => (
                  <SwiperSlide key={`slide1-${index}`}>
                    <div className="size-full rounded-3xl">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="size-full rounded-xl"
                        width={500}
                        height={500}
                      />
                    </div>
                  </SwiperSlide>
                ))}
                {displayImages.map((image, index) => (
                  <SwiperSlide key={`slide2-${index}`}>
                    <div className="size-full rounded-3xl">
                      <img
                        src={image.src}
                        alt={image.alt}
                        className="size-full rounded-xl"
                        width={200}
                        height={200}
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CardCarousel;