import React, { useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, EffectCoverflow, Navigation, Pagination, Mousewheel, Keyboard } from "swiper/modules";
import { getAllGames } from "../Redux/Slice/game.slice";
import { useDispatch, useSelector } from "react-redux";

const CardCarousel = ({
  images,
  autoplayDelay = 2000,
  showPagination = true,
  showNavigation = true,
}) => {
  const css = `
    .swiper {
      width: 100%;
      padding-bottom: 50px;
      padding-top: 50px;
    }
    .swiper-slide {
      background-position: center;
      background-size: cover;
      width: 500px;
    }
    .swiper-slide img {
      display: block;
      width: 100%;
      border-radius: 16px;
      transition: transform 600ms cubic-bezier(0.22, 1, 0.36, 1),
                  box-shadow 600ms cubic-bezier(0.22, 1, 0.36, 1),
                  opacity 600ms ease,
                  clip-path 600ms cubic-bezier(0.22, 1, 0.36, 1);
      will-change: transform, clip-path;
    }
    /* Distinct shapes for immediate prev/next slides */
    .swiper-slide-prev img {
      /* Left neighbor: slanted left edges */
      -webkit-clip-path: polygon(0 6%, 100% 0, 100% 100%, 0 94%);
      clip-path: polygon(0 6%, 100% 0, 100% 100%, 0 94%);
    }
    .swiper-slide-next img {
      /* Right neighbor: slanted right edges */
      -webkit-clip-path: polygon(0 0, 100% 6%, 100% 94%, 0 100%);
      clip-path: polygon(0 0, 100% 6%, 100% 94%, 0 100%);
    }
    .swiper-slide-next img,
    .swiper-slide-prev img {
      opacity: 0.85;
      transform: scale(0.96);
    }
    .swiper-slide-active img {
      opacity: 1;
      transform: scale(1.04);
      box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
      animation: floatY 6s ease-in-out infinite;
      /* Center card keeps original rectangular shape */
      -webkit-clip-path: none;
      clip-path: none;
    }
    @keyframes floatY {
      0% { transform: translateY(0) scale(1.04); }
      50% { transform: translateY(-8px) scale(1.06); }
      100% { transform: translateY(0) scale(1.04); }
    }
    .swiper-3d .swiper-slide-shadow-left {
      background-image: none;
    }
    .swiper-3d .swiper-slide-shadow-right{
      background: none;
    }
    
    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .swiper-slide {
        width: 420px;
      }
    }
    @media (max-width: 768px) {
      .swiper {
        padding-top: 30px;
        padding-bottom: 30px;
      }
      .swiper-slide {
        width: 340px;
      }
    }
    @media (max-width: 640px) {
      .swiper {
        padding-top: 24px;
        padding-bottom: 24px;
      }
      .swiper-slide {
        width: 260px;
      }
    }

    @media (max-width: 320px) {
      .swiper-slide {
        width: 200px;
      }
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
    <section className="w-full ">
      <style>{css}</style>
      <div className="mx-auto w-full max-w-[80%] rounded-[24px] border border-black/5 p-2 shadow-sm md:rounded-t-[44px]">
        <div className="relative mx-auto flex w-full flex-col rounded-[24px] border border-black/5 bg-neutral-800/5 p-2 shadow-sm md:items-start md:gap-8 md:rounded-b-[20px] md:rounded-t-[40px] md:p-2">
          {/* <Badge
            variant="outline" 
            className="absolute left-4 top-6 rounded-[14px] border border-black/10 text-base md:left-6"
          >
            <SparklesIcon className="fill-[#EEBDE0] stroke-1 text-neutral-800" />{" "}
            Latest component
          </Badge> */}
          <div className="flex flex-col justify-center pb-2 pl-4 pt-14 md:items-center">
            <div className="flex gap-2">
              <div>
                <h3 className="text-4xl font-bold text-white">
                  New Games
                </h3>
              </div>
            </div>
          </div>

          <div className="flex w-full items-center justify-center gap-4">
            <div className="w-full">
              <Swiper
                spaceBetween={40}
                speed={900}
                autoplay={{
                  delay: autoplayDelay,
                  pauseOnMouseEnter: true,
                  disableOnInteraction: false,
                }}
                effect={"coverflow"}
                grabCursor={true}
                centeredSlides={true}
                loop={true}
                slidesPerView={"auto"}
                mousewheel={{ forceToAxis: true, releaseOnEdges: true, sensitivity: 0.5 }}
                keyboard={{ enabled: true }}
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
                modules={[EffectCoverflow, Pagination, Navigation, Autoplay, Mousewheel, Keyboard]}
              >
                {displayImages.map((image, index) => (
                  <SwiperSlide key={`slide1-${index}`}>
                    <div className="size-full rounded-3xl bg-[#121015]">
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
                    <div className="size-full rounded-3xl bg-[#121015]">
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