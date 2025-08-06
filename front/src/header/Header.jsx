import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaBars, FaTimes } from 'react-icons/fa';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navItems = ['Home', 'Games', 'Store', 'Contact'];

    return (
        <header className="bg-[#232124] text-white shadow-lg fixed w-full z-50">
            <div className="container mx-auto flex justify-between items-center py-4 px-4 md:px-6">
                {/* Logo */}
                <motion.div
                    initial={{ opacity: 0, y: -30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="text-3xl font-bold text-white-400 tracking-widest"
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
