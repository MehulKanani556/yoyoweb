import React, { useEffect, useState } from "react";
import {
  Link,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
// import WatchlistEmpty from "../../Assets/Images/WatchlistEmpty.png";

import { IoIosCamera, IoIosMail } from "react-icons/io";
import { IoCall } from "react-icons/io5";
import { TfiAngleRight } from "react-icons/tfi";

import UseMediaQuery from "./UseMediaQuery";
import { Sidebar1, Sidebar2 } from "./Sidebar";
// import MyWatchlist from "../MyAccount Components/MyWatchlist";
// import EditProfile from "./EditProfile";
// import MySubscription from "../MyAccount Components/MySubscription";
// import LoggedDevice from "../MyAccount Components/LoggedDevice";
// import DeleteAccount from "../MyAccount Components/DeleteAccount";
import { useDispatch, useSelector } from "react-redux";
import { IMAGE_URL } from "../Utils/baseUrl";
// import { getPaymentUser } from "../../Redux/Slice/Payment.slice";
// import TwoStepVerification from "../MyAccount Components/TwoStepVerification";
// import ParentalControl from "../MyAccount Components/ParentalControl";
import { decryptData } from "../Utils/encryption";
// import MyWatchHistory from "../MyAccount Components/MyWatchHistory";

// Profile Section
const ProfileSection = ({ onEditProfile, currentUser }) => {
  const navigate = useNavigate();
  const subscription = useSelector((state) => state.payment.payment);
  const dispatch = useDispatch();

  useEffect(() => {
    // dispatch(getPaymentUser())
  }, [dispatch])

  function formatSubscriptionDate(start, end) {
    const format = (date) => {
      const dateObj = new Date(date);
      const dayNum = dateObj.getDate().toString().padStart(2, "0");
      const monthStr = dateObj.toLocaleString("en-US", { month: "short" });
      const yearNum = dateObj.getFullYear();
      const timeStr = dateObj
        .toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        })
        .replace("AM", "am")
        .replace("PM", "pm");
      return `${dayNum} ${monthStr}, ${yearNum} (${timeStr})`;
    };

    return `${format(start)} to ${format(end)}`;
  }

  function getSubscriptionStatus(endDate) {
    const now = new Date();
    const end = new Date(endDate);
    return now <= end ? "Active" : "Expired";
  }

  return (
    <>
      <div className="space-y-6 inter-font">
        <div className="flex relative justify-between items-center bg-[#141414] border-[2px] border-[#fff]/20 rounded p-[8px] sm:p-[15px] gap-1 md:gap-4">
          <div className="flex items-center flex-wrap gap-2 sm:gap-4">
            <div className="relative md600:w-[100px] md600:h-[100px] sm:w-[80px] sm:h-[80px] w-[50px] h-[50px] rounded-full flex justify-center items-center" style={{ backgroundImage: "linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)" }}>
              {currentUser?.photo && currentUser?.photo !== "null" ? (
                <>
                  <img
                    // src={`${IMAGE_URL}${currentUser?.photo}`}
                    src={currentUser.photo.startsWith('/uploads/') ? `${IMAGE_URL}${currentUser.photo}` : currentUser.photo}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                  {/* <IoIosCamera className="absolute bottom-0 right-0 h-6 w-6 sm:h-8 sm:w-8 bg-black text-white p-1 rounded-full cursor-pointer" /> */}
                </>
              ) : (
                <div className="text-black text-xl md:text-3xl font-bold uppercase">
                 {decryptData(currentUser?.firstName)?.[0] || ""}
                 {decryptData(currentUser?.lastName)?.[0] || ""}
                </div>
              )}
            </div>
            <div>
              <h2 className="text-[16px] sm:text-[20px] md600:text-[22px] font-semibold text-white mb-[8px] sm:mb-[12px] capitalize">
              {decryptData(currentUser?.firstName)} {decryptData(currentUser?.lastName)}
              </h2>
              <div className="flex items-center text-xs md600:text-sm text-white/60 mb-[8px] line-clap-1">
                <IoIosMail className="mr-2 text-xl" />
                {decryptData( currentUser?.email)}
              </div>
              <div className="flex items-center text-xs md600:text-sm text-white/60 mt-1">
                <IoCall className="mr-2 text-xl" />
                {`+91 ${decryptData(currentUser?.phoneNo)}`}
              </div>
            </div>
          </div>
          <button onClick={onEditProfile}>
            <div className="sm:block hidden">
              <TfiAngleRight size={26} />
            </div>
            <div className="sm:hidden block absolute text-xl top-[45%] right-[3px] sm:right-[30px]">
              <TfiAngleRight />
            </div>
          </button>
        </div>

        {/* 👇 This is the subscription plan card */}
        <div>
          <h3 className="text-[18px] sm:text-[20px] text-white font-semibold mb-4">
            Current Plan
          </h3>
          {subscription.length > 0 ? (
            subscription.map((plan, index) => (
              <div
                key={index}
                className="bg-[#141414] border-[2px] border-white/20 rounded-lg p-[20px] mb-4"
              >
                <div className="flex justify-between items-start sm:items-center mb-[12px] gap-2">
                  <h4 className="text-white text-[18px] sm:text-[20px] font-medium">
                    {plan.PlanName} Plan
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-[2px] font-semibold ${getSubscriptionStatus(plan.endDate) === "Active" ? "text-green-700 bg-[#E7F4EE]" : "text-red-700 bg-[#FFE9E9]"
                      }`}
                  >
                    {getSubscriptionStatus(plan.endDate)}
                  </span>
                </div>
                <p className="text-sm text-white/60 font-light mb-2">
                  {
                    plan.planData.features.find(f => f.name === "Content")?.description
                    || plan.planData.features?.[0]?.description
                  }
                </p>
                <p className="text-sm text-white/60 font-light mb-2">
                  {formatSubscriptionDate(plan.startDate, plan.endDate)}
                </p>
                <div className="text-white text-[18px] sm:text-[20px] font-medium mt-4">
                  ${plan.planData.price}
                  <span className="text-[14px] text-white/60 font-normal">
                    /{plan.period}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-part flex flex-col justify-center items-center bg-[#141414] border-[2px] border-white/20 rounded-lg p-[20px]">
              <img
                // src={WatchlistEmpty}
                alt="Empty Watchlist"
                className="w-[80px] mb-2"
              />
              <p className="text-sm md:text-base text-white">
                Oops! You're not subscribed yet.
              </p>
              <button
                className="font-semibold rounded px-4 py-2 sm:px-6 sm:py-[10px] mt-4 text-white border-none cursor-pointer transition-[background-position] duration-400 ease-in-out text-sm sm:text-base flex items-center gap-2 sm:gap-3 duration-300 z-20 relative"
                style={{
                  background: 'linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)',
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'left center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}
                onClick={() => navigate("/premium")}
              >
                <span>Buy New Subscription</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isDesktop = UseMediaQuery("(min-width: 768px)");

  const currentUser = useSelector((state) => state.user.currUser);
  const pathToId = {
    "/profile": "my-profile",
    "/profile/edit-profile": "edit-profile",
    "/profile/watchlist": "watchlist",
    "/profile/subscription": "subscription",
    "/profile/device": "device",
    "/profile/password": "password",
    "/profile/twostep": "twostep",
    "/profile/parentalcontrol": "parentalcontrol",
    "/profile/watchHistory": "watchHistory",
    "/profile/delete": "delete",
    "/profile/logout": "logout",
  };

  const activeItem = pathToId[location.pathname] || "my-profile";

  const getActiveLabel = () => {
    if (activeItem === "edit-profile") return "Edit Profile";
    return (
      {
        "my-profile": "My Profile",
        watchlist: "My Watchlist",
        subscription: "My Subscription",
        device: "Logged Device",
        password: "Change Password",
        twostep: "Two Step Verification",
        parentalcontrol: "Parental Control",
        watchHistory: "watch history",
        delete: "Delete Account",
        logout: "Logout",
      }[activeItem] || ""
    );
  };

  return (
    <div className="bg-[#0f0f0f] text-white inter-font min-h-screen px-3 sm:px-6 py-4 pt-[75px] 3xl:pt-[100px]">
      <div className="flex flex-col md:flex-row mx-auto max-w-[1750px] pb-[26px]">
        <div className="sidebar">
          {isDesktop ? (
            <Sidebar1 activeItem={activeItem} />
          ) : (
            <Sidebar2 activeItem={activeItem} />
          )}
        </div>
        <main className="flex-1 overflow-auto">
          <div className="h-12 flex items-center text-base sm:text-lg text-white/40 mb-4">
            <Link to="/" className="hover:text-white">
              Home
            </Link>
            {activeItem === "edit-profile" && (
              <>
                <span className="mx-2">
                  <TfiAngleRight className="text-white/50" />
                </span>
                <span
                  onClick={() => navigate("/profile")}
                  className="hover:text-white cursor-pointer"
                >
                  My Profile
                </span>
              </>
            )}
            <span className="mx-2">
              <TfiAngleRight className="text-white/50" />
            </span>
            <span className="text-white">{getActiveLabel()}</span>
          </div>

          {/* ✅ Routes must be relative (no leading slashes) */}
          <Routes>
            <Route
              path=""
              element={
                <ProfileSection
                  currentUser={currentUser}
                  onEditProfile={() => navigate("edit-profile")}
                />
              }
            />
            {/* <Route path="edit-profile" element={<EditProfile />} />
            <Route path="watchlist" element={<MyWatchlist />} />
            <Route path="subscription" element={<MySubscription />} />
            <Route path="device" element={<LoggedDevice />} />
            <Route path="delete" element={<DeleteAccount />} />
            <Route path="twostep" element={<TwoStepVerification />} />
            <Route path="parentalcontrol" element={<ParentalControl />} />
            <Route path="watchHistory" element={<MyWatchHistory />} /> */}
          </Routes>
        </main>
      </div>
    </div>
  );
};

export default Profile;
