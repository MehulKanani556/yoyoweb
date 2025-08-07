import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { decryptData } from '../Utils/encryption';
import { useDispatch, useSelector } from 'react-redux';
import { getUserById } from '../Redux/Slice/user.slice';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const navItems = ['Home', 'Games', 'Store', 'Contact'];
    const userId = localStorage.getItem('yoyouserId');
    const token = localStorage.getItem('yoyoToken');
    const currentUser = useSelector((state) => state.auth.user);

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
                    >
                        <span
                            className="text-base w-8 h-8 font-bold uppercase group-hover:border-[#8A775A] border-2 rounded-full flex justify-center items-center"
                        >
                            {decryptData(currentUser?.userName)?.split(" ").map(name => name[0].toUpperCase()).join("") || ""}
                        </span>
                        {currentUser && (
                            <span
                                className="hidden md600:block font-medium capitalize transition-colors cursor-pointer"
                            >
                                {decryptData(currentUser?.userName)}
                            </span>
                        )}
                        <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-[#8A775A] transition-all duration-300 group-hover:w-full" />
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
