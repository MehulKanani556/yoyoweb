import React from 'react';
import { motion } from 'framer-motion';
import { FaPlaystation, FaXbox, FaSteam, FaGamepad } from 'react-icons/fa';

const games = [
    { name: "Cyber Hunt", icon: <FaPlaystation size={50} /> },
    { name: "Zombie Arena", icon: <FaXbox size={50} /> },
    { name: "Steam Rush", icon: <FaSteam size={50} /> },
    { name: "Retro Battle", icon: <FaGamepad size={50} /> },
];

export default function HomePage() {
    return (
        <div className="bg-gradient-to-b from-black to-gray-900 text-white min-h-screen">

            {/* Hero Section */}
            <section className="h-screen flex flex-col items-center justify-center text-center px-4 pt-24">
                <motion.h2
                    className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-500"
                    initial={{ opacity: 0, y: -40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1 }}
                >
                    Welcome to YOYO Game
                </motion.h2>
                <motion.p
                    className="mt-6 text-lg md:text-xl text-gray-300 max-w-xl"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5, duration: 1 }}
                >
                    Explore top-tier games, join exciting tournaments, and level up your gaming experience.
                </motion.p>
                <motion.button
                    className="mt-8 px-8 py-3 bg-red-600 hover:bg-red-700 rounded-xl text-white font-semibold transition shadow-lg"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Get Started
                </motion.button>
            </section>

            {/* Games Section */}
            <section className="py-16 bg-gray-900">
                <div className="container mx-auto px-4">
                    <h3 className="text-3xl font-bold text-center mb-10 text-white">Popular Games</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
                        {games.map((game, idx) => (
                            <motion.div
                                key={idx}
                                className="bg-gray-800 hover:bg-gray-700 p-6 rounded-xl text-center transition cursor-pointer shadow-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.4, delay: idx * 0.2 }}
                            >
                                <div className="mb-4 text-red-500">{game.icon}</div>
                                <h4 className="text-xl font-semibold">{game.name}</h4>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}