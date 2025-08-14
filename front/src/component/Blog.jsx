import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiSearch } from 'react-icons/fi';
import { FaRegCalendarAlt } from 'react-icons/fa';
import BackgroundColor from './BackgroundColor';

import img1 from '../Asset/images/1.webp';
import img2 from '../Asset/images/2.webp';
import img3 from '../Asset/images/3.webp';

export default function Blog() {
    const images = [img1, img2, img3];
    const [index, setIndex] = useState(0);
    const [expanded, setExpanded] = useState(false);
    const [query, setQuery] = useState('');

    const title = 'Marvel\u2019s Spider-Man 2';
    const longText = `A leap forward in web-slinging adventure Insomniac Games has once again redefined the Spider-Man experience with Marvel\u2019s Spider-Man 2. Building upon the foundations laid by its predecessors, this installment introduces innovative gameplay mechanics, a compelling narrative, and breathtaking visuals that push the boundaries of what a superhero game can achieve. Dual Spider-Heroes: Peter Parker and Miles Morales In this sequel, players can seamlessly switch between Peter Parker and Miles Morales, each bringing unique abilities to the table. Peter dons the iconic symbiote suit, granting him enhanced strength and aggressive combat techniques. Meanwhile, Miles utilizes his bio-electric powers and stealth capabilities to navigate encounters with style. The story delves deep into themes of responsibility, friendship, and identity as both heroes face new threats across a richly detailed New York City.`;

    const author = { name: 'Archit', date: '14, Aug, 2025' };

    const prev = () => setIndex((p) => (p - 1 + images.length) % images.length);
    const next = () => setIndex((p) => (p + 1) % images.length);

    const topArticles = [
        { id: 'black-angel', title: 'Black Angel', date: 'July 24, 2025', thumb: img2 },
        { id: 'black-castle', title: 'Black Castle', date: 'July 24, 2025', thumb: img3 },
        { id: 'black-wings', title: 'Black Wings', date: 'July 24, 2025', thumb: img1 },
    ];
    const filteredTop = topArticles.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));

    return (
        <BackgroundColor>
            <section className="pt-24 pb-16">
                <div className="max-w-[80%] lg:max-w-[80%] mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2">
                        <div className="relative overflow-hidden rounded-xl border border-white/10 bg-[#121212] shadow-2xl">
                            {/* Hero slider */}
                            <div className="relative">
                                <div className="aspect-[21/9] w-full overflow-hidden">
                                    <AnimatePresence mode="wait" initial={false}>
                                        <motion.img
                                            key={index}
                                            src={images[index]}
                                            alt={title}
                                            initial={{ opacity: 0.4, scale: 1.02 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0.2, scale: 1.02 }}
                                            transition={{ duration: 0.5 }}
                                            className="w-full h-full object-cover"
                                        />
                                    </AnimatePresence>
                                </div>

                                {/* Arrows */}
                                <button
                                    aria-label="Previous image"
                                    onClick={prev}
                                    className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition"
                                >
                                    <FiChevronLeft size={22} />
                                </button>
                                <button
                                    aria-label="Next image"
                                    onClick={next}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 border border-white/20 flex items-center justify-center text-white hover:bg-black/70 transition"
                                >
                                    <FiChevronRight size={22} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="px-6 sm:px-10 pb-8 pt-6">
                                <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl text-white tracking-wide">
                                    {title}
                                </h1>

                                <div className={`mt-4 text-[15px] leading-7 text-white/85 ${expanded ? '' : 'line-clamp-5'}`}>
                                    {longText}
                                </div>
                                <button
                                    onClick={() => setExpanded((v) => !v)}
                                    className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
                                >
                                    {expanded ? 'Show Less' : 'Show More'}
                                </button>

                                {/* Meta */}
                                <div className="mt-6 flex items-center gap-3 text-white/80">
                                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white font-semibold">
                                        {author.name?.[0] || 'A'}
                                    </div>
                                    <div className="text-sm">
                                        <div>by {author.name}</div>
                                    </div>
                                    <div className="mx-2 h-4 w-px bg-white/20" />
                                    <div className="flex items-center gap-2 text-sm">
                                        <FaRegCalendarAlt className="text-white/70" />
                                        <span>{author.date}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <aside className="lg:sticky lg:top-28 h-fit space-y-6">
                        <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
                            <h3 className="text-lg font-semibold mb-3">Blog Search</h3>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                    placeholder="Search"
                                    className="w-full rounded-md bg-black/50 border border-white/10 pl-3 pr-10 py-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
                                />
                                <FiSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60" />
                            </div>
                        </div>

                        <div className="rounded-xl border border-white/10 bg-[#111111] p-4">
                            <h3 className="text-lg font-semibold mb-3">Top Articles</h3>
                            <div className="divide-y divide-white/10">
                                {filteredTop.map((a) => (
                                    <div key={a.id} className="py-3 flex items-center gap-3">
                                        <img src={a.thumb} alt={a.title} className="w-12 h-12 rounded object-cover" />
                                        <div>
                                            <div className="text-sm font-medium leading-snug">{a.title}</div>
                                            <div className="text-xs text-white/60">{a.date}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>
            </section>
        </BackgroundColor>
    );
}
