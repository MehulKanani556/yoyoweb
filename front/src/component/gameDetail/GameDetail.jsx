import React, { useState } from 'react'
import { FaChevronDown, FaChevronRight, FaHeart, FaInfo, FaPlay, FaShare, FaShieldAlt, FaStar } from 'react-icons/fa';

const GameDetail = () => {
    const [selectedTab, setSelectedTab] = useState('Strategy');
    const [expandedSections, setExpandedSections] = useState({
        dataPrivacy: false,
        appSupport: false,
        similarGames: false
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const gameImages = [
        "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=250&fit=crop&crop=center",
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=250&fit=crop&crop=center",
    ];

    const minimumRequirements = [
        { label: "OS", value: "Windows 10 (64-bit)" },
        { label: "Storage", value: "5 GB or more available storage space" },
        { label: "Graphics", value: "Intel® UHD Graphics 630" },
        { label: "Processor", value: "1.6GHz physical cores" },
        { label: "Memory", value: "5 GB of RAM" },
        { label: "Windows admin account", value: null },
        { label: "Virtualization must be enabled", value: null },
    ];


    const pcFeatures = [
        "Official Google experience",
        "Google account",
        "Level up with improved controls",
        "Seamless, sync across devices",
        "Earn YOYO Play Points",
    ];


    return (
        <div className="bg-gray-900 min-h-screen text-white">
            {/* Hero Section */}
            <div className="relative bg-gradient-to-b from-gray-800 to-gray-900 px-4 py-12 pt-24">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/20 to-purple-900/20"></div>
                <div className="relative max-w-6xl mx-auto px-4">
                    <div className=" mb-8">
                        <h1 className="text-6xl font-bold text-gray-300 mb-2">CHOOSE YOUR</h1>
                        <h2 className="text-7xl font-black text-gray-100">FACTION</h2>
                    </div>

                    <div className="flex flex-col lg:flex-row items-start space-y-6 lg:space-y-0 lg:space-x-8">
                        {/* <div className="flex-shrink-0">
                            <img
                                src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=100&h=100&fit=crop"
                                alt="Transformers: Earth Wars"
                                className="w-24 h-24 rounded-xl shadow-lg"
                            />
                        </div> */}

                        <div className="flex-1">
                            <div className="mb-2">
                                <span className="text-green-400 text-sm font-medium">Yodo1 Games</span>
                                <p className="text-gray-400 text-sm">In-app purchases</p>
                            </div>

                            <h3 className="text-2xl font-bold mb-4">Transformers: Earth Wars</h3>

                            <div className="flex items-center space-x-6 mb-6">
                                <div className="text-center">
                                    <div className="flex items-center space-x-1 mb-1">
                                        <span className="text-lg font-bold">4.4</span>
                                        <FaStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                    </div>
                                    <p className="text-xs text-gray-400">6.7M reviews</p>
                                </div>

                                <div className="text-center">
                                    <div className="text-lg font-bold mb-1">50M+</div>
                                    <p className="text-xs text-gray-400">Downloads</p>
                                </div>

                                <div className="text-center">
                                    <div className="flex items-center justify-center w-6 h-6 bg-gray-700 rounded mb-1">
                                        <span className="text-xs font-bold">E</span>
                                    </div>
                                    <p className="text-xs text-gray-400">Rated for 10+</p>
                                </div>
                            </div>

                            <div className="flex items-center space-x-4">
                                <button className="bg-green-600 hover:bg-green-700 text-black font-semibold px-8 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                                    <span>Buy Now</span>
                                </button>

                                <button className="border border-gray-600 hover:bg-gray-800 px-6 py-3 rounded-lg flex items-center space-x-2 transition-colors">
                                    <span>Add To Wishlist</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Screenshots */}
                        <div className="flex space-x-4 overflow-x-auto pb-4">
                            {gameImages.map((img, index) => (
                                <img
                                    key={index}
                                    src={img}
                                    alt={`Screenshot ${index + 1}`}
                                    className="w-80 h-48 object-cover rounded-lg flex-shrink-0 shadow-lg"
                                />
                            ))}
                        </div>

                        {/* About Section */}
                        <div className="space-y-4">
                            <div className="flex items-center space-x-2">
                                <h2 className="text-xl font-bold">About this game</h2>
                                <FaChevronRight className="w-5 h-5 text-gray-400" />
                            </div>

                            <p className="text-gray-300 leading-relaxed">
                                Join millions of players in the battle for Earth! Side with the Autobots or Decepticons and assemble the ultimate team of Transformers
                                using Combiners, Triple Changers and Beast Wars characters.
                            </p>

                            <div className="space-y-2">
                                <h3 className="font-semibold text-lg">COLLECT OVER 100 CHARACTERS</h3>
                                <p className="text-gray-300">
                                    Construct the Space Bridge to summon classic heroes Optimus Prime, Grimlock and Bumblebee through to infamous villains
                                    like Megatron, Starscream and Soundwave. Forge powerful Combiners including Devastator, Superion, Predaking, Bruticus and Volcanicus.
                                </p>
                            </div>
                        </div>

                        {/* Tabs */}
                        {/* <div className="border-b border-gray-700">
                            <div className="flex space-x-8">
                                {['Strategy', 'Build & create', 'Multi-player', 'Competitive multiplayer', 'Stylized', 'Robot', 'Battling'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`py-3 px-1 border-b-2 transition-colors ${selectedTab === tab
                                            ? 'border-green-400 text-green-400'
                                            : 'border-transparent text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div> */}

                        {/* Data Safety */}
                        {/* <div className="space-y-4">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleSection('dataPrivacy')}
                            >
                                <h2 className="text-xl font-bold flex items-center space-x-2">
                                    <FaShieldAlt className="w-5 h-5" />
                                    <span>Data safety</span>
                                </h2>
                                {expandedSections.dataPrivacy ? <FaChevronDown className="w-5 h-5" /> : <FaChevronRight className="w-5 h-5" />}
                            </div>

                            {expandedSections.dataPrivacy && (
                                <div className="space-y-4 pl-7">
                                    <p className="text-gray-300">
                                        Safety starts with understanding how developers collect and share your data. Data privacy and security practices may vary based on
                                        your use, region, and age. The developer provided this information and may update it over time.
                                    </p>

                                    <div className="space-y-3">
                                        <div className="flex items-start space-x-3">
                                            <FaInfo className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">This app may share these data types with third parties</p>
                                                <p className="text-xs text-gray-400">Location, Personal info and 4 others</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <FaInfo className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-sm font-medium">This app may collect these data types</p>
                                                <p className="text-xs text-gray-400">Location, Personal info, Messages and 4 others</p>
                                            </div>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <FaShieldAlt className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm font-medium">Data is encrypted in transit</p>
                                        </div>

                                        <div className="flex items-start space-x-3">
                                            <FaInfo className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <p className="text-sm font-medium">You can request that data be deleted</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div> */}

                        {/* Ratings and Reviews */}
                        {/* <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">Ratings and reviews</h2>
                                <span className="text-sm text-gray-400">Ratings and reviews are verified</span>
                            </div>

                            <div className="flex items-center space-x-8">
                                <div className="text-center">
                                    <div className="text-4xl font-bold mb-2">4.4</div>
                                    <div className="flex items-center space-x-1 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <FaStar key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-gray-400">6.7M reviews</p>
                                </div>

                                <div className="flex-1">
                                    {[5, 4, 3, 2, 1].map((rating) => (
                                        <div key={rating} className="flex items-center space-x-3 mb-1">
                                            <span className="text-sm w-2">{rating}</span>
                                            <div className="flex-1 bg-gray-700 h-2 rounded-full">
                                                <div
                                                    className="bg-green-500 h-2 rounded-full"
                                                    style={{ width: rating === 5 ? '70%' : rating === 4 ? '20%' : '10%' }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex space-x-4 border-b border-gray-700">
                                {['Phone', 'Chromebook', 'Tablet'].map((device) => (
                                    <button
                                        key={device}
                                        className="pb-3 px-1 text-sm text-gray-400 hover:text-white border-b-2 border-transparent hover:border-gray-500 transition-colors"
                                    >
                                        {device}
                                    </button>
                                ))}
                            </div>

                            <div className="space-y-6">
                                <div className="flex space-x-4">
                                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-sm font-bold">M</div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="font-medium">Marcus Whitehouse Gaming</span>
                                            <span className="text-xs text-gray-400">5 months ago</span>
                                        </div>
                                        <div className="flex items-center space-x-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-300 mb-2">
                                            I do love Transformers, but Earth Wars has some minor and major problems. The first issue would be tier Bot Power Core, there are
                                            several expensive bots you can...
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                                            <span>Did you find this helpful?</span>
                                            <button className="hover:text-white">Yes</button>
                                            <button className="hover:text-white">No</button>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex space-x-4">
                                    <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center text-sm font-bold">A</div>
                                    <div className="flex-1">
                                        <div className="flex items-center space-x-2 mb-2">
                                            <span className="font-medium">Alexis K</span>
                                            <span className="text-xs text-gray-400">2 months ago</span>
                                        </div>
                                        <div className="flex items-center space-x-1 mb-2">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <FaStar key={star} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                            ))}
                                        </div>
                                        <p className="text-sm text-gray-300 mb-2">
                                            Haven't got to see the characters between all the bugs when you unlock a new one. After a good app for when you want to see the 3D
                                            model of a character for a few seconds right before...
                                        </p>
                                        <div className="flex items-center space-x-4 text-xs text-gray-400">
                                            <span>Did you find this helpful?</span>
                                            <button className="hover:text-white">Yes</button>
                                            <button className="hover:text-white">No</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div> */}

                        {/* What's New */}
                        {/* <div className="space-y-4">
                            <h2 className="text-xl font-bold">What's new</h2>
                            <div className="bg-gray-800 p-4 rounded-lg">
                                <p className="text-sm font-medium mb-2">Celebrate 6 Years of TRANSFORMERS Earth Wars!</p>
                                <p className="text-sm text-gray-300">
                                    Get ready for our sixth anniversary by rolling out a brand new collaborative event type designed to bring the whole
                                    Alliance together in glorious battle against the forces of evil.
                                </p>
                            </div>
                        </div> */}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Play on PC */}
                        <div className="bg-gray-800 p-6 rounded-lg">
                            <div className="flex items-center space-x-3 mb-4">
                                <FaPlay className="w-6 h-6 text-green-400" />
                                <h3 className="font-bold">Play on PC</h3>
                            </div>
                            <p className="text-sm text-gray-300 mb-4">
                                Play this game on your Windows PC using YOYO Games
                            </p>
                            <div className="space-y-3 text-sm text-gray-300">
                                {pcFeatures.map((feature, idx) => (
                                    <div className="flex items-center space-x-3" key={idx}>
                                        <div className="w-5 h-5 bg-green-400 rounded-full flex items-center justify-center">
                                            <div className="w-2 h-2 bg-gray-800 rounded-full"></div>
                                        </div>
                                        <span>{feature}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Minimum Requirements */}
                        <div className="space-y-4">
                            <h3 className="font-bold">Minimum requirements</h3>
                            <div className="space-y-3 text-sm">
                                {minimumRequirements.map((req, idx) => (
                                    <div key={idx}>
                                        <span className="font-medium">{req.label}{req.value ? ": " : ""}</span>
                                        {req.value && <span className="text-gray-300">{req.value}</span>}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* App Support */}
                        {/* <div className="space-y-4">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleSection('appSupport')}
                            >
                                <h3 className="font-bold">App support</h3>
                                {expandedSections.appSupport ? <FaChevronDown className="w-5 h-5" /> : <FaChevronRight className="w-5 h-5" />}
                            </div>
                        </div> */}

                        {/* Similar Games */}
                        {/* <div className="space-y-4">
                            <div
                                className="flex items-center justify-between cursor-pointer"
                                onClick={() => toggleSection('similarGames')}
                            >
                                <h3 className="font-bold">Similar games</h3>
                                <FaChevronRight className="w-5 h-5" />
                            </div>

                            <div className="space-y-3">
                                {similarGames.slice(0, 3).map((game, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <img src={game.image} alt={game.name} className="w-12 h-12 rounded-lg" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{game.name}</p>
                                            <div className="flex items-center space-x-1">
                                                <span className="text-xs">{game.rating}</span>
                                                <FaStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}

                        {/* More by Yodo1 Games */}
                        {/* <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">More by Yodo1 Games</h3>
                                <FaChevronRight className="w-5 h-5" />
                            </div>

                            <div className="space-y-3">
                                {moreByYodo1.slice(0, 3).map((game, index) => (
                                    <div key={index} className="flex items-center space-x-3">
                                        <img src={game.image} alt={game.name} className="w-12 h-12 rounded-lg" />
                                        <div className="flex-1">
                                            <p className="text-sm font-medium">{game.name}</p>
                                            <div className="flex items-center space-x-1">
                                                <span className="text-xs">{game.rating}</span>
                                                <FaStar className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            {/* Footer */}

        </div>
    )
}

export default GameDetail
