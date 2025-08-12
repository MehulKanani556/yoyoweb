import React from "react";

const CommonButton = () => {
  return (
    <div className="group">
    <button
      className="
        relative px-6 py-3 text-white text-lg font-medium rounded-full 
        bg-orange-600 
        overflow-hidden 
        transition-colors duration-300
        hover:bg-orange-100
      "
    >
      {/* Left arc */}
      <span
        className="
          absolute left-[-25px] top-1/2 -translate-y-1/2 
          w-12 h-[120%] rounded-full border-2 border-orange-600 border-r-0
          transition-all duration-500 ease-in-out
          group-hover:w-[calc(100%+50px)] group-hover:border-r-2
        "
      ></span>

      {/* Button Text */}
      <span className="relative z-10">Play Now</span>

      {/* Right arc */}
      <span
        className="
          absolute right-[-25px] top-1/2 -translate-y-1/2 
          w-12 h-[120%] rounded-full border-2 border-orange-600 border-l-0
          transition-all duration-500 ease-in-out
          group-hover:w-[calc(100%+50px)] group-hover:border-l-2
        "
      ></span>
    </button>
    </div>
  );
};

export default CommonButton;
