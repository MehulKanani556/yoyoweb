import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { FaPlaystation, FaXbox, FaSteam, FaGamepad } from 'react-icons/fa';
import { CardCarousel } from "../component/CardCarousel"
import img1 from "../Asset/images/1.webp";
import img2 from "../Asset/images/2.webp";
import img3 from "../Asset/images/3.webp";
import LastWinners from '../component/LastWinners/LastWinners';
import pubg from '../Asset/images/pubgggggg-removebg-preview.png';
import freeFire from '../Asset/images/free-fire-character-removebg-preview.png';
import kumfoo from '../Asset/images/kum-foo-removebg-preview.png';
import sonic from '../Asset/images/sonic-removebg-preview.png';
import mario from '../Asset/images/mario-removebg-preview.png';

const games = [
    { name: "Cyber Hunt", icon: <FaPlaystation size={50} /> },
    { name: "Zombie Arena", icon: <FaXbox size={50} /> },
    { name: "Steam Rush", icon: <FaSteam size={50} /> },
    { name: "Retro Battle", icon: <FaGamepad size={50} /> },
];

export default function HomePage() {

    const [currentCharacter, setCurrentCharacter] = useState(0);
    const [tick, setTick] = useState(0);
    const [activeWinnerName, setActiveWinnerName] = useState('EPIC');
    const [dots, setDots] = useState([]);

    // Array of different characters that will rotate
    const characters = [
        {
            name: "Fire Warrior",
            image: pubg,
            color: "text-red-500",
            bgColor: "bg-red-100",
            description: "Master of flames"
        },
        {
            name: "Ice Mage",
            image: freeFire,
            color: "text-blue-500",
            bgColor: "bg-blue-100",
            description: "Frozen spells expert"
        },
        {
            name: "Nature Guardian",
            image: kumfoo,
            color: "text-green-500",
            bgColor: "bg-green-100",
            description: "Forest protector"
        },
        {
            name: "Lightning Knight",
            image: sonic,
            color: "text-yellow-500",
            bgColor: "bg-yellow-100",
            description: "Storm wielder"
        },
        {
            name: "Shadow Assassin",
            image: mario,
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

    // Change character and advance synced tick every 2 seconds
    useEffect(() => {
        const id = setInterval(() => {
            setTick((prev) => prev + 1);
            setCurrentCharacter((prev) => (prev + 1) % characters.length);
        }, 2000);

        return () => clearInterval(id);
    }, [characters.length]);

    const currentChar = characters[currentCharacter];
    const images = [
        { src: img1, alt: "Image 1" },
        { src: img2, alt: "Image 2" },
        { src: img3, alt: "Image 3" },
        // { src: img1, alt: "Image 4" },
    ]

    useEffect(() => {
        const generateDots = () => {
            const newDots = [];
            const gridSize = 100;
            const containerWidth = window.innerWidth;
            const containerHeight = window.innerHeight;

            // Get all grid line positions (vertical and horizontal)
            const verticalLines = [];
            const horizontalLines = [];

            for (let x = gridSize; x <= containerWidth; x += gridSize) {
                verticalLines.push(x);
            }

            for (let y = gridSize; y <= containerHeight; y += gridSize) {
                horizontalLines.push(y);
            }

            // Create vertical dropping dots along grid lines only - ALL THIN SHORT
            verticalLines.forEach((x, index) => {
                if (Math.random() < 0.25) {
                    newDots.push({
                        id: `grid-drop-${index}`,
                        x,
                        startY: -20,
                        endY: containerHeight + 20,
                        delay: Math.random() * 4,
                        duration: 2 + Math.random() * 2,
                        widthClass: 'w-0.5',
                        heightClass: 'h-5',
                    });
                }
            });

            // Add some horizontal dropping dots along horizontal grid lines - ALL THIN SHORT
            horizontalLines.forEach((y, index) => {
                if (Math.random() < 0.15) {
                    const randomX = verticalLines[Math.floor(Math.random() * verticalLines.length)];
                    newDots.push({
                        id: `horizontal-drop-${index}`,
                        x: randomX,
                        startY: -20,
                        endY: containerHeight + 20,
                        delay: Math.random() * 6,
                        duration: 1.5 + Math.random() * 2.5,
                        widthClass: 'w-0.5',
                        heightClass: 'h-4',
                    });
                }
            });

            setDots(newDots);
        };

        generateDots();

        const handleResize = () => {
            generateDots();
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="relative min-h-screen">
            {/* Animated Background Layer */}
            <div className="absolute inset-0 bg-gradient-to-r from-yellow-950 via-black to-green-950 overflow-hidden pointer-events-none z-0">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255, 255, 255, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 1px, transparent 1px)',
                        backgroundSize: '100px 100px',
                    }}
                />

                {/* Dropping Animated Dots */}
                {dots.map((dot) => (
                    <div
                        key={dot.id}
                        className={`absolute  ${dot.heightClass || 'h-8'} bg-yellow-500 rounded-full shadow-lg`}
                        style={{
                            left: `${dot.x}px`,
                            top: `${dot.startY}px`,
                            width: '2px',
                            transform: 'translateX(-50%)',
                            // boxShadow:
                            //     '0 0 8px #fbbf24, 0 0 16px rgba(251, 191, 36, 0.6), 0 0 24px rgba(251, 191, 36, 0.3)',
                            animation: `dropDown ${dot.duration}s infinite ${dot.delay}s linear`,
                        }}
                    />
                ))}
            </div>

            {/* Foreground Content */}
            <div className="relative z-10">
                <div className="max-w-7xl mx-auto">
                    {/* Main Container */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gaap-8 h-screen items-center">

                        {/* Left Side - Game Name */}
                        <div className="flex flex-col items-center lg:items-start justify-center space-y-6">
                            <div className="text-center lg:text-left">
                                <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent mb-4">
                                    {activeWinnerName}
                                </h1>
                            </div>

                            {/* Game Stats */}
                            {/* <div className="bg-black bg-opacity-30 backdrop-blur-md rounded-xl p-6 border border-gray-700">
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
                        </div> */}
                        </div>

                        {/* Center - Character Display */}
                        <div className="flex justify-center items-center lg:self-end">
                            {currentChar.image ? (
                                <img
                                    src={currentChar.image}
                                    alt={currentChar.name}
                                    className="h-[500px] w-[500px] object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
                                />
                            ) : (
                                <FaGamepad size={120} className={`animate-pulse ${currentChar.color}`} />
                            )}
                        </div>

                        {/* Right Side - Game Cards and Last Winners */}
                        <div className="flex flex-col justify-center space-y-6">
                            <LastWinners tick={tick} onActiveChange={setActiveWinnerName} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Keyframes for background animation */}
            <style>{`
                @keyframes dropDown {
                    0% {
                        transform: translateY(0) translateX(-50%);
                        opacity: 0;
                    }
                    10% {
                        opacity: 1;
                    }
                    90% {
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(100vh) translateX(-50%);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}