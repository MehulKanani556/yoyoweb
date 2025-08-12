import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { BiChevronLeft, BiChevronRight } from "react-icons/bi";

import { AiOutlineClose } from "react-icons/ai";
import { FaEye, FaEyeSlash, FaHistory, FaKey, FaSignOutAlt, FaTrash, FaUser } from "react-icons/fa";
import { LuEye, LuEyeClosed } from 'react-icons/lu';
import { useDispatch, useSelector } from "react-redux";
import { Formik } from "formik";
import { resetPassword } from "../Redux/Slice/auth.slice";
// import { logoutUser } from "../../Redux/Slice/auth.slice";
// import { getDeviceId } from "../../Utils/getDeviceId";


// Sidebar items
const sidebarItems = [
  { id: "my-profile", label: "My Profile",
    icon: <FaUser />,
     path: "" },
//   {
//     id: "watchlist",
//     label: "My Watchlist",
//     // icon: Watchlisticon,
//     path: "watchlist",
//   },
  {
    id: "orders",
    label: "Order History",
    icon: <FaHistory />,
    path: "orders",
  },
//   {
//     id: "watchHistory",
//     label: "watch history",
//     // icon: WatchHistory,
//     path: "watchHistory",
//   },
//   {
//     id: "device",
//     label: "Logged Device",
//     // icon: LoggedDeviceicon,
//     path: "device",
//   },
//   {
//     id: "parentalcontrol",
//     label: "Parental Control",
//     // icon: ParentalControl,
//     path: "parentalcontrol",
//   },

  {
    id: "password",
    label: "Change Password",
    icon: <FaKey />,
    path: "password",
  },
//   {
//     id: "twostep",
//     label: "Two Step Verification",
//     // icon: TwoStepVerification,
//     path: "twostep",
//   },
  {
    id: "delete",
    label: "Delete Account",
    icon: <FaTrash />,
    path: "delete",
  },
  { id: "logout", label: "Logout", 
    icon: <FaSignOutAlt />,
    path: "logout" },
];

// Sidebar for large screens
export const Sidebar1 = ({ activeItem }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currUser);
  const userId = localStorage.getItem('ottuserId');

  const handleSidebarClick = (id, path) => {
    if (id === "logout") {
      setShowLogoutModal(true);
    } else if (id === "password") {
      setShowChangePass(true);
    } else {
      navigate(`/profile/${path}`);
    }
  };
  //   LogOut code :
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/login");
  };
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  //   Change Password code :
  const [showChangePass, setShowChangePass] = useState(false);
  const confirmPassChange = () => {
    localStorage.clear();
    setShowChangePass(false);
    navigate("/password");
  };
  const CancelPassChange = () => {
    setShowChangePass(false);
  };

  const handleLogout = async () => {
    try {
     
      navigate("/")
      localStorage.clear();
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <aside className="w-full md:w-[250px] bg-[#141414] border-[2px] border-[#fff]/20 rounded-[8px] overflow-hidden mb-6 md:mb-0 md:mr-4 lg:mr-8">
        {sidebarItems.map(({ id, label, icon, path }) => (
          <div
            key={id}
            onClick={() => {
              handleSidebarClick(id, path);
            }}
            className={`cursor-pointer w-full flex items-center px-3 py-3 text-left text-sm transition-all duration-200 hover:bg-white/10 ${activeItem === id ||
              (id === "my-profile" && activeItem === "edit-profile")
              ? "bg-[#fff]/10 text-white border-b-[2px] border-white/60"
              : "text-gray-300 hover:text-white"
              }`}
          >
            <div className="border-[2px] border-white/25 p-[8px] rounded mr-[12px] bg-black">
            <span>{icon}</span>
            </div>
            {label}
          </div>
        ))}
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] rounded-[2px] p-[16px] sm:p-[24px] w-[90%] max-w-[400px] text-white shadow-lg">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h2 className="text-lg font-semibold">Log out</h2>
              <button
                onClick={cancelLogout}
                className="text-white hover:text-red-500 transition duration-200"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            </div>

            <p className="text-sm text-white/70 text-center my-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={cancelLogout}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-[4px]"
              >
                Cancel
              </button>
              {/* <button
                onClick={confirmLogout}
                className="w-full watch-play-btn text-white py-2 rounded-[4px]"
              >
                Yes, Logout
              </button> */}
              <button type="submit" 
              onClick={handleLogout} 
              className="w-full text-white py-2 bg-primary rounded-[4px] text-[14px] font-medium sm:py-3 border-none cursor-pointer transition-[background-position] duration-400 ease-in-out"
               
                onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password form */}
      {showChangePass && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141414] p-3 md:p-6 text-white w-[310px] sm:w-[400px]">
            <div className="flex justify-between items-center border-b-[1px] border-white/10 pb-[12px] mb-[12px]">
              <h1 className="text-lg font-semibold ">Change Password</h1>
              <button
                onClick={CancelPassChange}
                className="text-white hover:text-red-500 transition duration-200"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            </div>
            <Formik
              initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '', showOldPassword: false, showNewPassword: false, showConfirmNewPassword: false }}
              validate={values => {
                const errors = {};
                if (!values.oldPassword) {
                  errors.oldPassword = 'Required';
                }
                if (!values.newPassword) {
                  errors.newPassword = 'Required';
                } else if (values.newPassword.length < 6) {
                  errors.newPassword = 'Password must be at least 6 characters';
                } else if (values.newPassword !== values.confirmNewPassword) {
                  errors.confirmNewPassword = 'Password and Confirm Password not match';
                }
                return errors;
              }}
              onSubmit={(values) => {
                const { oldPassword, newPassword } = values;
                dispatch(resetPassword({ email: currentUser.email, oldPassword, newPassword })).then((response) => {
                  if (response.payload.success) {
                    setShowChangePass(false);
                  }
                });
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                <form onSubmit={handleSubmit} className="change-pass-form flex flex-col gap-4 p-[12px]">
                  {/* Current Password */}
                  <div className="w-full flex flex-col mb-[10px]">
                    <label
                      className="text-[13px] font-normal text-white/80 mb-[5px]"
                    >
                      Old password
                    </label>
                    <div className="relative">
                      <input
                        type={values.showOldPassword ? "text" : "password"}
                        placeholder="Old password"
                        name='oldPassword'
                        className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                        value={values.oldPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFieldValue('showOldPassword', !values.showOldPassword);
                        }}
                      >
                        {values.showOldPassword ? <LuEye /> : <LuEyeClosed />}
                      </div>
                      {errors.oldPassword && touched.oldPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.oldPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="w-full flex flex-col mb-[10px]">
                    <label
                      className="text-[13px] font-normal text-white/80 mb-[5px]"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={values.showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        name='newPassword'
                        className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                        value={values.newPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFieldValue('showNewPassword', !values.showNewPassword);
                        }}
                      >
                        {values.showNewPassword ? <LuEye /> : <LuEyeClosed />}
                      </div>
                      {errors.newPassword && touched.newPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="w-full flex flex-col mb-[10px]">
                    <label
                      className="text-[13px] font-normal text-white/80 mb-[5px]"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        type={values.showConfirmNewPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        name='confirmNewPassword'
                        className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                        value={values.confirmNewPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFieldValue('showConfirmNewPassword', !values.showConfirmNewPassword);
                        }}
                      >
                        {values.showConfirmNewPassword ? <LuEye /> : <LuEyeClosed />}
                      </div>
                      {errors.confirmNewPassword && touched.confirmNewPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-[10px] md:mt-[32px] gap-4">
                    <button
                      onClick={CancelPassChange}
                      className="bg-white/10 text-[14px] hover:bg-white/20 text-white py-2 rounded-[4px] w-48"
                    >
                      Cancel
                    </button>
                    {/* <button
                onClick={confirmPassChange}
                className="watch-play-btn text-[14px] text-white px-[32px] py-2 rounded-[4px]"
              >
                Change Password
              </button> */}
                    <button type="submit" className="text-[14px] bg-primary w-48 py-2 rounded-[4px] font-medium sm:py-3 text-white border-none cursor-pointer transition-[background-position] duration-400 ease-in-out"
                     
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}>
                      Change Password
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};

// Sidebar for mobile
export const Sidebar2 = ({ activeItem }) => {
  const scrollRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const currentUser = useSelector((state) => state.user.currUser);
  const userId = sessionStorage.getItem('userId');

  const handleSidebarClick = (id, path) => {
    if (id === "logout") {
      setShowLogoutModal(true);
    } else if (id === "password") {
      setShowChangePass(true);
    } else {
      navigate(`/profile/${path}`);
    }
  };

  // log Out code:
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const confirmLogout = () => {
    localStorage.clear();
    setShowLogoutModal(false);
    navigate("/login");
  };
  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  //   Change Password code :
  const [showChangePass, setShowChangePass] = useState(false);
  const confirmPassChange = () => {
    localStorage.clear();
    setShowChangePass(false);
    navigate("/password");
  };
  const CancelPassChange = () => {
    setShowChangePass(false);
  };

//   const handleLogout = async () => {
//     try {
//       console.log(userId);

//       if (userId) {
//         const deviceId = await getDeviceId()
//         const data = {
//           userId: userId,
//           deviceId: deviceId
//         }
//         console.log(data);

//         await dispatch(logoutUser(data));
//       }
//       navigate("/")
//       sessionStorage.removeItem("userId");
//       sessionStorage.removeItem("token");
//     } catch (error) {
//       console.log(error)
//     }
//   }

  // --- Scroll Button State ---
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Check scroll position to enable/disable buttons
  const checkScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  };

  // Attach scroll event
  React.useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener('scroll', checkScroll);
    window.addEventListener('resize', checkScroll);
    return () => {
      el.removeEventListener('scroll', checkScroll);
      window.removeEventListener('resize', checkScroll);
    };
  }, []);

  // Scroll handlers
  const scrollByAmount = 120; // px
  const handleScrollLeft = () => {
    scrollRef.current && scrollRef.current.scrollBy({ left: -scrollByAmount, behavior: 'smooth' });
  };
  const handleScrollRight = () => {
    scrollRef.current && scrollRef.current.scrollBy({ left: scrollByAmount, behavior: 'smooth' });
  };

  return (
    <>
      <aside className="relative md:w-[280px] w-full mb-6 md:mb-0 md:mr-8">
        <button
          type="button"
          aria-label="Scroll left"
          onClick={handleScrollLeft}
          disabled={!canScrollLeft}
          className={`absolute left-[-10px] top-[18%] z-10 rounded-full text-white transition-opacity duration-200 ${canScrollLeft ? 'opacity-100' : 'opacity-30 pointer-events-none'} md600:hidden`}
          style={{ display: canScrollLeft ? 'block' : 'none' }}
        >
          <BiChevronLeft size={24} />
        </button>
        <button
          type="button"
          aria-label="Scroll right"
          onClick={handleScrollRight}
          disabled={!canScrollRight}
          className={`absolute right-[-10px] top-[18%] z-10 rounded-full text-white transition-opacity duration-200 ${canScrollRight ? 'opacity-100' : 'opacity-30 pointer-events-none'} md600:hidden`}
          style={{ display: canScrollRight ? 'block' : 'none' }}
        >
          <BiChevronRight size={24} />
        </button>
        <div className="relative bg-[#141414] border-[2px] border-[#fff]/20 rounded-[8px] overflow-hidden mx-auto w-[90%]">
          {/* Scroll Buttons */}

          <div
            ref={scrollRef}
            className="flex md600:flex-col flex-row overflow-x-auto md600:overflow-visible scroll-smooth scrollbar-hide"
          >
            {sidebarItems.map(({ id, label, icon, path }) => (
              <button
                key={id}
                onClick={() => handleSidebarClick(id, path)}
                className={`flex items-center px-[12px] md600:px-5 py-[8px] md600:py-3 text-left text-sm transition-all duration-200 flex-shrink-0 ${activeItem === id ||
                  (id === "my-profile" && activeItem === "edit-profile")
                  ? "bg-[#fff]/10 text-white border-b-[2px] border-white/60"
                  : "text-gray-300 hover:text-white"
                  }`}
              >
                <div className="border-[2px] border-white/25 p-[6px] sm:p-[8px] rounded mr-[8px] sm:mr-[12px] bg-black hidden md600:block">
                  <img
                    src={icon}
                    alt={label}
                    className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                  />
                </div>
                {label}
              </button>
            ))}
          </div>
        </div>
      </aside>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#1e1e1e] rounded-[2px] p-[16px] sm:p-[24px] w-[90%] max-w-[400px] text-white shadow-lg">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h2 className="text-lg font-semibold">Log out</h2>
              <button
                onClick={cancelLogout}
                className="text-white hover:text-red-500 transition duration-200"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            </div>

            <p className="text-sm text-white/70 text-center my-6">
              Are you sure you want to logout?
            </p>

            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={cancelLogout}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-[4px]"
              >
                Cancel
              </button>
              {/* <button
                onClick={confirmLogout}
                className="w-full watch-play-btn text-white py-2 rounded-[4px]"
              >
                Yes, Logout
              </button> */}
              <button type="submit" 
            //   onClick={handleLogout} 
              className="w-full text-white py-2 rounded-[4px] text-[14px] font-medium sm:py-3 border-none cursor-pointer transition-[background-position] duration-400 ease-in-out"
                style={{
                  background: 'linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)',
                  backgroundSize: '200% 100%',
                  backgroundPosition: 'left center',
                }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}>
                Yes, Logout
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Password form */}
      {showChangePass && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-[#141414] p-3 md:p-6 text-white w-[310px] sm:w-[400px]">
            <div className="flex justify-between items-center border-b-[1px] border-white/10 pb-[12px] mb-[12px]">
              <h1 className="text-lg font-semibold ">Change Password</h1>
              <button
                onClick={CancelPassChange}
                className="text-white hover:text-red-500 transition duration-200"
              >
                <AiOutlineClose className="text-xl" />
              </button>
            </div>
            <Formik
              initialValues={{ oldPassword: '', newPassword: '', confirmNewPassword: '', showOldPassword: false, showNewPassword: false, showConfirmNewPassword: false }}
              validate={values => {
                const errors = {};
                if (!values.oldPassword) {
                  errors.oldPassword = 'Required';
                }
                if (!values.newPassword) {
                  errors.newPassword = 'Required';
                } else if (values.newPassword.length < 6) {
                  errors.newPassword = 'Password must be at least 6 characters';
                } else if (values.newPassword !== values.confirmNewPassword) {
                  errors.confirmNewPassword = 'Password and Confirm Password not match';
                }
                return errors;
              }}
              onSubmit={(values) => {
                const { oldPassword, newPassword } = values;
                dispatch(resetPassword({ email: currentUser.email, oldPassword, newPassword })).then((response) => {
                  if (response.payload.success) {
                    setShowChangePass(false);
                  }
                });
              }}
            >
              {({ handleChange, handleSubmit, values, errors, touched, setFieldValue }) => (
                <form onSubmit={handleSubmit} className="change-pass-form flex flex-col gap-4 p-0 sm:p-[12px]">
                  {/* Current Password */}
                  <div className="w-full flex flex-col mb-[10px]">
                    <label
                      className="text-[13px] font-normal text-white/80 mb-[5px]"
                    >
                      Old password
                    </label>
                    <div className="relative">
                      <input
                        type={values.showOldPassword ? "text" : "password"}
                        placeholder="Old password"
                        name='oldPassword'
                        className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                        value={values.oldPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFieldValue('showOldPassword', !values.showOldPassword);
                        }}
                      >
                        {values.showOldPassword ? <LuEye /> : <LuEyeClosed />}
                      </div>
                      {errors.oldPassword && touched.oldPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.oldPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* New Password */}
                  <div className="w-full flex flex-col mb-[10px]">
                    <label
                      className="text-[13px] font-normal text-white/80 mb-[5px]"
                    >
                      New Password
                    </label>
                    <div className="relative">
                      <input
                        type={values.showNewPassword ? "text" : "password"}
                        placeholder="New Password"
                        name='newPassword'
                        className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                        value={values.newPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFieldValue('showNewPassword', !values.showNewPassword);
                        }}
                      >
                        {values.showNewPassword ? <LuEye /> : <LuEyeClosed />}
                      </div>
                      {errors.newPassword && touched.newPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.newPassword}</div>
                      )}
                    </div>
                  </div>

                  {/* Confirm New Password */}
                  <div className="w-full flex flex-col mb-[10px]">
                    <label
                      className="text-[13px] font-normal text-white/80 mb-[5px]"
                    >
                      Confirm password
                    </label>
                    <div className="relative">
                      <input
                        type={values.showConfirmNewPassword ? "text" : "password"}
                        placeholder="Confirm password"
                        name='confirmNewPassword'
                        className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                        value={values.confirmNewPassword}
                        onChange={handleChange}
                      />
                      <div
                        className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                        onMouseDown={(e) => {
                          e.preventDefault();
                          setFieldValue('showConfirmNewPassword', !values.showConfirmNewPassword);
                        }}
                      >
                        {values.showConfirmNewPassword ? <LuEye /> : <LuEyeClosed />}
                      </div>
                      {errors.confirmNewPassword && touched.confirmNewPassword && (
                        <div className="text-red-500 text-sm mt-1">{errors.confirmNewPassword}</div>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-between mt-[10px] md:mt-[32px] gap-4">
                    <button
                      onClick={CancelPassChange}
                      className="bg-white/10 text-[14px] hover:bg-white/20 text-white py-2 rounded-[4px] w-48"
                    >
                      Cancel
                    </button>
                    {/* <button
                onClick={confirmPassChange}
                className="watch-play-btn text-[14px] text-white px-[32px] py-2 rounded-[4px]"
              >
                Change Password
              </button> */}
                    <button type="submit" className="text-[14px] w-48 py-2 rounded-[4px] font-medium sm:py-3 text-white border-none cursor-pointer transition-[background-position] duration-400 ease-in-out"
                      style={{
                        background: 'linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)',
                        backgroundSize: '200% 100%',
                        backgroundPosition: 'left center',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.backgroundPosition = 'right center')}
                      onMouseLeave={(e) => (e.currentTarget.style.backgroundPosition = 'left center')}>
                      Change Password
                    </button>
                  </div>
                </form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </>
  );
};
