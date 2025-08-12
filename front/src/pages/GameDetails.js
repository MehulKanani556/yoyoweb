import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FaDownload, FaHeart, FaPlay, FaShare, FaShoppingCart, FaStar, FaTrophy, FaUsers } from 'react-icons/fa'
import { useDispatch, useSelector } from 'react-redux';
import { getGameById } from '../Redux/Slice/game.slice';

export default function GameDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedTab, setSelectedTab] = useState('overview');
    const singleGame = useSelector((state) => state.game.singleGame);
    console.log(singleGame);


    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        if (id) {
            dispatch(getGameById(id))
        }
    }, [id])

    const gameImages = [
        'https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1511512578047-dfb367046420?w=800&h=450&fit=crop',
        'https://images.unsplash.com/photo-1493711662062-fa541adb3fc8?w=800&h=450&fit=crop'
    ];

    const systemRequirements = {
        minimum: {
            os: 'Windows 10 64-bit',
            processor: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
            memory: '8 GB RAM',
            graphics: 'NVIDIA GTX 1060 6GB / AMD RX 580',
            storage: '50 GB available space'
        },
        recommended: {
            os: 'Windows 11 64-bit',
            processor: 'Intel Core i7-10700K / AMD Ryzen 7 3700X',
            memory: '16 GB RAM',
            graphics: 'NVIDIA RTX 3070 / AMD RX 6700 XT',
            storage: '50 GB SSD space'
        }
    };

    const reviews = [
        { user: 'GamerPro2024', rating: 5, comment: 'Absolutely incredible! Best game I\'ve played this year.', date: '2 days ago' },
        { user: 'PixelMaster', rating: 4, comment: 'Great graphics and gameplay, minor bugs but overall amazing.', date: '1 week ago' },
        { user: 'GameCritic', rating: 5, comment: 'A masterpiece of game design and storytelling.', date: '2 weeks ago' }
    ];
    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative">
            {/* Hero Section */}
            <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${singleGame?.cover_image?.url})` }}>
                <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-r from-black/60 to-transparent z-10"></div>
            </div>
            {/* Content will scroll over the background image */}
            <div className="max-w-7xl mx-auto px-6 py-8 relative z-20">
                <div className="relative overflow-hidden mt-[50px] mb-5">
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent z-10 rounded-lg"></div>
                    <img
                        src={singleGame?.cover_image?.url}
                        alt="Game Screenshot"
                        className="w-full h-96 object-cover transition-all duration-700 rounded-lg"
                    />

                    {/* Game Title Overlay */}
                    <div className="absolute inset-0 flex items-end z-20">
                        <div className="p-8 text-white">
                            {/* <div className="flex items-center space-x-4 mb-4">
                            <span className="bg-gradient-to-r from-purple-500 to-pink-500 px-3 py-1 rounded-full text-sm font-semibold">
                                Action RPG
                            </span>
                            <span className="bg-yellow-500/20 text-yellow-300 px-3 py-1 rounded-full text-sm font-semibold">
                                Editor's Choice
                            </span>
                        </div> */}
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent">
                                {singleGame?.title}
                            </h1>
                            <p className="text-sm w-[50%] text-gray-300 mb-4 line-clamp-3">{singleGame?.description}</p>

                            {/* <div className="flex items-center space-x-6">
                            <div className="flex items-center space-x-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FaStar key={star} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                ))}
                                <span className="ml-2 text-sm text-gray-300">4.8 (2,340 reviews)</span>
                            </div>
                            <div className="flex items-center space-x-1">
                                <FaUsers className="w-5 h-5 text-blue-400" />
                                <span className="text-sm text-gray-300">50K+ players</span>
                            </div>
                        </div> */}
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                <FaPlay className="w-5 h-5" />
                                <span>Play Now</span>
                            </button>

                            <button className="bg-gray-800 hover:bg-gray-700 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 border border-gray-600">
                                <FaDownload className="w-5 h-5" />
                                <span>Download Demo</span>
                            </button>

                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 border ${isWishlisted
                                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                                    : 'bg-transparent hover:bg-gray-800 text-white border-gray-600'
                                    }`}
                            >
                                <FaHeart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                            </button>

                            <button className="bg-transparent hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-semibold flex items-center space-x-2 transition-all duration-300 border border-gray-600">
                                <FaShare className="w-5 h-5" />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-gray-700">
                            <nav className="flex space-x-8">
                                {['overview', 'requirements', 'reviews'].map((tab) => (
                                    <button
                                        key={tab}
                                        onClick={() => setSelectedTab(tab)}
                                        className={`py-4 px-2 border-b-2 font-medium text-sm capitalize transition-all duration-300 ${selectedTab === tab
                                            ? 'border-purple-500 text-purple-400'
                                            : 'border-transparent text-gray-400 hover:text-gray-300'
                                            }`}
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </nav>
                        </div>

                        {/* Tab Content */}
                        <div className="bg-gray-800/50 rounded-2xl p-6 backdrop-blur-sm border border-gray-700">
                            {selectedTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-4">About This Game</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {singleGame?.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {singleGame?.tags?.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 mt-2 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 text-xs rounded-full border border-purple-400/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <h4 className="text-xl font-semibold text-white mb-3">Key Features</h4>
                                        <ul className="space-y-2 text-gray-300">
                                            <li className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                <span>Revolutionary neural interface combat system</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                <span>Massive open world with 6 distinct districts</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                <span>Dynamic story with 12 different endings</span>
                                            </li>
                                            <li className="flex items-start space-x-3">
                                                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                <span>Advanced character customization</span>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {selectedTab === 'requirements' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-4">System Requirements</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-gray-900/50 rounded-xl p-4 border border-gray-600">
                                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                                                Minimum
                                            </h4>
                                            <div className="space-y-2 text-sm text-gray-300">
                                                <div><span className="text-gray-400">OS:</span> {systemRequirements.minimum.os}</div>
                                                <div><span className="text-gray-400">Processor:</span> {systemRequirements.minimum.processor}</div>
                                                <div><span className="text-gray-400">Memory:</span> {systemRequirements.minimum.memory}</div>
                                                <div><span className="text-gray-400">Graphics:</span> {systemRequirements.minimum.graphics}</div>
                                                <div><span className="text-gray-400">Storage:</span> {systemRequirements.minimum.storage}</div>
                                            </div>
                                        </div>

                                        <div className="bg-gray-900/50 rounded-xl p-4 border border-green-500/30">
                                            <h4 className="text-lg font-semibold text-white mb-3 flex items-center">
                                                <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                                                Recommended
                                            </h4>
                                            <div className="space-y-2 text-sm text-gray-300">
                                                <div><span className="text-gray-400">OS:</span> {systemRequirements.recommended.os}</div>
                                                <div><span className="text-gray-400">Processor:</span> {systemRequirements.recommended.processor}</div>
                                                <div><span className="text-gray-400">Memory:</span> {systemRequirements.recommended.memory}</div>
                                                <div><span className="text-gray-400">Graphics:</span> {systemRequirements.recommended.graphics}</div>
                                                <div><span className="text-gray-400">Storage:</span> {systemRequirements.recommended.storage}</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedTab === 'reviews' && (
                                <div className="space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-4">Player Reviews</h3>
                                    <div className="space-y-4">
                                        {reviews.map((review, index) => (
                                            <div key={index} className="bg-gray-900/50 rounded-xl p-4 border border-gray-600">
                                                <div className="flex items-center justify-between mb-2">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                                                            {review.user[0]}
                                                        </div>
                                                        <span className="text-white font-semibold">{review.user}</span>
                                                    </div>
                                                    <span className="text-gray-400 text-sm">{review.date}</span>
                                                </div>
                                                <div className="flex items-center space-x-2 mb-2">
                                                    {[1, 2, 3, 4, 5].map((star) => (
                                                        <FaStar
                                                            key={star}
                                                            className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-600'}`}
                                                        />
                                                    ))}
                                                </div>
                                                <p className="text-gray-300">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price & Purchase */}
                        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl p-6 border border-gray-700">
                            <div className="text-center mb-6">
                                <div className="text-3xl font-bold text-white mb-2">$59.99</div>
                                <div className="text-gray-400 line-through">$79.99</div>
                                <div className="bg-red-500 text-white px-2 py-1 rounded text-sm font-semibold inline-block mt-1">
                                    25% OFF
                                </div>
                            </div>

                            <button className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg mb-3">
                                <FaShoppingCart className="w-5 h-5" />
                                <span>Add to Cart</span>
                            </button>

                            <button className="w-full bg-transparent hover:bg-gray-700 text-white py-3 px-6 rounded-xl font-semibold border border-gray-600 transition-all duration-300">
                                Buy as Gift
                            </button>
                        </div>

                        {/* Game Info */}
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <h3 className="text-xl font-bold text-white mb-4">Game Details</h3>
                            <div className="space-y-3 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Developer:</span>
                                    <span className="text-white">Neon Studios</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Publisher:</span>
                                    <span className="text-white">Future Games</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Release Date:</span>
                                    <span className="text-white">March 15, 2024</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Languages:</span>
                                    <span className="text-white">12 supported</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Age Rating:</span>
                                    <span className="text-white">M (Mature 17+)</span>
                                </div>
                            </div>
                        </div>

                        {/* Achievements Preview */}
                        <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-white">Achievements</h3>
                                <FaTrophy className="w-6 h-6 text-yellow-500" />
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
                                        <FaTrophy className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">First Steps</div>
                                        <div className="text-gray-400 text-xs">Complete the tutorial</div>
                                    </div>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                                        <FaStar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-white font-semibold text-sm">Cyber Legend</div>
                                        <div className="text-gray-400 text-xs">Reach max level</div>
                                    </div>
                                </div>
                                <button className="w-full text-purple-400 hover:text-purple-300 text-sm transition-colors duration-300">
                                    View all 48 achievements →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}	