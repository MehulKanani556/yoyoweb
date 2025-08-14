import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser, FaShoppingCart } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { decryptData } from '../Utils/encryption';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../Redux/Slice/user.slice';
import { Modal } from '@mui/material';
import { logoutUser } from '../Redux/Slice/auth.slice';
import { AiOutlineClose } from 'react-icons/ai';
import { MdLogout } from "react-icons/md";
const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [cartCount, setCartCount] = useState(0);
    const [isScrolled, setIsScrolled] = useState(false);
    const navItems = [
        { name: 'Home', path: '/' },
        { name: 'Games', path: '/games' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
        { name: 'Blog', path: '/blog' },
    ];
    const userId = localStorage.getItem('yoyouserId');
    const token = localStorage.getItem('yoyoToken');
    const currentUser = useSelector((state) => state.user.currUser);
    const dropdownRef = useRef(null);

    useEffect(() => {
        dispatch(getUserById(userId))
    }, [dispatch, userId])
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setProfileDropdownOpen(false);
            }
        }
        if (profileDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [profileDropdownOpen]);

    // Cart count: fetch from backend and listen to updates from Redux store
    const cartItems = useSelector((state) => state.cart?.items || []);
    useEffect(() => {
        if (!(userId && token)) {
            setCartCount(0);
            return;
        }
        const count = Array.isArray(cartItems) ? cartItems.reduce((sum, it) => sum + (it?.qty || 1), 0) : 0;
        setCartCount(count);
    }, [userId, token, cartItems]);

    // Prevent background scroll when the mobile menu is open
    useEffect(() => {
        if (isMenuOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => {
            document.body.style.overflow = '';
        };
    }, [isMenuOpen]);

    // Close menus with Escape key
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                setIsMenuOpen(false);
                setProfileDropdownOpen(false);
                setShowLogoutModal(false);
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    // Detect scroll to toggle background width
    useEffect(() => {
        const handleScroll = () => setIsScrolled(window.scrollY > 0);
        handleScroll();
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleProfileNavigation = () => {
        setProfileDropdownOpen(false);
        // Small delay to allow exit animation to complete
        setTimeout(() => {
            navigate("/profile");
            setProfileDropdownOpen(false);
        }, 200);
    };

    const handleLogout = async () => {
        if (userId) {
            await dispatch(logoutUser(userId));
        }
        localStorage.removeItem("yoyouserId");
        localStorage.removeItem("yoyoToken");
        localStorage.removeItem("role");
        navigate("/")
    }

    return (
        <header className="fixed top-0 left-0 right-0 z-50 text-white bg-transparent ">
            {/* <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r z-50 from-purple-500 via-fuchsia-500 to-indigo-500" /> */}
            <div className="relative">
                <div className={`absolute inset-y-0 left-1/2 -translate-x-1/2  bg-white/5 border border-white/10 backdrop-blur shadow-[0_10px_30px_rgba(0,0,0,0.25)] transition-all duration-500 ease-in-out ${isScrolled ? 'w-screen' : 'w-[95%] sm:w-[92%] md:w-[90%] lg:w-[80%] rounded-2xl'}`}></div>
                <div className={`mx-auto w-[95%] sm:w-[92%] md:w-[90%] lg:max-w-[80%] flex justify-between items-center py-2 px-3 md:px-4 relative z-10 `}>
                    {/* Logo */}
                    <motion.div
                        onClick={() => { navigate('/') }}
                        initial={{ opacity: 0, y: -30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        className="text-2xl sm:text-3xl font-bold tracking-widest cursor-pointer bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent"
                    >
                        YOYO
                    </motion.div>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex space-x-2 lg:space-x-3">
                        {navItems.map((item) => (
                            <motion.div
                                key={item.path}
                                whileHover={{ scale: 1.05 }}
                                className="relative text-gray-200 transition-all duration-300 hover:text-white group px-2 lg:px-3 py-2 rounded-lg hover:bg-white/5"
                            >
                                <NavLink
                                    to={item.path}
                                    end={item.path === '/'}
                                    className={({ isActive }) => `block ${isActive ? 'text-purple-400' : ''}`}
                                >
                                    {({ isActive }) => (
                                        <>
                                            {item.name}
                                            <span className={`absolute left-1/2 -bottom-2 h-1 w-1 rounded-full bg-purple-400 -translate-x-1/2 transition-all duration-300 ${isActive ? 'scale-100 opacity-100' : 'scale-0 opacity-0 group-hover:scale-100 group-hover:opacity-100'}`} />
                                        </>
                                    )}
                                </NavLink>
                            </motion.div>
                        ))}
                    </nav>

                    {/* Desktop Right Actions */}
                    <div className="hidden md:flex items-center gap-3">
                        {userId && token && (
                            <button onClick={() => navigate('/cart')} aria-label="Cart" className="relative w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/40 flex items-center justify-center text-gray-200 hover:text-purple-400 transition-colors group hover:border-purple-400">
                                <FaShoppingCart size={16} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-[10px] leading-4 rounded-full flex items-center justify-center text-white font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                        {userId && token ? (
                            <motion.div
                                className="flex relative cursor-pointer text-gray-200 hover:text-purple-400 transition-all duration-300 items-center gap-1 group"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                                ref={dropdownRef}
                            >
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center">
                                    {currentUser?.photo && currentUser?.photo !== "null" ? (
                                        <img
                                            src={currentUser.photo}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            className="text-base w-8 h-8 sm:w-9 sm:h-9 font-bold uppercase border-2 rounded-full flex justify-center items-center border-white/40 group-hover:border-purple-400"
                                        >
                                            {decryptData(currentUser?.userName)?.split(" ").map(name => name[0]?.toUpperCase())?.join("") || ""}
                                        </span>
                                    )}
                                </div>
                                {currentUser && (
                                    <span
                                        className="hidden md600:block font-medium capitalize transition-colors cursor-pointer max-w-[140px] truncate"
                                    >
                                        {decryptData(currentUser?.userName)}
                                    </span>
                                )}
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />

                                {/* Profile dropdown with AnimatePresence for exit animations */}
                                <AnimatePresence>
                                    {profileDropdownOpen && (
                                        <motion.div
                                            className="absolute top-[43px] right-0 mt-2 w-44 bg-[#18181b] rounded-xl shadow-lg z-50 border border-white/10"
                                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: 40, scale: 0.9 }}
                                            transition={{
                                                duration: 0.2,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <button
                                                className="w-full text-left px-4 py-2 flex gap-2 items-center hover:bg-white/5 text-gray-200 hover:text-purple-400 transition-colors"
                                                onClick={() => { handleProfileNavigation(); setProfileDropdownOpen(false) }}
                                            >
                                                <div>
                                                    <FaUser />
                                                </div>
                                                <div>
                                                    Profile
                                                </div>
                                            </button>
                                            <button
                                                className="w-full text-left px-4 py-2 flex gap-1 items-center hover:bg-white/5 text-gray-200 border-t border-white/10 hover:text-red-500 transition-colors"
                                                onClick={() => {
                                                    setProfileDropdownOpen(false);
                                                    setShowLogoutModal(true);

                                                }}
                                            >
                                                <div className='text-xl'>
                                                    <MdLogout />
                                                </div>
                                                <div>
                                                    Logout
                                                </div>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

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
                                                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 ease-in-out rounded-[4px] transition-all duration-300"
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" onClick={() => { setShowLogoutModal(false); handleLogout(); }} className="w-full text-white py-2 rounded-[4px] text-[14px] font-medium sm:py-3 bg-white/30 hover:bg-white/40 border-none cursor-pointer transition-all duration-400 ease-in-out"
                                            >
                                                Yes, Logout
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </motion.div>
                        ) : (
                            <motion.div
                                onClick={() => { navigate('/login') }}
                                className="flex relative gap-1 items-center cursor-pointer text-gray-200 transition-all duration-300 hover:text-purple-400 group"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border-2 border-white/40 flex items-center justify-center transition-colors group-hover:border-purple-400">
                                    <FaUser size={16} />
                                </div>
                                <span
                                    className="transition-colors cursor-pointer font-medium"
                                >
                                    Sign in
                                </span>
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                            </motion.div>
                        )}
                    </div>

                    {/* Mobile Actions: cart first, then profile/sign-in, then hamburger */}
                    <div className="md:hidden flex items-center gap-3">
                        {userId && token && (
                            <button onClick={() => navigate('/cart')} aria-label="Cart" className="relative w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center text-gray-200 hover:text-purple-400 transition-colors group hover:border-purple-400">
                                <FaShoppingCart size={16} />
                                {cartCount > 0 && (
                                    <span className="absolute -top-1 -right-1 min-w-[16px] h-4 px-1 bg-red-500 text-[10px] leading-4 rounded-full flex items-center justify-center text-white font-bold">
                                        {cartCount}
                                    </span>
                                )}
                            </button>
                        )}
                        {userId && token ? (
                            <motion.div
                                className="relative cursor-pointer flex text-gray-200 hover:text-purple-400 transition-all duration-300 items-center gap-1 group"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                onClick={() => setProfileDropdownOpen((prev) => !prev)}
                                ref={dropdownRef}
                            >
                                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center">
                                    {currentUser?.photo && currentUser?.photo !== "null" ? (
                                        <img
                                            src={currentUser.photo}
                                            alt="Profile"
                                            className="w-full h-full rounded-full object-cover"
                                        />
                                    ) : (
                                        <span
                                            className="text-base w-8 h-8 sm:w-9 sm:h-9 font-bold uppercase border-2 rounded-full flex justify-center items-center border-white/40 group-hover:border-purple-400"
                                        >
                                            {decryptData(currentUser?.userName)?.split(" ").map(name => name[0]?.toUpperCase())?.join("") || ""}
                                        </span>
                                    )}
                                </div>
                                {currentUser && (
                                    <span
                                        className="hidden md600:block font-medium capitalize transition-colors cursor-pointer max-w-[120px] truncate"
                                    >
                                        {decryptData(currentUser?.userName)}
                                    </span>
                                )}
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />

                                {/* Profile dropdown with AnimatePresence for exit animations */}
                                <AnimatePresence>
                                    {profileDropdownOpen && (
                                        <motion.div
                                            className="absolute top-[43px] right-0 mt-2 w-44 bg-[#18181b] rounded-xl shadow-lg z-50 border border-white/10"
                                            initial={{ opacity: 0, x: 40, scale: 0.9 }}
                                            animate={{ opacity: 1, x: 0, scale: 1 }}
                                            exit={{ opacity: 0, x: 40, scale: 0.9 }}
                                            transition={{
                                                duration: 0.2,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            <button
                                                className="w-full text-left flex gap-2 items-center px-4 py-2 hover:bg-white/5 text-gray-200 hover:text-purple-400 transition-colors"
                                                onClick={() => { handleProfileNavigation(); setProfileDropdownOpen(false) }}
                                            >
                                                <div>
                                                    <FaUser />
                                                </div>
                                                <div>
                                                    Profile
                                                </div>
                                            </button>
                                            <button
                                                className="w-full text-left flex gap-1 items-center px-4 py-2 hover:bg-white/5 text-gray-200 border-t border-white/10 hover:text-red-500 transition-colors"
                                                onClick={() => {
                                                    setProfileDropdownOpen(false);
                                                    setShowLogoutModal(true);
                                                }}
                                            >
                                                <div className='text-xl'>
                                                    <MdLogout />
                                                </div>
                                                <div>
                                                    Logout
                                                </div>
                                            </button>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

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
                                                className="w-full bg-white/10 hover:bg-white/20 text-white py-2 ease-in-out rounded-[4px] transition-all duration-300"
                                            >
                                                Cancel
                                            </button>
                                            <button type="submit" onClick={() => { setShowLogoutModal(false); handleLogout(); }} className="w-full text-white py-2 rounded-[4px] text-[14px] font-medium sm:py-3 bg-white/30 hover:bg-white/40 border-none cursor-pointer transition-all duration-400 ease-in-out"
                                            >
                                                Yes, Logout
                                            </button>
                                        </div>
                                    </div>
                                </Modal>
                            </motion.div>
                        ) : (
                            <motion.div
                                onClick={() => { navigate('/login') }}
                                className="relative gap-1 flex items-center cursor-pointer text-gray-200 transition-all duration-300 hover:text-purple-400 group"
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                            >
                                <div className="w-8 h-8 rounded-full border-2 border-white/40 flex items-center justify-center transition-colors group-hover:border-purple-400">
                                    <FaUser size={16} />
                                </div>
                                <span
                                    className="transition-colors cursor-pointer font-medium"
                                >
                                    Sign in
                                </span>
                                <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 transition-all duration-300 group-hover:w-full" />
                            </motion.div>
                        )}
                        <button onClick={() => setIsMenuOpen(true)} aria-label="Open menu">
                            <FaBars size={24} className="text-white" />
                        </button>
                    </div>

                    {/* Offcanvas Menu moved outside container to avoid clipping */}
                </div>
            </div>
            {/* Backdrop and Drawer rendered at header level to span full width */}
            <>
                {isMenuOpen && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] md:hidden"
                        onClick={() => setIsMenuOpen(false)}
                    />
                )}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: isMenuOpen ? 0 : '-100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed top-0 left-0 w-[82%] sm:w-72 max-w-[360px] h-full bg-[#0b0b0b]/95 shadow-2xl p-6 z-[70] flex flex-col space-y-6 md:hidden border-r border-white/10 overflow-y-auto pb-6"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-500 via-fuchsia-500 to-indigo-500 bg-clip-text text-transparent">YOYO</h2>
                        <button onClick={() => setIsMenuOpen(false)} aria-label="Close menu">
                            <FaTimes size={24} className="text-white" />
                        </button>
                    </div>

                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/'}
                            className={({ isActive }) => `text-gray-200 text-lg hover:text-white transition-colors ${isActive ? 'text-primary' : ''}`}
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item.name}
                        </NavLink>
                    ))}
                </motion.div>
            </>
        </header>
    );
};

export default Header;


// ========================================= New Header Ref ================================================

// import React, { useState } from 'react';
// import { LuGamepad2, LuMenu, LuSearch, LuShoppingCart, LuUser, LuX, LuZap } from 'react-icons/lu';

// export default function GamingHeader() {
//     const [isMenuOpen, setIsMenuOpen] = useState(false);
//     const [isSearchOpen, setIsSearchOpen] = useState(false);

//     const navItems = [
//         { name: 'Games', href: '#games' },
//         { name: 'Reviews', href: '#reviews' },
//         { name: 'News', href: '#news' },
//         { name: 'Esports', href: '#esports' },
//         { name: 'Community', href: '#community' }
//     ];

//     return (
//         <header className="relative bg-gradient-to-r from-purple-900 via-blue-900 to-indigo-900 text-white shadow-2xl">
//             <div className="absolute inset-0 overflow-hidden">
//                 <div className="absolute -top-4 -left-4 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
//                 <div className="absolute -bottom-8 -right-4 w-72 h-72 bg-blue-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
//                 <div className="absolute top-8 left-1/2 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
//             </div>

//             <div className="relative z-10 px-4 sm:px-6 lg:px-8">
//                 <div className="flex items-center justify-between h-20">
//                     <div className="flex items-center space-x-3 group cursor-pointer">
//                         <div className="relative">
//                             <LuGamepad2 className="h-10 w-10 text-cyan-400 group-hover:text-cyan-300 transition-colors duration-300 transform group-hover:rotate-12" />
//                             <LuZap className="absolute -top-1 -right-1 h-4 w-4 text-yellow-400 animate-bounce" />
//                         </div>
//                         <div>
//                             <h1 className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//                                 YoyoGame
//                             </h1>
//                             <p className="text-xs text-gray-300 -mt-1">Level Up Your Gaming</p>
//                         </div>
//                     </div>

//                     <nav className="hidden md:block">
//                         <div className="flex items-center space-x-8">
//                             {navItems.map((item) => (
//                                 <a
//                                     key={item.name}
//                                     href={item.href}
//                                     className="relative px-3 py-2 text-sm font-medium text-gray-200 hover:text-white transition-all duration-300 group"
//                                 >
//                                     {item.name}
//                                     <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-cyan-400 to-purple-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></span>
//                                 </a>
//                             ))}
//                         </div>
//                     </nav>

//                     <div className="hidden md:flex items-center space-x-4">
//                         <button
//                             onClick={() => setIsSearchOpen(!isSearchOpen)}
//                             className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110"
//                         >
//                             <LuSearch className="h-5 w-5" />
//                         </button>
//                         <button className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110">
//                             <LuShoppingCart className="h-5 w-5" />
//                             <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white font-bold">
//                                 3
//                             </span>
//                         </button>

//                         <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-110">
//                             <LuUser className="h-5 w-5" />
//                         </button>

//                         <button className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full font-semibold text-sm hover:from-cyan-400 hover:to-purple-400 transition-all duration-300 transform hover:scale-105 hover:shadow-lg">
//                             Play Now
//                         </button>
//                     </div>

//                     <button
//                         onClick={() => setIsMenuOpen(!isMenuOpen)}
//                         className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-sm transition-all duration-300"
//                     >
//                         {isMenuOpen ? <LuX className="h-6 w-6" /> : <LuMenu className="h-6 w-6" />}
//                     </button>
//                 </div>

//                 {isSearchOpen && (
//                     <div className="pb-4 animate-in slide-in-from-top duration-300">
//                         <div className="relative max-w-md mx-auto">
//                             <input
//                                 type="text"
//                                 placeholder="Search games, reviews, news..."
//                                 className="w-full px-4 py-2 pl-10 bg-white/20 backdrop-blur-sm rounded-full border border-white/30 text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent"
//                             />
//                             <LuSearch className="absolute left-3 top-2.5 h-5 w-5 text-gray-300" />
//                         </div>
//                     </div>
//                 )}
//             </div>

//             {isMenuOpen && (
//                 <div className="md:hidden absolute top-full left-0 right-0 bg-gradient-to-b from-purple-900/95 to-indigo-900/95 backdrop-blur-lg border-t border-white/20 animate-in slide-in-from-top duration-300">
//                     <div className="px-4 py-6 space-y-4">
//                         {navItems.map((item) => (
//                             <a
//                                 key={item.name}
//                                 href={item.href}
//                                 className="block px-4 py-2 text-lg font-medium text-gray-200 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-300"
//                             >
//                                 {item.name}
//                             </a>
//                         ))}
//                         <div className="flex items-center space-x-4 pt-4 border-t border-white/20">
//                             <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300">
//                                 <LuUser className="h-5 w-5 mx-auto" />
//                             </button>
//                             <button className="flex-1 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-all duration-300 relative">
//                                 <LuShoppingCart className="h-5 w-5 mx-auto" />
//                                 <span className="absolute -top-1 right-1/2 translate-x-2 h-4 w-4 bg-red-500 text-xs rounded-full flex items-center justify-center text-white font-bold">
//                                     3
//                                 </span>
//                             </button>
//                             <button className="flex-1 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-500 rounded-lg font-semibold hover:from-cyan-400 hover:to-purple-400 transition-all duration-300">
//                                 Play Now
//                             </button>
//                         </div>
//                     </div>
//                 </div>
//             )}
//         </header>
//     );
// }