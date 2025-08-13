import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { FaShieldAlt, FaBolt, FaHeadset, FaCreditCard, FaTags, FaGamepad, FaUsers, FaThumbsUp, FaKey } from 'react-icons/fa';
import { motion } from 'framer-motion';
import axiosInstance from '../Utils/axiosInstance';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export default function About() {
  // useEffect(() => { document.title = 'About • YOYO'; }, []);

  const [stats, setStats] = useState({ games: 0, users: 0, categories: 0, transactions: 0 });
  const [startCount, setStartCount] = useState(false);
  const statsRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      const entry = entries[0];
      if (entry.isIntersecting) {
        setStartCount(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });

    if (statsRef.current) observer.observe(statsRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    (async function fetchCounts() {
      try {
        const [gamesRes, usersRes, categoriesRes, paymentsRes] = await Promise.all([
          axiosInstance.get('/getAllActiveGames'),
          axiosInstance.get('/allUsers'),
          axiosInstance.get('/getAllCategories'),
          axiosInstance.get('/getpayment'),
        ]);

        setStats({
          games: Array.isArray(gamesRes.data) ? gamesRes.data.length : 0,
          users: typeof usersRes.data?.totalUsers === 'number'
            ? usersRes.data.totalUsers
            : (Array.isArray(usersRes.data?.user) ? usersRes.data.user.length : 0),
          categories: Array.isArray(categoriesRes.data) ? categoriesRes.data.length : 0,
          transactions: Array.isArray(paymentsRes.data?.data) ? paymentsRes.data.data.length : 0,
        });
      } catch (err) {
        // Silently ignore; keep defaults
      }
    })();
  }, []);

  function CountUp({ target = 0, start = false, duration = 1200 }) {
    const [value, setValue] = useState(0);

    useEffect(() => {
      if (!start) return;
      let rafId;
      const startTime = performance.now();
      const animate = (now) => {
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const current = Math.floor(progress * target);
        setValue(current);
        if (progress < 1) rafId = requestAnimationFrame(animate);
      };
      rafId = requestAnimationFrame(animate);
      return () => cancelAnimationFrame(rafId);
    }, [start, target, duration]);

    return <>{value.toLocaleString()}</>;
  }

  // Directional hover utilities
  function getDirection(event, element) {
    const baseEl = event?.currentTarget || element;
    if (!baseEl) return 'top';
    const rect = baseEl.getBoundingClientRect();
    const w = rect.width;
    const h = rect.height;
    const x = (event.clientX - rect.left - w / 2) * (w > h ? h / w : 1);
    const y = (event.clientY - rect.top - h / 2) * (h > w ? w / h : 1);
    const d = Math.round((((Math.atan2(y, x) + Math.PI) / (Math.PI / 2)) + 2) % 4);
    // 0: right, 1: bottom, 2: left, 3: top
    if (d === 0) return 'right';
    if (d === 1) return 'bottom';
    if (d === 2) return 'left';
    return 'top';
  }

  function mapDirToTransform(direction) {
    switch (direction) {
      case 'left':
        return 'translate3d(-100%, 0, 0)';
      case 'right':
        return 'translate3d(100%, 0, 0)';
      case 'top':
        return 'translate3d(0, -100%, 0)';
      case 'bottom':
      default:
        return 'translate3d(0, 100%, 0)';
    }
  }

  function HoverCard({ className = '', children, roundedClass = 'rounded-2xl' }) {
    const cardRef = useRef(null);
    const isLeavingRef = useRef(false);
    const enterRafRef = useRef(0);
    const [overlayTransform, setOverlayTransform] = useState('translate3d(0, 0, 0)');
    const [overlayOpacity, setOverlayOpacity] = useState(0);

    const handleEnter = (e) => {
      const dir = getDirection(e, cardRef.current);
      isLeavingRef.current = false;
      setOverlayOpacity(1);
      setOverlayTransform(mapDirToTransform(dir));
      if (enterRafRef.current) cancelAnimationFrame(enterRafRef.current);
      enterRafRef.current = requestAnimationFrame(() => {
        setOverlayTransform('translate3d(0, 0, 0)');
        enterRafRef.current = 0;
      });
    };

    const handleLeave = (e) => {
      const dir = getDirection(e, cardRef.current);
      isLeavingRef.current = true;
      if (enterRafRef.current) {
        cancelAnimationFrame(enterRafRef.current);
        enterRafRef.current = 0;
      }
      setOverlayOpacity(0);
      setOverlayTransform(mapDirToTransform(dir));
    };

    const handleTransitionEnd = () => {
      if (isLeavingRef.current) {
        setOverlayOpacity(0);
        isLeavingRef.current = false;
      }
    };

    useEffect(() => {
      return () => {
        if (enterRafRef.current) cancelAnimationFrame(enterRafRef.current);
      };
    }, []);

    return (
      <div
        ref={cardRef}
        onPointerEnter={handleEnter}
        onPointerLeave={handleLeave}
        className={`relative overflow-hidden ${roundedClass} ${className}`}
      >
        <div
          className={`pointer-events-none absolute inset-0 ${roundedClass} bg-white/10 border border-transparent transition-all duration-300 ease-out`}
          style={{ transform: overlayTransform, opacity: overlayOpacity, willChange: 'transform, opacity', zIndex: 1 }}
          onTransitionEnd={handleTransitionEnd}
        />
        {children}
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#0b0a0d] to-[#15131a] text-gray-200 pt-28 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-[80%] mx-auto">
          {/* Hero */}
          <motion.section
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.5 }}
            className="text-center max-w-4xl mx-auto"
          >
            <h1 className="text-3xl md:text-5xl font-extrabold text-white">About YOYO Game Store</h1>
            <p className="text-gray-400 mt-4">
              Your trusted digital marketplace for PC and mobile games. We help gamers discover great titles at the best
              prices with secure checkout and instant delivery.
            </p>
            <div className="mt-6">
              <Link to="/games" className="inline-block px-5 py-3 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/10 transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-105">
                Browse Games
              </Link>
            </div>
          </motion.section>

        {/* Store Highlights */}
        <motion.section
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-12"
        >
          {[{
            icon: <FaGamepad className="text-purple-300" />, title: 'Huge Catalog', text: 'From AAA to indies—new releases weekly.'
          }, {
            icon: <FaBolt className="text-yellow-300" />, title: 'Instant Delivery', text: 'Game keys delivered to your inbox in seconds.'
          }, {
            icon: <FaShieldAlt className="text-emerald-300" />, title: 'Secure Checkout', text: 'Encrypted payments and fraud protection.'
          }, {
            icon: <FaTags className="text-pink-300" />, title: 'Best Prices', text: 'Competitive deals and seasonal sales.'
          }, {
            icon: <FaHeadset className="text-cyan-300" />, title: '24/7 Support', text: 'Real people ready to help anytime.'
          }, {
            icon: <FaKey className="text-blue-300" />, title: 'Authentic Keys', text: 'Official keys sourced from trusted partners.'
          }].map((item, i) => (
            <motion.div key={i} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.05 }}>
              <HoverCard className="group bg-white/5 border border-white/10 p-6 transition duration-300 ease-out hover:-translate-y-1 hover:shadow-lg">
                <div className="text-2xl transition-transform duration-300 group-hover:scale-110">{item.icon}</div>
                <h3 className="text-white font-semibold mt-3">{item.title}</h3>
                <p className="text-gray-400 text-sm mt-1">{item.text}</p>
              </HoverCard>
            </motion.div>
          ))}
        </motion.section>

        {/* How It Works */}
        <motion.section
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-12"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">How It Works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-5">
              {[{ step: '1', title: 'Browse & Choose', text: 'Explore collections and find your next favorite game.' },
                { step: '2', title: 'Checkout Securely', text: 'Pay with cards, wallets, or UPI—safe and fast.' },
                { step: '3', title: 'Play Instantly', text: 'Receive your key instantly and start playing.' }].map((s) => (
                <motion.div key={s.step} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.45 }}>
                  <HoverCard className="group border border-white/10 bg-black/20 p-5 transition duration-300 ease-out hover:-translate-y-1" roundedClass="rounded-xl">
                    <div className="w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white font-bold transition-colors duration-300 group-hover:bg-white/20">
                      {s.step}
                    </div>
                    <h3 className="text-white font-semibold mt-3">{s.title}</h3>
                    <p className="text-gray-400 text-sm mt-1">{s.text}</p>
                  </HoverCard>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Store Stats */}
        <motion.section
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-12"
          ref={statsRef}
        >
          {[{ label: 'Active Games', value: stats.games, icon: <FaGamepad /> },
            { label: 'Registered Users', value: stats.users, icon: <FaUsers /> },
            { label: 'Categories', value: stats.categories, icon: <FaTags /> },
            { label: 'Number of Downloads', value: stats.transactions, icon: <FaCreditCard /> },
          ].map((s, idx) => (
            <motion.div key={idx} variants={fadeUp} initial="initial" whileInView="animate" viewport={{ once: true }} transition={{ duration: 0.45, delay: idx * 0.05 }}>
              <HoverCard className="group bg-white/5 border border-white/10 p-5 text-center transition duration-300 ease-out hover:-translate-y-1">
                <div className="text-purple-300 flex items-center justify-center text-xl transition-transform duration-300 group-hover:scale-110">{s.icon}</div>
                <div className="text-2xl md:text-3xl font-extrabold text-white mt-1"><CountUp target={Number(s.value) || 0} start={startCount} /></div>
                <div className="text-sm text-gray-400 mt-1">{s.label}</div>
              </HoverCard>
            </motion.div>
          ))}
        </motion.section>

        {/* Why Shop With Us */}
        <motion.section
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-6"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Why Shop With YOYO</h2>
            <ul className="mt-4 space-y-3 text-gray-300">
              <li className="group flex items-start gap-2 transition duration-300 hover:text-white hover:translate-x-1"><FaThumbsUp className="mt-1 text-purple-300 transition-transform duration-300 group-hover:scale-110" /> Genuine products and publisher partnerships.</li>
              <li className="group flex items-start gap-2 transition duration-300 hover:text-white hover:translate-x-1"><FaCreditCard className="mt-1 text-purple-300 transition-transform duration-300 group-hover:scale-110" /> Multiple payment options and EMI-friendly banks.</li>
              <li className="group flex items-start gap-2 transition duration-300 hover:text-white hover:translate-x-1"><FaShieldAlt className="mt-1 text-purple-300 transition-transform duration-300 group-hover:scale-110" /> Buyer protection and transparent refund policy.</li>
              <li className="group flex items-start gap-2 transition duration-300 hover:text-white hover:translate-x-1"><FaBolt className="mt-1 text-purple-300 transition-transform duration-300 group-hover:scale-110" /> Lightning-fast delivery and download instructions.</li>
            </ul>
          </div>
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">Payment & Security</h2>
            <p className="text-gray-300 mt-3">We use industry-standard encryption and partner with leading payment providers.</p>
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm text-gray-300">
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center transition duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5">Visa</div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center transition duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5">Mastercard</div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center transition duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5">PayPal</div>
              <div className="rounded-lg bg-white/5 border border-white/10 px-3 py-2 text-center transition duration-300 ease-out hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5">UPI/Wallets</div>
            </div>
          </div>
        </motion.section>

       

        {/* FAQs */}
        <motion.section
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-12"
        >
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 md:p-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white">FAQs</h2>
            <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <p className="text-white font-semibold">How do I receive my game?</p>
                <p className="text-gray-400 text-sm mt-1">You’ll get an official key instantly after payment, with step-by-step activation instructions.</p>
              </div>
              <div>
                <p className="text-white font-semibold">What payment methods are supported?</p>
                <p className="text-gray-400 text-sm mt-1">We accept major cards, PayPal, UPI, and popular wallets depending on your region.</p>
              </div>
              <div>
                <p className="text-white font-semibold">Can I get a refund?</p>
                <p className="text-gray-400 text-sm mt-1">If a key is invalid or not working, contact support and we’ll resolve or refund as per policy.</p>
              </div>
              <div>
                <p className="text-white font-semibold">Who do I contact for help?</p>
                <p className="text-gray-400 text-sm mt-1">Our team is available 24/7 at the support center. We typically respond within 30 minutes.</p>
              </div>
            </div>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.5, delay: 0.05 }}
          className="mt-12"
        >
          <div className="border border-white/10 bg-gradient-to-r from-purple-600/10 to-cyan-600/10 rounded-2xl p-6 md:p-8 text-center">
            <h3 className="text-xl md:text-2xl font-bold text-white">Ready to find your next game?</h3>
            <p className="text-gray-400 mt-2">Explore new releases, top sellers, and exclusive deals.</p>
            <Link to="/products" className="inline-block mt-5 px-6 py-3 rounded-lg bg-white/15 hover:bg-white/25 text-white border border-white/10 transition duration-300 ease-out hover:-translate-y-0.5 hover:scale-105">
              Shop Games
            </Link>
          </div>
        </motion.section>
        </div>
      </div>
    </main>
  );
}