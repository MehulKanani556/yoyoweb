import React from 'react';
import { motion } from 'framer-motion';
import { FaDiscord, FaTwitter, FaYoutube, FaTwitch } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <motion.footer
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="bg-[#232124] text-gray-300 pt-10 pb-5"
        >
            <div className="container mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                {/* Logo and Tagline */}
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">🎮 YOYO</h2>
                    <p className="text-sm text-gray-400">Level up your gaming experience.</p>
                </div>

                {/* Quick Links */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-3">Quick Links</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to={""} className="hover:text-white">Home</Link></li>
                        <li><Link to={""} className="hover:text-white">Games</Link></li>
                        <li><Link to={""} className="hover:text-white">Contact</Link></li>
                    </ul>
                </div>

                {/* Support */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-3">Support</h3>
                    <ul className="space-y-2 text-sm">
                        <li><Link to={""} className="hover:text-white">FAQs</Link></li>
                        <li><Link to={""} className="hover:text-white">Help Center</Link></li>
                        <li><Link to={""} className="hover:text-white">Privacy Policy</Link></li>
                        <li><Link to={""} className="hover:text-white">Terms of Service</Link></li>
                    </ul>
                </div>

                {/* Social Media */}
                <div>
                    <h3 className="text-white text-lg font-semibold mb-3">Join Us</h3>
                    <div className="flex space-x-4 mt-2">
                        <Link to={""} className="text-gray-400 hover:text-white transition"><FaDiscord size={24} /></Link>
                        <Link to={""} className="text-gray-400 hover:text-white transition"><FaTwitter size={24} /></Link>
                        <Link to={""} className="text-gray-400 hover:text-white transition"><FaYoutube size={24} /></Link>
                        <Link to={""} className="text-gray-400 hover:text-white transition"><FaTwitch size={24} /></Link>
                    </div>
                </div>
            </div>

            <div className="border-t border-gray-700 mt-10 pt-4 text-center text-sm text-gray-500">
                © {new Date().getFullYear()} GameZone. All rights reserved.
            </div>
        </motion.footer>
    );
};

export default Footer;