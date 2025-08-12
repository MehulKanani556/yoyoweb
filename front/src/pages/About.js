import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { FaTrophy, FaUsers, FaGamepad, FaGlobe, FaRocket, FaShieldAlt, FaHeart, FaStar, FaQuoteLeft, FaBolt } from 'react-icons/fa';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

function useCountUp(target, durationMs = 1200, format = (v) => v.toString()) {
  const [value, setValue] = useState(0);
  const startRef = useRef(null);
  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    startRef.current = start;
    const tick = (now) => {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.floor(eased * target));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return format(value);
}

function ParallaxCard({ children }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rX = useTransform(y, [-40, 40], [8, -8]);
  const rY = useTransform(x, [-40, 40], [-8, 8]);
  const s = useSpring(1, { stiffness: 200, damping: 15 });

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const dx = e.clientX - (rect.left + rect.width / 2);
    const dy = e.clientY - (rect.top + rect.height / 2);
    x.set(Math.max(-40, Math.min(40, dx / 4)));
    y.set(Math.max(-40, Math.min(40, dy / 4)));
  };
  const handleLeave = () => {
    x.set(0); y.set(0); s.set(1);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ rotateX: rX, rotateY: rY, scale: s, transformStyle: 'preserve-3d' }}
      className="relative bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl"
    >
      <div style={{ transform: 'translateZ(30px)' }}>{children}</div>
      <div className="pointer-events-none absolute inset-0 rounded-2xl bg-gradient-to-br from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition" />
    </motion.div>
  );
}

export default function About() {
  useEffect(() => { document.title = 'About • YOYO'; }, []);

  // Mouse parallax for hero background accents
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const t1x = useTransform(mx, [-1, 1], [-10, 10]);
  const t1y = useTransform(my, [-1, 1], [8, -8]);
  const t2x = useTransform(mx, [-1, 1], [8, -8]);
  const t2y = useTransform(my, [-1, 1], [-6, 6]);

  const players = useCountUp(250000, 1400, (v) => `${v.toLocaleString()}+`);
  const games = useCountUp(120, 1200, (v) => `${v}+`);
  const countries = useCountUp(60, 1200, (v) => `${v}+`);
  const awards = useCountUp(12, 1000, (v) => `${v}`);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#0b0a0d] to-[#15131a] text-gray-200 overflow-hidden">
      {/* Page-scoped keyframes and background visuals */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes floatSlow { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(10px, -14px, 0) scale(1.03); } }
        @keyframes floatSlow2 { 0%, 100% { transform: translate3d(0,0,0) scale(1); } 50% { transform: translate3d(-12px, 10px, 0) scale(1.04); } }
        @keyframes glowPulse { 0%, 100% { opacity: .35; } 50% { opacity: .6; } }
        .shine { background: linear-gradient(110deg, rgba(255,255,255,.06), rgba(255,255,255,0) 40%, rgba(255,255,255,.06)); background-size: 200% 100%; animation: shine 6s linear infinite; }
        @keyframes shine { 0% { background-position: 200% 0 } 100% { background-position: -200% 0 } }
      `}</style>
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        {/* Gradient mesh */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'radial-gradient(1200px 600px at -10% -10%, rgba(124, 58, 237, 0.28), transparent), radial-gradient(1000px 500px at 110% 10%, rgba(6, 182, 212, 0.22), transparent), radial-gradient(800px 500px at 50% 120%, rgba(236, 72, 153, 0.18), transparent)'
        }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.06]"
             style={{ backgroundImage: `linear-gradient(rgba(255,255,255,.6) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.6) 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />
        {/* Floating orbs */}
        <div className="absolute w-72 h-72 bg-purple-600/25 blur-3xl rounded-full left-[-3rem] top-[-3rem]"
             style={{ animation: 'floatSlow 8s ease-in-out infinite, glowPulse 6s ease-in-out infinite' }} />
        <div className="absolute w-72 h-72 bg-cyan-500/25 blur-3xl rounded-full right-[-3rem] bottom-[-3rem]"
             style={{ animation: 'floatSlow2 10s ease-in-out infinite, glowPulse 7s ease-in-out infinite' }} />
      </div>

      <div className="relative" onMouseMove={(e)=>{const {innerWidth,innerHeight}=window;mx.set((e.clientX/innerWidth)*2-1);my.set((e.clientY/innerHeight)*2-1);}}>
        <div className="absolute inset-0 -z-10">
          <motion.div style={{ x: t1x, y: t1y }} className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-purple-600/25 blur-3xl" />
          <motion.div style={{ x: t2x, y: t2y }} className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-cyan-600/20 blur-3xl" />
        </div>
        <div className="container mx-auto px-4 py-14 md:py-20">
          {/* Hero */}
          <motion.div
            variants={fadeUp}
            initial="initial"
            animate="animate"
            transition={{ duration: 0.6 }}
            className="text-center max-w-5xl mx-auto"
          >
            <span className="inline-block px-3 py-1 rounded-full text-xs tracking-wider bg-white/10 text-white/90 mb-3">
              Built by gamers, for gamers
            </span>
            <div className="relative inline-block">
              <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight relative">
                We are <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">YOYO</span>,
                crafting delightful gaming experiences for everyone
              </h1>
              <span className="pointer-events-none absolute -inset-x-6 -inset-y-2 rounded-xl bg-gradient-to-r from-purple-500/0 via-cyan-500/10 to-purple-500/0 blur-xl" />
            </div>
            <p className="text-gray-400 mt-4">Our mission is to make gaming more accessible, social, and rewarding — whether you're a casual player or a pro.</p>
          </motion.div>
        </div>
      </div>

        {/* Marquee */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.06 }}
          className="mt-10 md:mt-12"
        >
          <div className="relative overflow-hidden rounded-xl border border-white/10 bg-white/5">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent" />
            <div className="flex py-3 text-sm md:text-base" style={{ width: '200%' }}>
              <div className="flex whitespace-nowrap" style={{ width: '50%', animation: 'marquee 18s linear infinite' }}>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaBolt className="text-yellow-300" /> Zero-paywall fun</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaStar className="text-purple-300" /> Community tournaments</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaGamepad className="text-cyan-300" /> Controller + touch ready</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaShieldAlt className="text-emerald-300" /> Fair-play anti-cheat</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaRocket className="text-pink-300" /> Weekly content drops</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaGlobe className="text-blue-300" /> Global servers</span>
              </div>
              <div className="flex whitespace-nowrap" style={{ width: '50%', animation: 'marquee 18s linear infinite' }}>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaBolt className="text-yellow-300" /> Zero-paywall fun</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaStar className="text-purple-300" /> Community tournaments</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaGamepad className="text-cyan-300" /> Controller + touch ready</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaShieldAlt className="text-emerald-300" /> Fair-play anti-cheat</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaRocket className="text-pink-300" /> Weekly content drops</span>
                <span className="mx-6 inline-flex items-center gap-2 text-gray-300"><FaGlobe className="text-blue-300" /> Global servers</span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          animate="animate"
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-10 md:mt-14"
        >
          {[
            { icon: <FaUsers />, label: 'Players', value: players },
            { icon: <FaGamepad />, label: 'Games', value: games },
            { icon: <FaGlobe />, label: 'Countries', value: countries },
            { icon: <FaTrophy />, label: 'Awards', value: awards },
          ].map((s, idx) => (
            <div key={idx} className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center">
              <div className="text-2xl text-purple-300 flex items-center justify-center mb-2">{s.icon}</div>
              <div className="text-2xl md:text-3xl font-extrabold text-white">{s.value}</div>
              <div className="text-sm text-gray-400 mt-1">{s.label}</div>
            </div>
          ))}
        </motion.div>

        {/* Story + Values */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-10 mt-12 md:mt-16"
        >
          <div className="relative bg-[#1b1920]/90 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600/20 to-cyan-600/20 rounded-2xl blur -z-10" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">Our Story</h2>
            <p className="text-gray-400 mt-3 leading-relaxed">
              YOYO started as a small project between friends who loved building mods and mini-games. Today, we’re a global
              team pushing the boundaries of casual and competitive gaming with creative mechanics, smooth performance, and
              community-first features.
            </p>
            <ul className="mt-4 space-y-2 text-gray-300 list-disc list-inside">
              <li>Player-first design and fair play</li>
              <li>Cross-platform experiences that just work</li>
              <li>Community-driven updates and events</li>
            </ul>
          </div>

          <div className="relative bg-[#1b1920]/90 border border-white/10 rounded-2xl p-6 md:p-8 shadow-2xl">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-pink-600/20 to-purple-600/20 rounded-2xl blur -z-10" />
            <h2 className="text-2xl md:text-3xl font-bold text-white">What We Value</h2>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { icon: <FaRocket />, title: 'Innovation', text: 'We experiment boldly and ship fast.' },
                { icon: <FaShieldAlt />, title: 'Integrity', text: 'We protect player privacy and fight toxicity.' },
                { icon: <FaHeart />, title: 'Community', text: 'We build with players, not just for them.' },
                { icon: <FaGamepad />, title: 'Playfulness', text: 'Fun is our north star — in the product and team.' },
              ].map((v, i) => (
                <ParallaxCard key={i}>
                  <div className="text-purple-300 text-xl mb-1">{v.icon}</div>
                  <p className="text-white font-semibold">{v.title}</p>
                  <p className="text-gray-400 text-sm">{v.text}</p>
                </ParallaxCard>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 md:mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">Milestones</h2>
          <div className="max-w-4xl mx-auto mt-6">
            <div className="relative border-l border-white/10 pl-6 space-y-6">
              {[
                { year: '2021', text: 'YOYO founded by a group of indie devs.' },
                { year: '2022', text: 'Launched our first cross-platform title.' },
                { year: '2023', text: 'Reached 100K players and introduced tournaments.' },
                { year: '2024', text: 'Expanded to 60+ countries with localized events.' },
              ].map((t, i) => (
                <motion.div key={i} className="relative" whileHover={{ x: 2 }}>
                  <span className="absolute -left-[9px] top-1 w-4 h-4 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500" />
                  <div className="text-sm text-purple-300 font-semibold">{t.year}</div>
                  <div className="text-gray-300">{t.text}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.32 }}
          className="mt-12 md:mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">The Squad</h2>
          <p className="text-gray-400 text-center mt-2">Small team, big energy.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-6">
            {[
              { name: 'Alex Chen', role: 'Game Director' },
              { name: 'Priya Singh', role: 'Lead Engineer' },
              { name: 'Marco Rossi', role: 'Product Designer' },
              { name: 'Sara Kim', role: 'Community Lead' },
            ].map((m, i) => (
              <motion.div key={i} whileHover={{ y: -3 }} className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 mx-auto" />
                <div className="text-center mt-3">
                  <p className="text-white font-semibold">{m.name}</p>
                  <p className="text-gray-400 text-sm">{m.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Testimonials */}
        <motion.div
          variants={fadeUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6, delay: 0.34 }}
          className="mt-12 md:mt-16"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-white text-center">What Players Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mt-6">
            {[
              'The tournaments are fire — smooth experience and great prizes!',
              'Finally a platform that feels fair and fun. My go-to break.',
              'Cross-platform actually works. Pick-up-and-play anywhere.',
            ].map((q, i) => (
              <ParallaxCard key={i}>
                <FaQuoteLeft className="text-purple-300" />
                <p className="text-gray-300 mt-3">{q}</p>
              </ParallaxCard>
            ))}
          </div>
        </motion.div>

      
    // </div>
  );
}


