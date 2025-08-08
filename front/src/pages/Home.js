import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight, FaPlay, FaStar, } from 'react-icons/fa';
import { SlCalender } from "react-icons/sl";
import { TbUsers } from 'react-icons/tb';


export default function HomePage() {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlaying, setIsAutoPlaying] = useState(true);

    const games = [
        {
            id: 1,
            title: "Cyberpunk Nexus",
            subtitle: "Experience the Future",
            description: "Dive into a neon-lit dystopian world where technology meets humanity. Make choices that shape your destiny in this immersive RPG adventure.",
            genre: "Action RPG",
            rating: 4.8,
            players: "Single Player",
            releaseDate: "2024",
            price: "$59.99",
            image: "../assets/images/horror-game.jpg",
            accent: "from-purple-500 to-pink-500"
        },
        {
            id: 2,
            title: "Dragon's Legacy",
            subtitle: "Forge Your Legend",
            description: "Embark on an epic fantasy journey through mystical realms. Master ancient magic and battle legendary creatures in this open-world masterpiece.",
            genre: "Fantasy RPG",
            rating: 4.9,
            players: "Multiplayer",
            releaseDate: "2024",
            price: "$49.99",
            image: "../assets/images/dragon-thumbnail.webp",
            accent: "from-orange-500 to-red-500"
        },
        {
            id: 3,
            title: "Space Conquest",
            subtitle: "Rule the Galaxy",
            description: "Command your fleet across the cosmos in this strategic space warfare game. Build alliances, conquer planets, and become the ultimate space emperor.",
            genre: "Strategy",
            rating: 4.7,
            players: "Online Multiplayer",
            releaseDate: "2024",
            price: "$39.99",
            image: "../assets/images/dragon-thumbnail.webp",
            accent: "from-blue-500 to-cyan-500"
        },
        {
            id: 4,
            title: "Shadow Realm",
            subtitle: "Face Your Fears",
            description: "Enter a world where darkness reigns supreme. Use stealth and cunning to survive in this atmospheric horror-adventure that will test your nerves.",
            genre: "Horror Adventure",
            rating: 4.6,
            players: "Single Player",
            releaseDate: "2024",
            price: "$44.99",
            image: "../assets/images/sniper-game.jpg",
            accent: "from-gray-500 to-purple-500"
        }
    ];

    useEffect(() => {
        if (isAutoPlaying) {
            const interval = setInterval(() => {
                setCurrentSlide((prev) => (prev + 1) % games.length);
            }, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoPlaying, games.length]);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % games.length);
        setIsAutoPlaying(false);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + games.length) % games.length);
        setIsAutoPlaying(false);
    };

    const goToSlide = (index) => {
        setCurrentSlide(index);
        setIsAutoPlaying(false);
    };

    return (
        <div className="relative w-full h-screen overflow-hidden bg-black">
            {/* Main Slider */}
            <div className="relative w-full h-full">
                {games.map((game, index) => (
                    <div
                        key={game.id}
                        className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === currentSlide
                            ? 'opacity-100 translate-x-0'
                            : index < currentSlide
                                ? 'opacity-0 -translate-x-full'
                                : 'opacity-0 translate-x-full'
                            }`}
                    >
                        {/* Background */}
                        <div
                            className="absolute inset-0 scale-105 bg-cover bg-center bg-no-repeat"
                            style={{
                                backgroundImage: `url(${game.image})`,
                                filter: 'brightness(0.7) contrast(1.1)'
                            }}
                        >
                            <div className="absolute inset-0 bg-black bg-opacity-50" />
                            <div className={`absolute inset-0 bg-gradient-to-r ${game.accent} opacity-20`} />
                        </div>

                        {/* Content */}
                        <div className="relative z-10 flex items-center h-full">
                            <div className="container mx-auto px-6 lg:px-8">
                                <div className="max-w-4xl">
                                    {/* Game Info */}
                                    <div className="mb-4 animate-pulse">
                                        <span className={`inline-block px-4 py-2 bg-gradient-to-r ${game.accent} text-white text-sm font-bold rounded-full uppercase tracking-wider`}>
                                            {game.genre}
                                        </span>
                                    </div>

                                    {/* Title Animation */}
                                    <h1 className={`text-6xl lg:text-8xl font-black text-white mb-4 transform transition-all duration-1000 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}>
                                        <span className={`bg-gradient-to-r ${game.accent} bg-clip-text text-transparent`}>
                                            {game.title}
                                        </span>
                                    </h1>

                                    {/* Subtitle */}
                                    <h2 className={`text-2xl lg:text-3xl text-gray-300 mb-6 font-light transform transition-all duration-1000 delay-200 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}>
                                        {game.subtitle}
                                    </h2>

                                    {/* Description */}
                                    <p className={`text-lg text-gray-400 mb-8 max-w-2xl leading-relaxed transform transition-all duration-1000 delay-300 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}>
                                        {game.description}
                                    </p>

                                    {/* Game Stats */}
                                    <div className={`flex flex-wrap items-center gap-6 mb-8 transform transition-all duration-1000 delay-400 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}>
                                        <div className="flex items-center gap-2 text-yellow-400">
                                            <FaStar className="w-5 h-5 fill-current" />
                                            <span className="text-white font-semibold">{game.rating}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-blue-400">
                                            <TbUsers className="w-5 h-5" />
                                            <span className="text-white">{game.players}</span>
                                        </div>
                                        <div className="flex items-center gap-2 text-green-400">
                                            <SlCalender className="w-5 h-5" />
                                            <span className="text-white">{game.releaseDate}</span>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className={`flex flex-wrap items-center gap-4 transform transition-all duration-1000 delay-500 ${index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
                                        }`}>
                                        <button className={`group flex items-center gap-3 px-8 py-4 bg-gradient-to-r ${game.accent} text-white font-bold rounded-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300`}>
                                            <FaPlay className="w-5 h-5 group-hover:scale-110 transition-transform" />
                                            Buy Now
                                        </button>
                                        <button className="px-8 py-4 bg-white bg-opacity-10 text-white font-bold rounded-xl border-2 border-white border-opacity-20 backdrop-blur-sm hover:bg-opacity-20 hover:border-opacity-40 transition-all duration-300">
                                            {game.price}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Arrows */}
            <button
                onClick={prevSlide}
                className="absolute left-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-300 hover:scale-110"
            >
                <FaChevronLeft className="w-6 h-6" />
            </button>
            <button
                onClick={nextSlide}
                className="absolute right-6 top-1/2 transform -translate-y-1/2 z-20 p-3 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-all duration-300 hover:scale-110"
            >
                <FaChevronRight className="w-6 h-6" />
            </button>

            {/* Slide Indicators */}
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex gap-3">
                {games.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToSlide(index)}
                        className={`w-12 h-2 rounded-full transition-all duration-300 ${index === currentSlide
                            ? 'bg-white shadow-lg'
                            : 'bg-white bg-opacity-30 hover:bg-opacity-50'
                            }`}
                    />
                ))}
            </div>

            {/* Progress Bar */}
            <div className="absolute bottom-0 left-0 w-full h-1 bg-black bg-opacity-30 z-20">
                <div
                    className={`h-full bg-gradient-to-r ${games[currentSlide].accent} transition-all duration-1000 ease-linear`}
                    style={{
                        width: isAutoPlaying ? '100%' : '0%',
                        transition: isAutoPlaying ? 'width 5s linear' : 'width 0.3s ease'
                    }}
                />
            </div>

            {/* Floating UI Elements */}
            <div className="absolute top-6 right-6 z-20 flex items-center gap-4 pt-16">
                <div className="bg-black bg-opacity-50 backdrop-blur-sm px-4 py-2 rounded-full text-white text-sm">
                    {currentSlide + 1} / {games.length}
                </div>
            </div>
        </div>
    );
}