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
import { apply } from "slate";
import EditProfile from "./EditProfile";
import { getUserById } from "../Redux/Slice/user.slice";
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
        <div className="bg-[#141414] border-[2px] border-[#fff]/20 rounded p-[8px] sm:p-[15px] gap-1 md:gap-4">
          <EditProfile />
        </div>


      </div>
    </>
  )
};

const Profile = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
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
  useEffect (()=>{
    dispatch(getUserById(localStorage.getItem('yoyouserId')))
  },[dispatch])


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
