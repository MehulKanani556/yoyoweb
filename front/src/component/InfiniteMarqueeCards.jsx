import React, { memo, useCallback, useEffect, useRef } from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { getAllCategories } from "../Redux/Slice/category.slice";

// Floating elements (top-sides)
import mario from "../Asset/images/game-console.png";
import sonic from "../Asset/images/sword.png";
import { useNavigate } from "react-router-dom";

const InfiniteMarqueeCards = memo(function InfiniteMarqueeCards() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { categories, loading } = useSelector(
    (s) => ({
      categories: s.category.categories,
      loading: s.category.loading,
    }),
    shallowEqual
  );

  useEffect(() => {
    if (!Array.isArray(categories) || categories.length === 0) {
      dispatch(getAllCategories());
    }
  }, [dispatch]);

  const items = Array.isArray(categories) ? categories : [];

  // Marquee pause/resume
  const marqueeRef = useRef(null);
  const handleCardMouseEnter = useCallback(() => {
    if (marqueeRef.current)
      marqueeRef.current.style.animationPlayState = "paused";
  }, []);
  const handleCardMouseLeave = useCallback(() => {
    if (marqueeRef.current)
      marqueeRef.current.style.animationPlayState = "running";
  }, []);

  // Floating elements (parallax on scroll)
  const leftFloatRef = useRef(null);
  const rightFloatRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0;
      const sway = Math.sin(y / 150) * 50; // left/right
      const rise = y * 0.05; // gentle down
      const rot = y * 0.5; // rotate

      if (leftFloatRef.current) {
        leftFloatRef.current.style.transform = `translate(${sway}px, ${
          -rise * 10
        }px) `;
      }
      if (rightFloatRef.current) {
        rightFloatRef.current.style.transform = `translate(${sway}px, ${
          rise * 10
        }px) rotate(${rot * 0.7}deg)`;
      }
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const Card = memo(function Card({ item, onMouseEnter, onMouseLeave }) {
    const ref = useRef(null);

    const onMove = useCallback((e) => {
      const el = ref.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const x = e.clientX - r.left;
      const y = e.clientY - r.top;
      const rx = (y / r.height - 0.5) * -12;
      const ry = (x / r.width - 0.5) * 12;
      el.style.setProperty("--rx", `${rx.toFixed(2)}deg`);
      el.style.setProperty("--ry", `${ry.toFixed(2)}deg`);
    }, []);

    const onLeave3d = useCallback(() => {
      const el = ref.current;
      if (!el) return;
      el.style.setProperty("--rx", `0deg`);
      el.style.setProperty("--ry", `0deg`);
    }, []);

    const bgUrl = item?.category_image?.url;

    return (
      <div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={(e) => {
          onMouseLeave && onMouseLeave(e);
          onLeave3d(e);
        }}
        onMouseEnter={onMouseEnter}
        onClick={() => {
          navigate("/games", {
            state: {
              name: item?.categoryName,
              _id: item?._id,
              id: item?.categoryName.toLowerCase(),
            },
          });
        }}
        className="card-3d relative flex-shrink-0 w-[180px] h-[250px]  md:w-[230px] md:h-[350px] mx-5 rounded-xl overflow-hidden"
        style={{
          backgroundImage: bgUrl ? `url(${bgUrl})` : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="absolute bottom-0 left-0 w-full flex items-end h-[30%] bg-gradient-to-t from-black to-transparent">
          <div className="z-10 text-white text-center w-full mb-4">
            <h3
              className="text-2xl font-bold line-clamp-1"
              style={{
                perspective: "6000px",
                transform: "translateZ(100px)",
                willChange: "transform",
              }}
            >
              {item?.categoryName || "Category"}
            </h3>
          </div>
        </div>
      </div>
    );
  });

  return (
    <div className="relative w-full overflow-hidden py-36">
      {/* Soft colored glows for gaming feel */}
      <div className="pointer-events-none absolute bottom-10 -left-40 w-[700px] h-[700px] rounded-full glow-purple blur-3xl" />
      <div className="pointer-events-none absolute bottom-10 -right-40 w-[700px] h-[700px] rounded-full glow-pink blur-3xl" />

      {/* Floating “game elements” at the upper sides */}
      {/* <img
        ref={leftFloatRef}
        src={mario}
        alt="left element"
        className="floating-elem absolute bottom-0 left-2 w-36 md:w-44 opacity-90 select-none pointer-events-none"
        loading="lazy"
      />
      <img
        ref={rightFloatRef}
        src={sonic}
        alt="right element"
        className="floating-elem absolute -top-0 right-2 w-36 md:w-44 opacity-90 select-none pointer-events-none"
        loading="lazy"
      /> */}
      <div className="rounded-3xl p-[1px] w-[80%] mx-auto overflow-hidden shadow-[0px_0px_2px_0px] shadow-primary-light">
        <div className="rotating-border w-full bg-white rounded-3xl">
          <div className="relative z-10 py-5 w-full mx-auto rounded-3xl backdrop-blur-lg bg-black/95">
            {/* Header */}
            <div className="flex items-center  justify-between mb-5 w-full  px-4 sm:px-8 ">
              <span className="inline-block rounded-md px-2  md:px-4 py-1.5 shadow-lg">
                <span className="text-white font-extrabold text-3xl tracking-wide">
                  Categories
                </span>
              </span>
              <button
                type="button"
                onClick={() => {
                  navigate("/games");
                }}
                className="px-5 py-2 rounded-xl  text-white font-semibold bg-gradient-primary transition-colors shadow-md"
              >
                View More
              </button>
            </div>

            {/* Content */}
            <div className="relative w-full overflow-hidden py-5 ">
              <div
                className="flex whitespace-nowrap animate-marquee-left w-full"
                ref={marqueeRef}
              >
                {Array.from({ length: 4 }).map((_, setIndex) =>
                  (items.length ? items : Array.from({ length: 3 })).map(
                    (item, idx) => (
                      <Card
                        key={`set-${setIndex}-cat-${item?._id || idx}`}
                        item={item || {}}
                        onMouseEnter={handleCardMouseEnter}
                        onMouseLeave={handleCardMouseLeave}
                      />
                    )
                  )
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {loading && (
        <div className="text-center mt-6 text-sm text-gray-400">Loading...</div>
      )}
    </div>
  );
});

export default InfiniteMarqueeCards;
