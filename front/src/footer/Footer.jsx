import React from "react";
import { motion } from "framer-motion";
import { FaDiscord, FaTwitter, FaYoutube, FaTwitch } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="relative z-20 bg-[#1A181C] text-gray-300 pt-12 pb-6"
    >
      {/* Top Gradient Border */}
      <div className="absolute top-0 left-0 w-full h-[4px] bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500" />.


      <div className="w-[95%] sm:w-[92%] md:w-[90%] lg:max-w-[80%] mx-auto">
        <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Logo & Tagline */}
          <div>
            <h2 className="text-3xl font-bold text-white mb-3">🎮 YOYO</h2>
            <p className="text-sm text-gray-400 leading-relaxed">
              Level up your gaming experience with the best deals and latest releases.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "Home", path: "/" },
                { name: "Games", path: "/games" },
                { name: "Contact", path: "/contact" },
              ].map((link) => (
                <li key={link.name}>
                  <NavLink
                    to={link.path}
                    end={link.path === "/"}
                    className={({ isActive }) =>
                      `transition hover:text-white hover:pl-1 duration-200  ${isActive ? "text-purple-400" : "text-gray-400"
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              {[
                { name: "FAQs", path: "" },
                { name: "Help Center", path: "" },
                { name: "Privacy Policy", path: "/privacyPolicy" },
                { name: "Terms of Service", path: "/termsCondition" },
              ].map((link) => (
                <li key={link.name}>
                  {link.path ? (
                    <NavLink
                      to={link.path}
                      end
                      className={({ isActive }) =>
                        `transition hover:text-white hover:pl-1 duration-200 block ${isActive ? "text-purple-400" : "text-gray-400"
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  ) : (
                    <span className="transition hover:text-white hover:pl-1 duration-200 block text-gray-400 cursor-default">
                      {link.name}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter & Socials */}
          <div>
            <h3 className="text-white text-lg font-semibold mb-4">Stay Updated</h3>
            <p className="text-sm text-gray-400 mb-3">
              Subscribe for game updates, offers, and exclusive content.
            </p>
            <div className="flex mb-4">
              <input
                type="email"
                placeholder="Your email"
                className="px-3 py-2 w-full rounded-l-lg bg-gray-800 border border-gray-700 focus:outline-none text-sm"
              />
              <button className="px-4 py-2 bg-purple-600 text-white text-sm rounded-r-lg hover:bg-purple-700 transition">
                Join
              </button>
            </div>

            <div className="flex space-x-4 mt-4">
              {[FaDiscord, FaTwitter, FaYoutube, FaTwitch].map((Icon, idx) => (
                <Link
                  to=""
                  key={idx}
                  className="text-gray-400 hover:text-white hover:scale-110 transition-transform duration-200"
                >
                  <Icon size={22} />
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
      {/* Bottom Copyright */}
      <div className="border-t border-gray-700 mt-10 pt-4 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} YOYO Gaming. All rights reserved.
      </div>


    </motion.footer>
  );
};

export default Footer;
