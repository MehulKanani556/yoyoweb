import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlaystation, FaXbox, FaSteam, FaGamepad } from 'react-icons/fa';
import CardCarousel from "../component/CardCarousel"
import img1 from "../Asset/images/1.webp";
import img2 from "../Asset/images/2.webp";
import img3 from "../Asset/images/3.webp";
import LastWinners from '../component/LastWinners/LastWinners';
import pubg from '../Asset/images/pubg-2.png';
import freeFire from '../Asset/images/free-fire-character-removebg-preview.png';
import kumfoo from '../Asset/images/kum-foo-removebg-preview.png';
import sonic from '../Asset/images/sonic-removebg-preview.png';
import mario from '../Asset/images/mario-removebg-preview.png';
import CommonButton from '../component/CommonButton';
import InfiniteMarqueeCards from '../component/InfiniteMarqueeCards';

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
                if (Math.random() < 1) {
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
                if (Math.random() < 0.70) {
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
        <>
        <div className="relative h-screen overflow-hidden">
            {/* Animated Background Layer */}
            <div className="pointer-events-none absolute -top-10 -left-40 w-[50%] h-[80vh] rounded-full glow-purple blur-3xl" />
            <div className="pointer-events-none absolute -top-10 -right-40 w-[50%] h-[80vh] rounded-full glow-pink blur-3xl" />
            <div className="absolute inset-0  overflow-hidden pointer-events-none z-0">
                {/* Grid Pattern */}
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            'linear-gradient(rgba(255, 255, 255, 0.5) 2px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.5) 2px, transparent 1px)',
                        backgroundSize: '100px 100px',
                    }}
                />

                <div className='block md:hidden sm:hidden xs:hidden lg:block absolute inset-y-0 left-1/2 transform -translate-x-1/2  h-full z-50'>
                    <img src={require('../Asset/images/bg-1.b4a39a49.png')} alt="Decorative background" />
                </div>

                {/* Dropping Animated Dots */}
                {dots.map((dot) => (
                    <div
                        key={dot.id}
                        className={`absolute  ${dot.heightClass || 'h-8'} bg-yellow-500 rounded-full shadow-lg`}
                        style={{
                            left: `${dot.x}px`,
                            top: `${dot.startY}px`,
                            width: '1px',
                            transform: 'translateX(-100%)',
                            // boxShadow:
                            //     '0 0 8px #fbbf24, 0 0 16px rgba(251, 191, 36, 0.6), 0 0 24px rgba(251, 191, 36, 0.3)',
                            animation: `dropDown ${dot.duration}s infinite ${dot.delay}s linear`,
                        }}
                    />
                ))}
            </div>

            {/* Foreground Content */}
            <div className="relative z-10">
                <div className="max-w-[80%] mx-auto">
                    {/* Main Container */}
                    <div className="flex flex-col lg:flex-row gap-8 h-screen items-center lg:items-center lg:justify-between w-full">

                        {/* Left Side - Game Name */}
                        <div className="order-2 lg:order-1 flex flex-col items-center lg:items-start justify-center space-y-6 p-6 w-full lg:w-1/3">
                            <div className="text-center lg:text-left">
                                <h1 className="text-6xl lg:text-7xl font-bold bg-gradient-to-r from-yellow-400 via-red-500 to-pink-500 bg-clip-text text-transparent pb-4">
                                    {activeWinnerName}
                                </h1>
                            </div>
                        </div>

                        {/* Center - Character Display */}
                        <div className="order-1 h-[50%] lg:order-2 flex justify-center items-center lg:self-end lg:flex w-full lg:w-1/3 mt-[200px] lg:mt-0">
                            <div className="relative w-full max-w-[280px] sm:max-w-[290px] md:max-w-[330px] lg:max-w-[480px] xl:max-w-[520px] aspect-square flex items-end justify-center">
                                {/* Glowing/rotating background behind character only */}


                                {/* Character with animated transitions on change */}
                                <AnimatePresence mode="wait" initial={false}>
                                    <motion.div
                                        key={currentCharacter}
                                        initial={{ opacity: 0, scale: 0.9, y: 20, filter: 'blur(6px)' }}
                                        animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                                        exit={{ opacity: 0, scale: 1.05, y: -20, filter: 'blur(6px)' }}
                                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                                        className="relative z-10"
                                    >
                                        <div
                                            aria-hidden
                                            className="pointer-events-none absolute inset-0 flex items-center justify-center"
                                        >
                                            {/* Soft gradient blobs to create an hourglass-esque glow */}
                                            <div
                                                className="absolute w-[80%] h-[80%] rounded-full opacity-50 blur-2xl"
                                                style={{
                                                    background:
                                                        'radial-gradient(circle at 50% 20%, rgba(251,191,36,0.35), transparent 60%), radial-gradient(circle at 50% 80%, rgba(236,72,153,0.25), transparent 60%)',
                                                }}
                                            />
                                            {/* Rotating conic highlight ring */}
                                            <div
                                                className="absolute w-[88%] h-[88%] rounded-full"
                                                style={{
                                                    background:
                                                        'conic-gradient(from 0deg, rgba(251,191,36,0.25), transparent 30%, rgba(251,191,36,0.25) 60%, transparent 85%, rgba(251,191,36,0.25) 100%)',
                                                    boxShadow:
                                                        '0 0 30px rgba(251,191,36,0.25), inset 0 0 50px rgba(251,191,36,0.15)',
                                                    animation: 'spinSlow 24s linear infinite',
                                                    filter: 'blur(1px)',
                                                }}
                                            />
                                        </div>
                                        <motion.div
                                            animate={{ y: [0, -10, 0] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                                            className="flex items-center justify-center"
                                        >
                                            {currentChar.image ? (
                                                <img
                                                    src={currentChar.image}
                                                    alt={currentChar.name}
                                                    className="w-full h-full object-contain drop-shadow-[0_10px_25px_rgba(0,0,0,0.35)]"
                                                />
                                            ) : (
                                                <FaGamepad size={120} className={`animate-pulse ${currentChar.color}`} />
                                            )}
                                        </motion.div>

                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </div>

                        {/* Right Side - Game Cards and Last Winners */}
                        <div className="order-3 hidden lg:flex flex-col justify-center space-y-6 p-6 w-full lg:w-1/3">
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
            @keyframes spinSlow {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
            }
        `}</style>
        </div>
        <CardCarousel
            images={images}
            autoplayDelay={1000}
            showPagination={true}
            showNavigation={true}
        />
    </>
    );
}