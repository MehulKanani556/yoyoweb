import * as React from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import { AiFillHome, AiOutlineClose } from "react-icons/ai";
import { FaUser, FaQuestion, FaExchangeAlt, FaAd, } from "react-icons/fa";
import { BiCameraMovie, BiSolidCategory, BiSolidVideo } from "react-icons/bi";
import { FaList } from "react-icons/fa6";
import { BsFillBoxSeamFill } from "react-icons/bs";
import { CgArrowsShrinkH } from "react-icons/cg";
import { BsBoxFill } from "react-icons/bs";
import { LuBoxes, LuCookie, LuEye, LuEyeClosed } from "react-icons/lu";
import { RiFileTextLine } from "react-icons/ri";
import { TbMessageStar, TbPremiumRights } from "react-icons/tb";
import { BiSolidOffer } from "react-icons/bi";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaReceipt } from "react-icons/fa6";
import { MdRecentActors } from "react-icons/md";
import { useNavigate, useLocation } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import { Modal } from '@mui/material';
import { useState, useEffect, useRef, useMemo } from 'react';
import { FaAngleDown, FaAngleUp } from "react-icons/fa";
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { getUserById } from '../Redux/Slice/user.slice';
import { HiOutlineShieldCheck } from 'react-icons/hi2';
import { IMAGE_URL } from '../Utils/baseUrl';
import { resetPassword } from "../Redux/Slice/user.slice";
import { logoutUser } from '../Redux/Slice/auth.slice';
import { decryptData } from '../Utils/encryption';
// import { logout } from '../reduxe/slice/auth.slice';
// import { setSearchValue } from '../reduxe/slice/search.slice';

const drawerWidth = 250;

function Layout({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const userId = localStorage.getItem('ottuserId');
  const role =  useSelector(state => state.auth.user?.role) || localStorage.getItem('role') ;
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const user = useSelector((state) => state.user.currUser)
  const [openProfile, setOpenProfile] = useState(false);
  const [editProfile, setEditProfile] = useState(false);
  const [openPassword, setOpenPassword] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const userdata =  useSelector(state => state.auth.user)
 

  // console.log(userdata);

  // Memoize the user data
  const memoizedUser = useMemo(() => user, [user]);

  useEffect(() => {
    if (userId) {
      dispatch(getUserById(userId))
    }
  }, [userId])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleDrawerClose = () => {
    setIsClosing(true);
    setMobileOpen(false);
  };

  const handleDrawerTransitionEnd = () => {
    setIsClosing(false);
  };

  const handleDrawerToggle = () => {
    if (!isClosing) {
      setMobileOpen(!mobileOpen);
    }
  };

  const handleSubmenuToggle = (title) => {
    setOpenSubmenu(openSubmenu === title ? null : title);
  };


  const handleLogout = async () => {
    try { 
      if (userId) {
        const data = {
          userId:userId,
          
        }     
        await dispatch(logoutUser(data));
      }
      navigate("/")
      sessionStorage.removeItem("userId");
      sessionStorage.removeItem("token");
    } catch (error) {
      console.log(error)
    }
  }

  const pages = [
    { title: 'Dashboard', icon: <AiFillHome />, path: '/admin' },

    { title: 'Category', icon: <BiSolidCategory />, path: '/admin/category' },
    { title: 'Movies', icon: <BiCameraMovie />, path: '/admin/movies' },
    { title: 'User', icon: <FaUser />, path: '/admin/user' },
    { title: 'Actors', icon: <MdRecentActors />, path: '/admin/actors' },
    { title: 'Episodes', icon: <BiSolidVideo />, path: '/admin/episodes' },
    { title: 'Terms and Conditions', icon: <RiFileTextLine />, path: '/admin/Terms-Conditions' },
    { title: 'Privacy Policy', icon: <HiOutlineShieldCheck />, path: '/admin/Privacy-Policy' },
    { title: 'Cookie Policy', icon: <LuCookie />, path: '/admin/Cookie-Policy' },
    { title: 'Premium', icon: <TbPremiumRights />, path: '/admin/premium' },
    { title: 'Faq', icon: <FaQuestion />, path: '/admin/faq' },
    { title: 'Transaction', icon: <FaExchangeAlt />, path: '/admin/transaction' },
    { title: 'Ads', icon: <FaAd />, path: '/admin/ads' },
  ]
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    phone: Yup.string().required('Mobile No. is required'),
    gender: Yup.string().required('Gender is required'),
    dob: Yup.date().required('D.O.B is required').max(new Date().toISOString().split('T')[0], 'D.O.B cannot be in the future'),
  });

  const drawer = (
    // scrollbar-hide overflow-y-auto
    <div className='relative' style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Toolbar>
        <div className='w-full'>
          <h1 className='text-center text-white/50 font-semibold text-3xl'>LOGO</h1>
        </div>
      </Toolbar>
      <Divider />
      <List className='gap-1 flex flex-col grow'>
        {pages.map((v) => (
          <div key={v.title}>
            <ListItem disablePadding
            //  sx={{ paddingLeft: '20px', paddingRight: '20px' }}
            >
              <ListItemButton
                onClick={() => {
                  if (v.subItems) {
                    handleSubmenuToggle(v.title);
                  } else {
                    navigate(v.path);
                    if (window && window.innerWidth < 900) {
                      setMobileOpen(false);
                    }
                  }
                }}
                sx={{
                  gap: '4px',
                  background: location.pathname == (v.path)
                    ? 'linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)'
                    : 'transparent',
                  backgroundSize: location.pathname == (v.path) ? '200% 100%' : 'auto',
                  backgroundPosition: location.pathname == (v.path) ? 'left center' : 'auto',
                  color: location.pathname == (v.path) ? 'white' : "gray",
                  // borderRadius: '10px',
                  transition: 'background-position 0.4s ease-in-out',
                  '&:hover': {
                    background: 'linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)',
                    backgroundSize: '200% 100%',
                    backgroundPosition: 'right center',
                    color: 'white',
                    '& .MuiSvgIcon-root': {
                      color: 'white',
                    },
                    '& .icon': {
                      color: 'white',
                      background: '#0097ff',
                      '& .MuiSvgIcon-root': {
                        color: 'white',
                      },
                      '& .icon': {
                        color: 'white',
                      }
                    }
                  }
                }}

                onMouseEnter={(e) => {
                  if (location.pathname == (v.path)) {
                    e.currentTarget.style.backgroundPosition = 'right center';
                  }
                }}
                onMouseLeave={(e) => {
                  if (location.pathname == (v.path)) {
                    e.currentTarget.style.backgroundPosition = 'left center';
                  }
                }}
              >
                <ListItemIcon
                  className="icon"
                  sx={{
                    color: 'white',
                    fontSize: '15px',
                    minWidth: '25px',
                    padding: '10px',
                    position: 'relative',
                    borderRadius: '4px',
                    backgroundColor: location.pathname == (v.path) ? '#0097ff' : 'transparent',
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      borderRadius: '4px',
                      padding: '1px',
                      background: location.pathname !== v.title && 'linear-gradient(0deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.1)),linear-gradient(180deg, #FFFFFF 0%, rgba(255, 255, 255, 0) 100%)',
                      WebkitMask: location.pathname !== v.title && 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      WebkitMaskComposite: location.pathname !== v.title && 'xor',
                      maskComposite: location.pathname !== v.title && 'exclude',
                      opacity: location.pathname == (v.path) ? 0 : 0.3,
                      transition: 'opacity 0.3s ease'
                    },
                  }}>
                  {v.icon}
                </ListItemIcon>
                <ListItemText primary={v.title} sx={{ fontSize: '18px', fontWeight: 500, whiteSpace: 'nowrap' }} />
                {v.dot && <span style={{ color: 'red', marginLeft: '5px' }}>•</span>}
                {v.subItems && openSubmenu === v.title ? <FaAngleUp /> : v.dropdownIcon}
              </ListItemButton>
            </ListItem>
            {v.subItems && openSubmenu === v.title && v.subItems.map(subItem => (
              <ListItem key={subItem.title} disablePadding sx={{ paddingLeft: '40px' }}>
                <ListItemButton
                  sx={{
                    backgroundColor: location.pathname == (subItem.path) ? '#FFF9F6' : 'transparent',
                    color: location.pathname == (subItem.path) ? '#523C34' : 'white',
                    borderRadius: '10px',
                    fontSize: '10px',
                    paddingTop: '5px',
                    paddingBottom: '5px',
                    marginTop: '7px',
                    '&:hover': {
                      backgroundColor: '#FFF9F6',
                      color: '#523C34',
                    }
                  }}
                  onClick={() => {
                    navigate(subItem.path);
                    if (window && window.innerWidth < 900) {
                      setMobileOpen(false);
                    }
                  }}
                >
                  <span style={{ margin: '5px' }}>•</span>
                  <ListItemText primary={subItem.title} sx={{ fontSize: '14px', fontWeight: 400 }} />
                </ListItemButton>
              </ListItem>
            ))}
          </div>
        ))}
      </List>
      <div
        // style={{ padding: '20px' }}
        className='w-full mb-5'>
        <button
          onClick={() => { setShowLogoutModal(true) }}
          className="w-full py-2 font-semibold text-white"
          style={{
            background: 'linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)',
            backgroundSize: '200% 100%',
            backgroundPosition: 'left center',
            transition: 'background-position 0.4s ease-in-out',
            border: 'none',
            outline: 'none',
            cursor: 'pointer'
          }}
          onMouseEnter={e => e.currentTarget.style.backgroundPosition = 'right center'}
          onMouseLeave={e => e.currentTarget.style.backgroundPosition = 'left center'}
        >
          Logout
        </button>
      </div>
    </div>
  );

  // Remove this const when copying and pasting into your project.
  const container = typeof window !== 'undefined' ? () => window.document.body : undefined;

  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleSearchChange = (event) => {
    // dispatch(setSearchValue(event.target.value));
  };

  const handleListItemClick = (item, path) => {
    if (item?.subItems) {
      handleSubmenuToggle(item.title, path);
    } else {
      navigate(path);
      if (window && window.innerWidth < 900) {
        setMobileOpen(false);
      }
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { md: `calc(100% - ${drawerWidth}px)` },
          ml: { md: `${drawerWidth}px` },
          backgroundColor: "#0f0f0f",
          color: "#fffff",
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <div className="flex justify-between w-full">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                position: "relative",
              }}
            >
              {/* <SearchIcon sx={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'text.brown' }} />
              <input
                type="search"
                placeholder="Search..."
                onChange={handleSearchChange}
                style={{
                  padding: '8px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  marginRight: '8px',
                  paddingLeft: '40px',
                  width: '100%'
                }}
              /> */}
            </Box>
            <Box
              sx={{ display: "flex", alignItems: "center" }}
              className="gap-4 me-4"
            >
              <div color="inherit" sx={{ ml: 2 }} className="relative">
                <div
                  className="flex gap-2 items-center"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center">
                    {user?.photo && user?.photo !== "null" ? (
                      <img
                        src={
                          user.photo.startsWith("/uploads/")
                            ? `${IMAGE_URL}${user.photo}`
                            : user.photo
                        }
                        alt="Profile"
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span
                        className="text-xl font-bold uppercase bg-clip-text text-transparent"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, #00C6FF 0%, #0072FF 100%)",
                        }}
                      >
                        {decryptData(user?.firstName)?.[0] || ""}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <div
                      style={{ fontSize: "16px", fontWeight: 500 }}
                      className="capitalize"
                    >                      
                      {decryptData(memoizedUser?.name)}
                    </div>
                    <div
                      style={{ fontSize: "14px" }}
                      className="capitalize flex items-center gap-1 text-brown-50"
                    >
                      <span>
                      {decryptData(user?.firstName)} {decryptData(user?.lastName)}
                        </span>
                      <span>
                        {dropdownOpen ? <FaAngleUp /> : <FaAngleDown />}
                      </span>
                    </div>
                  </div>
                </div>
                {dropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className={`dropdown-content bg-[#2e2e2e] ${dropdownOpen ? "fade-in scale-in" : "fade-out scale-out"
                      }`}
                    style={{
                      position: "absolute",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      borderRadius: "4px",
                      zIndex: 1000,
                      right: 0,
                    }}
                  >
                    <div
                      style={{ padding: "10px", cursor: "pointer", transition: "background-color 0.3s ease-in-out" }}
                      className="text-nowrap hover:bg-[#3e3e3e] hover:text-[#0072ff] "
                      onClick={() => {
                        navigate("/admin/profile");
                      }}
                    >
                      Profile
                    </div>
                    <div
                      style={{ padding: "10px", cursor: "pointer", transition: "background-color 0.3s ease-in-out" }}
                      className="text-nowrap hover:bg-[#3e3e3e] hover:text-[#0072ff]"
                      onClick={() => setOpenPassword(true)}
                    >
                      Change Password
                    </div>
                    <div
                      style={{ padding: "10px", cursor: "pointer", transition: "background-color 0.3s ease-in-out" }}
                      className="text-nowrap hover:bg-[#3e3e3e] hover:text-red-500"
                      onClick={() => { setShowLogoutModal(true) }}
                    >
                      Logout
                    </div>
                  </div>
                )}
                {/* Change Password */}
                <Modal
                  open={openPassword}
                  onClose={() => setOpenPassword(false)}
                  className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
                >
                  <div className="bg-[#141414] p-3 md:p-6 text-white w-[310px] sm:w-[400px]">
                    <div className="flex justify-between items-center border-b-[1px] border-white/10 pb-[12px] mb-[12px]">
                      <h1 className="text-lg font-semibold ">
                        Change Password
                      </h1>
                      <button
                        onClick={() => setOpenPassword(false)}
                        className="text-white hover:text-red-500 transition duration-200"
                      >
                        <AiOutlineClose className="text-xl" />
                      </button>
                    </div>
                    <Formik
                      initialValues={{
                        oldPassword: "",
                        newPassword: "",
                        confirmNewPassword: "",
                        showOldPassword: false,
                        showNewPassword: false,
                        showConfirmNewPassword: false,
                      }}
                      validate={(values) => {
                        const errors = {};
                        if (!values.oldPassword) {
                          errors.oldPassword = "Required";
                        }
                        if (!values.newPassword) {
                          errors.newPassword = "Required";
                        } else if (values.newPassword.length < 6) {
                          errors.newPassword =
                            "Password must be at least 6 characters";
                        } else if (
                          values.newPassword !== values.confirmNewPassword
                        ) {
                          errors.confirmNewPassword =
                            "Password and Confirm Password not match";
                        }
                        return errors;
                      }}
                      onSubmit={(values) => {
                        const { oldPassword, newPassword } = values;
                        dispatch(
                          resetPassword({
                            email: user.email,
                            oldPassword,
                            newPassword,
                          })
                        ).then((response) => {
                          if (response.payload.success) {
                            setOpenPassword(false);
                          }
                        });
                      }}
                    >
                      {({
                        handleChange,
                        handleSubmit,
                        values,
                        errors,
                        touched,
                        setFieldValue,
                      }) => (
                        <form
                          onSubmit={handleSubmit}
                          className="change-pass-form flex flex-col gap-4 p-[12px]"
                        >
                          {/* Current Password */}
                          <div className="w-full flex flex-col mb-[10px]">
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                              Old password
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  values.showOldPassword ? "text" : "password"
                                }
                                placeholder="Old password"
                                name="oldPassword"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                                value={values.oldPassword}
                                onChange={handleChange}
                              />
                              <div
                                className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setFieldValue(
                                    "showOldPassword",
                                    !values.showOldPassword
                                  );
                                }}
                              >
                                {values.showOldPassword ? (
                                  <LuEye />
                                ) : (
                                  <LuEyeClosed />
                                )}
                              </div>
                              {errors.oldPassword && touched.oldPassword && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.oldPassword}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* New Password */}
                          <div className="w-full flex flex-col mb-[10px]">
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                              New Password
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  values.showNewPassword ? "text" : "password"
                                }
                                placeholder="New Password"
                                name="newPassword"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                                value={values.newPassword}
                                onChange={handleChange}
                              />
                              <div
                                className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setFieldValue(
                                    "showNewPassword",
                                    !values.showNewPassword
                                  );
                                }}
                              >
                                {values.showNewPassword ? (
                                  <LuEye />
                                ) : (
                                  <LuEyeClosed />
                                )}
                              </div>
                              {errors.newPassword && touched.newPassword && (
                                <div className="text-red-500 text-sm mt-1">
                                  {errors.newPassword}
                                </div>
                              )}
                            </div>
                          </div>

                          {/* Confirm New Password */}
                          <div className="w-full flex flex-col mb-[10px]">
                            <label className="text-[13px] font-normal text-white/80 mb-[5px]">
                              Confirm password
                            </label>
                            <div className="relative">
                              <input
                                type={
                                  values.showConfirmNewPassword
                                    ? "text"
                                    : "password"
                                }
                                placeholder="Confirm password"
                                name="confirmNewPassword"
                                className="w-full bg-[#232323] text-[13px] text-white p-2 rounded j_input_field"
                                value={values.confirmNewPassword}
                                onChange={handleChange}
                              />
                              <div
                                className="absolute right-3 top-3 cursor-pointer select-none text-white/60"
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  setFieldValue(
                                    "showConfirmNewPassword",
                                    !values.showConfirmNewPassword
                                  );
                                }}
                              >
                                {values.showConfirmNewPassword ? (
                                  <LuEye />
                                ) : (
                                  <LuEyeClosed />
                                )}
                              </div>
                              {errors.confirmNewPassword &&
                                touched.confirmNewPassword && (
                                  <div className="text-red-500 text-sm mt-1">
                                    {errors.confirmNewPassword}
                                  </div>
                                )}
                            </div>
                          </div>

                          <div className="flex justify-between mt-[10px] md:mt-[32px] gap-4">
                            <button
                              onClick={() => setOpenPassword(false)}
                              className="bg-white/10 text-[14px] hover:bg-white/20 text-white py-2 rounded-[4px] w-48"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="text-[14px] w-48 py-2 rounded-[4px] font-medium sm:py-3 text-white border-none cursor-pointer transition-[background-position] duration-400 ease-in-out"
                              style={{
                                background:
                                  "linear-gradient(to right, #00c6ff, #0072ff, #00c6ff)",
                                backgroundSize: "200% 100%",
                                backgroundPosition: "left center",
                              }}
                              onMouseEnter={(e) =>
                              (e.currentTarget.style.backgroundPosition =
                                "right center")
                              }
                              onMouseLeave={(e) =>
                              (e.currentTarget.style.backgroundPosition =
                                "left center")
                              }
                            >
                              Change Password
                            </button>
                          </div>
                        </form>
                      )}
                    </Formik>
                  </div>
                </Modal>
              </div>
            </Box>
          </div>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
        aria-label="mailbox folders"
      >
        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
        <Drawer
          container={container}
          variant="temporary"
          open={mobileOpen}
          onTransitionEnd={handleDrawerTransitionEnd}
          onClose={handleDrawerClose}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: "block", md: "none" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // borderRight: '1px solid #4b4b4b'
            },
          }}
          className="[&_.MuiDrawer-paper]:bg-primary-dark"
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          className="[&_.MuiDrawer-paper]:bg-primary-dark"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              // borderRight: '1px solid #4b4b4b'
              // background: 'primary.Dark',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        className="j_sidebar_width"
        sx={{
          flexGrow: 1,
          minHeight: "100vh",
          color: "whitesmoke",
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: "#090909",
        }}
      >
        <Toolbar />
        {children}
      </Box>

      {/* Logout Confirmation Modal */}
      <Modal
        open={showLogoutModal}
        onClose={() => { setShowLogoutModal(false) }}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      >
        <div className="bg-[#1e1e1e] rounded-[2px] p-[16px] sm:p-[24px] w-[90%] max-w-[400px] text-white shadow-lg">
          <div className="flex justify-between items-center border-b border-white/10 pb-3">
            <h2 id="modal-modal-title" className="text-lg font-semibold">Log out</h2>
            <button
              onClick={() => setShowLogoutModal(false)}
              className="text-white hover:text-red-500 transition duration-200"
            >
              <AiOutlineClose className="text-xl" />
            </button>
          </div>

          <p id="modal-modal-description" className="text-sm text-white/70 text-center my-6">
            Are you sure you want to logout?
          </p>

          <div className="flex justify-between gap-4 mt-4">
            <button
              onClick={() => setShowLogoutModal(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-2 rounded-[4px]"
            >
              Cancel
            </button>
            <button type="submit" onClick={() => { setShowLogoutModal(false); handleLogout(); }} className="w-full text-white py-2 rounded-[4px] text-[14px] font-medium sm:py-3 border-none cursor-pointer transition-[background-position] duration-400 ease-in-out"
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
      </Modal>
    </Box>
  );
}

Layout.propTypes = {
  /**
   * Injected by the documentation to work in an iframe.
   * Remove this when copying and pasting into your project.
   */
  window: PropTypes.func,
};

export default Layout;
