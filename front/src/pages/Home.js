import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlaystation, FaXbox, FaSteam, FaGamepad } from 'react-icons/fa';
import { CardCarousel } from "../component/CardCarousel"
import img1 from "../Asset/images/1.webp";
import img2 from "../Asset/images/2.webp";
import img3 from "../Asset/images/3.webp";

const games = [
    { name: "Cyber Hunt", icon: <FaPlaystation size={50} /> },
    { name: "Zombie Arena", icon: <FaXbox size={50} /> },
    { name: "Steam Rush", icon: <FaSteam size={50} /> },
    { name: "Retro Battle", icon: <FaGamepad size={50} /> },
];

export default function HomePage() {

    const [currentCharacter, setCurrentCharacter] = useState(0);

    // Array of different characters that will rotate
    const characters = [
        {
            name: "Fire Warrior",
            emoji: "🔥",
            color: "text-red-500",
            bgColor: "bg-red-100",
            description: "Master of flames"
        },
        {
            name: "Ice Mage",
            emoji: "❄️",
            color: "text-blue-500",
            bgColor: "bg-blue-100",
            description: "Frozen spells expert"
        },
        {
            name: "Nature Guardian",
            emoji: "🌿",
            color: "text-green-500",
            bgColor: "bg-green-100",
            description: "Forest protector"
        },
        {
            name: "Lightning Knight",
            emoji: "⚡",
            color: "text-yellow-500",
            bgColor: "bg-yellow-100",
            description: "Storm wielder"
        },
        {
            name: "Shadow Assassin",
            emoji: "🌙",
            color: "text-purple-500",
            bgColor: "bg-purple-100",
            description: "Darkness master"
        }
    ];

    // Game cards data
    const gameCards = [
        { id: 1, title: "Power Card", value: "150", type: "Attack" },
        { id: 2, title: "Defense Shield", value: "120", type: "Defense" },
        { id: 3, title: "Magic Potion", value: "80", type: "Health" },
        { id: 4, title: "Speed Boost", value: "200", type: "Agility" }
    ];

    // Change character every 2 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentCharacter((prev) => (prev + 1) % characters.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [characters.length]);

    const currentChar = characters[currentCharacter];
    const images = [
        { src: img1, alt: "Image 1" },
        { src:img2, alt: "Image 2" },
        { src: img3, alt: "Image 3" },
        // { src: img1, alt: "Image 4" },
      ]
    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
            <div className="max-w-7xl mx-auto">
                {/* Main Container */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-screen items-center">

                    {/* Left Side - Game Name */}
                    <div className="flex flex-col items-center lg:items-start justify-center space-y-6">
                        <div className="text-center lg:text-left">
                            <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
                                EPIC
                            </h1>
                            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-2">
                                HEROES
                            </h2>
                            <p className="text-xl text-gray-300 font-medium">
                                Battle Arena
                            </p>
                        </div>

                        {/* Game Stats */}
                        <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-gray-700">
                            <h3 className="text-white text-lg font-semibold mb-3">Game Stats</h3>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-300">
                                    <span>Players Online:</span>
                                    <span className="text-green-400 font-bold">1,247</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Active Battles:</span>
                                    <span className="text-yellow-400 font-bold">89</span>
                                </div>
                                <div className="flex justify-between text-gray-300">
                                    <span>Your Rank:</span>
                                    <span className="text-blue-400 font-bold">#142</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Center - Character Display */}
                    <div className="flex justify-center items-center">
                        <div className="rounded-full w-80 h-80 flex flex-col items-center justify-center shadow-2xl transform transition-all duration-500 hover:scale-105 border-4 border-white border-opacity-20">
                            <div className="text-9xl mb-4 animate-pulse">
                                {currentChar.emoji}
                            </div>
                            <h3 className={`text-2xl font-bold ${currentChar.color} mb-2`}>
                                {currentChar.name}
                            </h3>
                            <p className="text-gray-700 text-center px-4">
                                {currentChar.description}
                            </p>

                            {/* Character Progress Bar */}
                            {/* <div className="w-3/4 bg-gray-300 rounded-full h-2 mt-4">
                                <div
                                    className={`h-2 rounded-full transition-all duration-2000 ${currentChar.color.replace('text-', 'bg-')}`}
                                    style={{ width: `${20 + (currentCharacter * 15)}%` }}
                                ></div>
                            </div> */}
                        </div>

                        {/* Character Selection Dots */}
                        {/* <div className="absolute bottom-1/2 left-1/2 transform -translate-x-1/2 translate-y-20 flex space-x-2">
                            {characters.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-3 h-3 rounded-full transition-all duration-300 ${index === currentCharacter ? 'bg-white' : 'bg-gray-500'
                                        }`}
                                />
                            ))}
                        </div> */}
                    </div>

                    {/* Right Side - Game Cards */}
                    <div className="flex flex-col justify-center space-y-4">
                        <h3 className="text-3xl font-bold text-white mb-6 text-center lg:text-left">
                            Your Cards
                        </h3>

                        {gameCards.map((card, index) => (
                            <div
                                key={card.id}
                                className="bg-gradient-to-r from-gray-800 to-gray-700 rounded-xl p-6 border border-gray-600 hover:border-gray-400 transform hover:-translate-y-1 transition-all duration-300 shadow-lg"
                                style={{ animationDelay: `${index * 0.1}s` }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <h4 className="text-white font-semibold text-lg">{card.title}</h4>
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${card.type === 'Attack' ? 'bg-red-600 text-white' :
                                        card.type === 'Defense' ? 'bg-blue-600 text-white' :
                                            card.type === 'Health' ? 'bg-green-600 text-white' :
                                                'bg-purple-600 text-white'
                                        }`}>
                                        {card.type}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-300">Power Level:</span>
                                    <span className="text-2xl font-bold text-yellow-400">{card.value}</span>
                                </div>

                                {/* Card progress bar */}
                                <div className="w-full bg-gray-600 rounded-full h-1 mt-3">
                                    <div
                                        className="bg-yellow-400 h-1 rounded-full transition-all duration-1000"
                                        style={{ width: `${(parseInt(card.value) / 200) * 100}%` }}
                                    ></div>
                                </div>
                            </div>
                        ))}

                        {/* Action Button */}
                        <button className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-4 px-8 rounded-xl transform hover:scale-105 transition-all duration-300 shadow-lg mt-4">
                            Start Battle
                        </button>
                    </div>
                </div>
                <CardCarousel
        images={images}
        autoplayDelay={2000}
        showPagination={true}
        showNavigation={true}
      />

                {/* Bottom Stats Bar */}
                <div className="fixed bottom-0 left-0 right-0 bg-black bg-opacity-50 backdrop-blur-md p-4">
                    <div className="max-w-7xl mx-auto flex justify-between items-center text-white">
                        <div className="flex space-x-6">
                            <div className="text-center">
                                <div className="text-2xl font-bold text-yellow-400">2,450</div>
                                <div className="text-xs text-gray-400">Gold</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-blue-400">85</div>
                                <div className="text-xs text-gray-400">Gems</div>
                            </div>
                            <div className="text-center">
                                <div className="text-2xl font-bold text-green-400">12</div>
                                <div className="text-xs text-gray-400">Level</div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="text-lg font-semibold">Next Character: {characters[(currentCharacter + 1) % characters.length].name}</div>
                            <div className="text-sm text-gray-400">Changes in 2 seconds</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}