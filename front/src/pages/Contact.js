import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createcontactUs } from '../Redux/Slice/contactUs.slice';
import { Link } from 'react-router-dom';
import { enqueueSnackbar } from 'notistack';
import { motion } from 'framer-motion';
import { FaEnvelope, FaPhone, FaDiscord, FaMapMarkerAlt, FaCheckCircle, FaUser, FaUserTie } from 'react-icons/fa';
import { FaSquareXTwitter } from "react-icons/fa6";
import BackgroundColor from '../component/BackgroundColor';

const initialFormState = {
  firstName: '',
  lastName: '',
  email: '',
  mobileNo: '',
  message: '',
  isAccept: false,
};

export default function Contact() {
  const dispatch = useDispatch();
  const loading = useSelector((state) => state.contactUs.loading);

  const [form, setForm] = useState(initialFormState);
  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const validate = () => {
    if (!form.firstName || !form.lastName || !form.email || !form.mobileNo || !form.message) {
      enqueueSnackbar('Please fill all required fields.', { variant: 'warning' });
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      enqueueSnackbar('Please enter a valid email address.', { variant: 'warning' });
      return false;
    }
    if (!/^[0-9]{7,15}$/.test(form.mobileNo)) {
      enqueueSnackbar('Please enter a valid mobile number (digits only).', { variant: 'warning' });
      return false;
    }
    if (!form.isAccept) {
      enqueueSnackbar('You must accept the Terms and Privacy Policy.', { variant: 'warning' });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await dispatch(createcontactUs(form));
      setForm(initialFormState);
      setSent(true);
    } catch (err) {
      // Error snackbars are handled in the thunk
    }
  };

  return (
    <BackgroundColor className="pt-10">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="max-w-[80%] mx-auto">
          {/* Hero */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10 md:mb-14"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs tracking-wider bg-white/10 text-white/90 mb-3">We usually reply within 24 hours</span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">
              Get in <span className="bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">Touch</span>
            </h1>
            <p className="text-gray-400 mt-3 max-w-2xl mx-auto">Questions, feedback, or ideas? Drop us a line — we’re here to help you level up your gaming experience.</p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mx-auto">
            {/* Info panel */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm shadow-xl"
            >
              <h3 className="text-white text-xl font-semibold mb-4">Contact Info</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-purple-400"><FaEnvelope /></div>
                  <div>
                    <p className="text-sm text-gray-400">Email us</p>
                    <p className="text-white">
                      <Link
                        to="mailto:info@yoyokhel.com"
                        className="hover:text-purple-400 transition"
                      >
                        info@yoyokhel.com
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-purple-400"><FaPhone /></div>
                  <div>
                    <p className="text-sm text-gray-400">Call us</p>
                    <p className="text-white">
                      <a
                        href="tel:+15550123456"
                        className=" hover:text-purple-400 transition"
                      >
                        +1 (555) 012-3456
                      </a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="mt-1 text-purple-400"><FaMapMarkerAlt /></div>
                  <div>
                    <p className="text-sm text-gray-400">Location</p>
                    <p className="text-white">
                      <a
                        href="https://maps.google.com/?q=Remote"
                        target="_blank"
                        rel="noopener noreferrer"
                        className=" hover:text-purple-400 transition"
                      >
                        Remote • Worldwide
                      </a>
                    </p>
                  </div>
                </div>
              </div>
              <div className="h-px bg-white/10 my-6" />
              <p className="text-sm text-gray-400 mb-3">Join our community</p>
              <div className="flex gap-3">
                <Link
                  to="https://discord.gg"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
                  aria-label="Join us on Discord"
                >
                  <FaDiscord />
                </Link>
                <Link
                  to="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 transition"
                  aria-label="Follow us on Twitter"
                >
                  <FaSquareXTwitter />
                </Link>
              </div>
            </motion.div>

            {/* Form panel */}
            <motion.div
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.15 }}
              className="lg:col-span-2 relative"
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-2xl blur opacity-60" />
              <div className="relative bg-[#1b1920]/90 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
                {sent && (
                  <div className="mb-4 flex items-center gap-2 text-emerald-400 bg-emerald-400/10 border border-emerald-400/30 rounded-lg px-3 py-2">
                    <FaCheckCircle className="text-emerald-400" />
                    <span>Thanks! Your message has been sent.</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">First Name<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="firstName"
                          value={form.firstName}
                          onChange={handleChange}
                          className="w-full bg-[#232124] border border-gray-700 rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:border-purple-500"
                          placeholder="John"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"><FaUser /></span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">Last Name<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="text"
                          name="lastName"
                          value={form.lastName}
                          onChange={handleChange}
                          className="w-full bg-[#232124] border border-gray-700 rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:border-purple-500"
                          placeholder="Doe"
                        />
                        <span className="absolute  left-3 top-1/2 -translate-y-1/2  text-gray-500"><FaUserTie /></span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">Email<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          className="w-full bg-[#232124] border border-gray-700 rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:border-purple-500"
                          placeholder="you@example.com"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-500"><FaEnvelope /></span>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm mb-1 text-gray-300">Mobile No<span className="text-red-500">*</span></label>
                      <div className="relative">
                        <input
                          type="tel"
                          name="mobileNo"
                          value={form.mobileNo}
                          onChange={handleChange}
                          className="w-full bg-[#232124] border border-gray-700 rounded-lg px-3 py-2.5 pl-10 focus:outline-none focus:border-purple-500"
                          placeholder="15551234567"
                        />
                        <span className="absolute left-3 top-1/2 -translate-y-1/2  text-gray-500"><FaPhone /></span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm mb-1 text-gray-300">Message<span className="text-red-500">*</span></label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      className="w-full bg-[#232124] border border-gray-700 rounded-lg px-3 py-3 focus:outline-none focus:border-purple-500 min-h-[140px]"
                      placeholder="Tell us how we can help..."
                    />
                  </div>

                  <div className="flex items-start space-x-3">
                    <input
                      id="isAccept"
                      type="checkbox"
                      name="isAccept"
                      checked={form.isAccept}
                      onChange={handleChange}
                      className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-700 rounded"
                    />
                    <label htmlFor="isAccept" className="text-sm text-gray-300">
                      I agree to the <Link to="/termsCondition" className="text-purple-300 hover:text-purple-200">Terms of Service</Link> and{' '}<Link to="/privacyPolicy" className="text-purple-300 hover:text-purple-200">Privacy Policy</Link>.
                    </label>
                  </div>

                  <div className="pt-1">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={loading}
                      className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-500 hover:to-cyan-500 disabled:opacity-60 text-white font-semibold rounded-lg transition shadow-lg shadow-purple-900/20"
                    >
                      {loading && (
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                        </svg>
                      )}
                      {loading ? 'Sending...' : 'Send Message'}
                    </motion.button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </BackgroundColor>
  );
}


