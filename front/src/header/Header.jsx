import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
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
    const navItems = ['Home', 'Games', 'Store', 'Contact'];
    const userId = localStorage.getItem('yoyouserId');
    const token = localStorage.getItem('yoyoToken');
    const currentUser = useSelector((state) => state.auth.user);
    const dropdownRef = useRef(null);
    

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

    const handleProfileNavigation = () => {
        setProfileDropdownOpen(false);
        // Small delay to allow exit animation to complete
        setTimeout(() => {
            navigate("/profile");
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
        <header className="bg-[#232124] text-white shadow-lg fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
                {/* Logo */}
                <motion.div
                    onClick={() => { navigate('/') }}
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold text-white-400 tracking-widest cursor-pointer"
                >
                    YOYO
                </motion.div>

                {/* Desktop Navigation */}
                <nav className="hidden md:flex space-x-8">
                    {navItems.map((item) => (
                        <motion.a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            whileHover={{ scale: 1.1 }}
                            className="relative text-white transition-all duration-300 hover:text-[#8A775A] group"
                        >
                            {item}
                            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#8A775A] transition-all duration-300 group-hover:w-full" />
                        </motion.a>
                    ))}
                </nav>

                {userId && token ? (
                    <motion.div
                        className="relative cursor-pointer flex text-white hover:text-[#8A775A] transition-all duration-300 items-center gap-1 group"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        onClick={() => setProfileDropdownOpen((prev) => !prev)}
                        ref={dropdownRef}
                    >
                        <span
                            className="text-base w-8 h-8 font-bold uppercase group-hover:border-[#8A775A] border-2 rounded-full flex justify-center items-center"
                        >
                            {decryptData(currentUser?.userName)?.split(" ").map(name => name[0]?.toUpperCase())?.join("") || ""}
                        </span>
                        {currentUser && (
                            <span
                                className="hidden md600:block font-medium capitalize transition-colors cursor-pointer"
                            >
                                {decryptData(currentUser?.userName)}
                            </span>
                        )}
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#8A775A] transition-all duration-300 group-hover:w-full" />

                        {/* Profile dropdown with AnimatePresence for exit animations */}
                        <AnimatePresence>
                            {profileDropdownOpen && (
                                <motion.div
                                    className="absolute top-[43px] right-0 mt-2 w-40 bg-[#232323] rounded shadow-lg z-50 border border-gray-700"
                                    initial={{ opacity: 0, x: 40, scale: 0.9 }}
                                    animate={{ opacity: 1, x: 0, scale: 1 }}
                                    exit={{ opacity: 0, x: 40, scale: 0.9 }}
                                    transition={{
                                        duration: 0.2,
                                        ease: "easeInOut"
                                    }}
                                >
                                    <button
                                        className="w-full text-left px-4 py-2 flex gap-2 items-center hover:bg-[#181818] text-white hover:text-[#0072ff] transition-colors"
                                        onClick={handleProfileNavigation}
                                    >
                                        <div>
                                            <FaUser />
                                        </div>
                                        <div>
                                            Profile
                                        </div>
                                    </button>
                                    <button
                                        className="w-full text-left px-4 py-2 flex gap-1 items-center hover:bg-[#181818] text-white border-t border-gray-700 hover:text-red-500 transition-colors"
                                        // onClick={handleLogout}
                                        onClick={() => {
                                            setProfileDropdownOpen(false);
                                            setShowLogoutModal(true);
                                            handleLogout()
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
                        className="relative gap-1 flex items-center cursor-pointer text-white transition-all duration-300 hover:text-[#8A775A] group"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <div className="w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors group-hover:border-[#8A775A]">
                            <FaUser size={16} />
                        </div>
                        <span
                            className="transition-colors cursor-pointer font-medium"
                        >
                            Sign in
                        </span>
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#8A775A] transition-all duration-300 group-hover:w-full" />
                    </motion.div>
                )}

                {/* Mobile Hamburger Icon */}
                <div className="md:hidden">
                    <button onClick={() => setIsMenuOpen(true)}>
                        <FaBars size={24} className="text-white" />
                    </button>
                </div>

                {/* Offcanvas Menu */}
                <motion.div
                    initial={{ x: '-100%' }}
                    animate={{ x: isMenuOpen ? 0 : '-100%' }}
                    transition={{ type: 'tween', duration: 0.3 }}
                    className="fixed top-0 left-0 w-64 h-full bg-black shadow-2xl p-6 z-50 flex flex-col space-y-6 md:hidden"
                >
                    <div className="flex justify-between items-center mb-8">
                        <h2 className="text-green-400 text-2xl font-bold">YOYO</h2>
                        <button onClick={() => setIsMenuOpen(false)}>
                            <FaTimes size={24} className="text-white" />
                        </button>
                    </div>

                    {navItems.map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase()}`}
                            className="text-white text-lg hover:text-green-400"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            {item}
                        </a>
                    ))}
                </motion.div>
            </div>
        </header>
    );
};

export default Header;