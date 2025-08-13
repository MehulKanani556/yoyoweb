import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { FaApple, FaChevronDown, FaCopy, FaFacebook, FaHeart, FaLinkedin, FaShare, FaShoppingCart, FaTelegram, FaTimes, FaWhatsapp, FaWindows } from 'react-icons/fa'
import { TiArrowBack } from "react-icons/ti";
import { useDispatch, useSelector } from 'react-redux';
import { getGameById } from '../Redux/Slice/game.slice';
import { DiAndroid } from 'react-icons/di';
import { FaXTwitter } from 'react-icons/fa6';

// Custom Share Modal Component
const ShareModal = ({ isOpen, onClose, singleGame, currentUrl }) => {
    const [copied, setCopied] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);

    // Handle modal opening animation
    useEffect(() => {
        if (isOpen) {
            setIsAnimating(true);
        }
    }, [isOpen]);

    // Handle ESC key press to close modal
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' && isOpen) {
                handleClose();
            }
        };

        // Add event listener when modal is open
        if (isOpen) {
            document.addEventListener('keydown', handleEscKey);
        }

        // Cleanup event listener
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [isOpen]);

    // Handle modal closing with animation
    const handleClose = () => {
        setIsAnimating(false);
        setTimeout(() => {
            onClose();
        }, 200); // Match the transition duration
    };

    if (!isOpen) return null;

    const shareData = {
        title: singleGame?.title || 'Check out this Game',
        description: singleGame?.description || 'Amazing Game',
        url: currentUrl
    };

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(currentUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch (err) {
            console.error('Failed to copy link');
        }
    };

    const shareOptions = [
        {
            name: 'Facebook',
            icon: FaFacebook,
            color: 'bg-blue-600 hover:bg-blue-700',
            url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`
        },
        {
            name: 'Twitter',
            icon: FaXTwitter,
            color: 'bg-sky-500 hover:bg-sky-600',
            url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareData.title)}`
        },
        {
            name: 'WhatsApp',
            icon: FaWhatsapp,
            color: 'bg-green-600 hover:bg-green-700',
            url: `https://wa.me/?text=${encodeURIComponent(shareData.title + ' ' + currentUrl)}`
        },
        {
            name: 'LinkedIn',
            icon: FaLinkedin,
            color: 'bg-blue-700 hover:bg-blue-800',
            url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(currentUrl)}`
        },
        {
            name: 'Telegram',
            icon: FaTelegram,
            color: 'bg-blue-500 hover:bg-blue-600',
            url: `https://t.me/share/url?url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareData.title)}`
        }
    ];

    const handleSocialShare = (url) => {
        window.open(url, '_blank', 'width=600,height=400');
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            handleClose();
        }
    };

    return (
        <div className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 transition-all duration-200 ease-in-out ${isAnimating
            ? 'bg-black bg-opacity-50 backdrop-blur-sm'
            : 'bg-black bg-opacity-0 backdrop-blur-none'
            }`} onClick={handleBackdropClick}>
            <div className={`backdrop-blur-sm rounded-2xl shadow-2xl w-full max-w-md mx-auto transition-all duration-200 ease-in-out transform ${isAnimating
                ? 'scale-100 opacity-100 translate-y-0'
                : 'scale-95 opacity-0 translate-y-4'
                }`}>
                {/* Modal Header */}
                <div className="flex items-center justify-between p-3 md:px-6 md:py-4 border-b border-white/50">
                    <h2 className="text-base sm:text-xl font-bold text-white tracking-wider">
                        Share Game
                    </h2>
                    <button
                        onClick={handleClose}
                        className="text-white transition-colors"
                    >
                        <FaTimes className='text-base sm:text-xl' />
                    </button>
                </div>

                {/* Modal Content */}
                <div className="p-3 sm:p-6">
                    {/* Game Preview */}
                    <div className="mb-6">
                        <h3 className="font-semibold text-white mb-2">{shareData.title}</h3>
                        <p className="text-white/50 text-sm line-clamp-2">{shareData.description}</p>
                    </div>

                    {/* Share Options */}
                    <div className="space-y-4">
                        <h4 className="font-medium text-white">Share on social media</h4>
                        <div className="grid grid-cols-5 gap-3">
                            {shareOptions.map((option) => (
                                <button
                                    key={option.name}
                                    onClick={() => handleSocialShare(option.url)}
                                    className={`${option.color} text-white p-2 sm:py-3 sm:px-4 rounded sm:rounded-lg font-medium transition-colors flex items-center justify-center gap-2`}
                                >
                                    <option.icon className='text-base sm:text-lg' />
                                    {/* {option.name} */}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Copy Link */}
                    <div className="mt-6 pt-4 border-t border-white/50">
                        <h4 className="font-medium text-white mb-3">Or copy link</h4>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={currentUrl}
                                readOnly
                                className="flex-1 px-3 py-2 border border-white rounded-lg text-sm text-white bg-transparent focus:outline-none"
                            />
                            <button
                                onClick={handleCopyLink}
                                className={`p-2 sm:px-4 sm:py-2 focus:outline-none rounded-lg font-medium tracking-wide transition-colors flex items-center gap-2 ${copied
                                    ? 'bg-green-500 text-black'
                                    : 'bg-transparent text-white border border-white rounded-lg'
                                    }`}
                            >
                                <FaCopy size={14} />
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default function GameDetails() {
    const { id } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isWishlisted, setIsWishlisted] = useState(false);
    const [selectedTab, setSelectedTab] = useState('overview');
    const [selectedPlatform, setSelectedPlatform] = useState('');
    const [openPlatform, setOpenPlatform] = useState(null);
    const singleGame = useSelector((state) => state.game.singleGame);
    const loading = useSelector((state) => state.game.loading);
    console.log("singleGame", singleGame);
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = (image) => {
        setSelectedImage(image);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedImage(null);
    };

    const getAvailablePlatforms = () => {
        const platforms = singleGame?.platforms;
        if (!platforms) return {};

        const availablePlatforms = {};

        // Check each platform and include only if available is true
        if (platforms.windows?.available) {
            availablePlatforms.windows = platforms.windows;
        }
        if (platforms.ios?.available) {
            availablePlatforms.ios = platforms.ios;
        }
        if (platforms.android?.available) {
            availablePlatforms.android = platforms.android;
        }

        return availablePlatforms;
    };

    useEffect(() => {
        window.scrollTo(0, 0);
    }, [])

    useEffect(() => {
        const availablePlatforms = getAvailablePlatforms();
        if (Object.keys(availablePlatforms).length > 0) {
            setOpenPlatform(Object.keys(availablePlatforms)[0]); // Set the first platform as open
        }
        if (!availablePlatforms[selectedPlatform]) {
            setSelectedPlatform(Object.keys(availablePlatforms)[0]);
        }
    }, [singleGame, selectedPlatform]);

    useEffect(() => {
        if (id) {
            dispatch(getGameById(id))
        }
    }, [id])

    const togglePlatform = (platformKey) => {
        setOpenPlatform(prev => (prev === platformKey ? null : platformKey)); // Close if the same platform is clicked
    };

    return (
        <div className="min-h-screen relative">
            {/* Hero Section */}
            <div className="fixed inset-0 bg-cover bg-center -z-10" style={{ backgroundImage: `url(${singleGame?.cover_image?.url})` }}>
                <div className="absolute inset-0 backdrop-blur-md bg-gradient-to-r from-black/60 to-transparent z-10"></div>
            </div>
            {/* Content will scroll over the background image */}
            <div className="max-w-7xl mx-auto px-6 py-8 relative z-20">
                <div className="relative overflow-hidden mt-[50px] mb-5">
                    {/* backdrop-blur-lg bg-black/40 rounded-full */}
                    <TiArrowBack onClick={() => { navigate(-1) }} className='cursor-pointer absolute inset-0 z-30 text-white top-2 left-2 text-3xl 
                    [filter:drop-shadow(0_3px_2px_rgba(0,0,0,0.5))]' />
                    <img
                        src={singleGame?.cover_image?.url}
                        alt="Game Screenshot"
                        className="w-full h-96 object-cover transition-all duration-700 rounded-lg"
                    />

                    {/* Game Title Overlay */}
                    <div className="absolute inset-0 flex items-end">
                        <div className="p-8 text-white">
                            <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-purple-200 bg-clip-text text-transparent [filter:drop-shadow(0_3px_2px_rgba(0,0,0,0.5))] tracking-wide">
                                {singleGame?.title}
                            </h1>
                            <p className="text-sm w-[50%] text-gray-300 mb-4 line-clamp-3">{singleGame?.description}</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-4">
                            <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3 rounded-md font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg">
                                <span>Buy Now</span>
                            </button>

                            <button
                                onClick={() => setIsWishlisted(!isWishlisted)}
                                className={`px-6 py-3 rounded-md font-semibold flex items-center space-x-2 transition-all duration-300 border ${isWishlisted
                                    ? 'bg-red-600 hover:bg-red-700 text-white border-red-600'
                                    : 'bg-transparent hover:bg-black/50 text-white border-white/40'
                                    }`}
                            >
                                <FaHeart className={`w-5 h-5 ${isWishlisted ? 'fill-white' : ''}`} />
                                <span>{isWishlisted ? 'Wishlisted' : 'Add to Wishlist'}</span>
                            </button>

                            <button className="bg-transparent hover:bg-black/50 text-white px-6 py-3 rounded-md font-semibold flex items-center space-x-2 transition-all duration-300 border border-white/40" onClick={() => { setShowShareModal(true); }}>
                                <FaShare className="w-5 h-5" />
                                <span>Share</span>
                            </button>
                        </div>

                        {/* Tabs */}
                        <div className="border-b border-white/40">
                            <nav className="flex space-x-8">
                                {['overview', 'requirements'].map((tab) => (
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
                        <div className="bg-black/50 rounded-xl p-6 backdrop-blur-sm border border-white/40">
                            {selectedTab === 'overview' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-white mb-4">About This Game</h3>
                                        <p className="text-gray-300 leading-relaxed">
                                            {singleGame?.description}
                                        </p>

                                    </div>
                                    <div>
                                        <h4 className="text-xl font-semibold text-white mb-2">Tags</h4>
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
                                            {singleGame?.instructions?.map((ins) => (
                                                <li key={ins} className="flex items-start space-x-3">
                                                    <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
                                                    <span>{ins}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {selectedTab === 'requirements' && (
                                <div className="space-y-2">
                                    {Object.keys(getAvailablePlatforms()).map((platformKey) => {
                                        const platform = getAvailablePlatforms()[platformKey];
                                        if (platform.available) {
                                            return (
                                                <div key={platformKey} className="border border-white/40 rounded-lg overflow-hidden">
                                                    <button
                                                        onClick={() => togglePlatform(platformKey)}
                                                        className="w-full px-4 py-3 text-left flex justify-between items-center hover:bg-black/30 focus:outline-none transition-colors duration-200"
                                                        aria-expanded={openPlatform === platformKey}
                                                        aria-controls={`platform-content-${platformKey}`}
                                                    >
                                                        <h3 className="text-lg font-medium text-white">
                                                            {platformKey.charAt(0).toUpperCase() + platformKey.slice(1)}
                                                        </h3>
                                                        <FaChevronDown
                                                            className={`w-5 h-5 text-white transform transition-transform duration-200 ${openPlatform === platformKey ? 'rotate-180' : ''}`}
                                                        />
                                                    </button>

                                                    <div
                                                        id={`platform-content-${platformKey}`}
                                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openPlatform === platformKey ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
                                                    >
                                                        <div className="px-4 pb-4 pt-2 border-t border-white/40">
                                                            {platform.system_requirements && (
                                                                <ul className="space-y-2">
                                                                    {Object.entries(platform.system_requirements).map(([key, value]) => (
                                                                        <li key={key} className="text-white/50">
                                                                            <strong className="text-white tracking-wider">{key} :</strong> {value}
                                                                        </li>
                                                                    ))}
                                                                </ul>
                                                            )}
                                                        </div>
                                                    </div>
                                                </div>
                                            );
                                        }
                                        return null;
                                    })}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* platforms Tabs and Tab Content */}
                        <div className="bg-black/50 rounded-xl py-3 px-6 backdrop-blur-sm border border-white/40">
                            <nav className="flex space-x-4 mb-2">
                                {Object.keys(getAvailablePlatforms()).map((platform) => (
                                    <button
                                        key={platform}
                                        onClick={() => setSelectedPlatform(platform)}
                                        className={`p-2 border-b-2 font-medium text-2xl capitalize transition-all duration-300 ${selectedPlatform === platform
                                            ? 'border-purple-500 text-purple-400'
                                            : 'border-transparent text-white/50 hover:text-white'
                                            }`}
                                    >
                                        {/* {platform} */}
                                        {platform === 'windows' && <FaWindows title="Show Windows Price" className={`${selectedPlatform === platform ? 'text-blue-500' : ''}`} />}
                                        {platform === 'ios' && <FaApple title="Show Ios Price" className={`${selectedPlatform === platform ? 'text-white' : ''}`} />}
                                        {platform === 'android' && <DiAndroid title="Show Android Price" className={`${selectedPlatform === platform ? 'text-green-500' : ''}`} />}
                                    </button>
                                ))}
                            </nav>

                            {selectedPlatform && singleGame?.platforms?.[selectedPlatform] && (
                                <div className="flex items-center justify-between">
                                    <div className="text-sm md:text-base">
                                        <p className="text-white">Price : $ {singleGame.platforms[selectedPlatform].price}</p>
                                        <p className="text-white">Size : {singleGame.platforms[selectedPlatform].size}</p>
                                    </div>
                                    <button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-2 h-10 rounded-md font-semibold flex items-center space-x-2 transition-all duration-300 transform hover:scale-105 shadow-lg text-xs">
                                        <FaShoppingCart className="w-4 h-4" />
                                        <span>Add To Cart</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Game Info */}
                        {/* <div className="bg-gray-800/50 rounded-xl p-6 border border-white/40">
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
                        </div> */}
                        <div className="bg-black/50 rounded-xl p-3 backdrop-blur-sm border border-white/40">
                            <div className="grid grid-cols-2 gap-4">
                                {singleGame?.images.map((image) => (
                                    <img
                                        key={image?._id}
                                        src={image?.url}
                                        alt={`Image of ${singleGame?.title}`}
                                        className="rounded-lg w-[165px] h-[220px]" // Add any additional styling you need
                                        onClick={() => openModal(image)} // Open modal on click
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Achievements Preview */}
                        {/* <div className="bg-gray-800/50 rounded-xl p-6 border border-white/40">
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
                        </div> */}
                    </div>
                </div>

            </div>
            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-30">
                    <div className="p-4 rounded-lg relative z-30">
                        <button onClick={closeModal} className="absolute top-6 right-6 text-white text-2xl [filter:drop-shadow(0_3px_2px_rgba(0,0,0,0.5))]"><FaTimes /></button>
                        <img src={selectedImage?.url} alt={`Selected image of ${singleGame?.title}`} className="w-[400px] h-[600px] rounded-md" />
                    </div>
                </div>
            )}

            <ShareModal
                isOpen={showShareModal}
                onClose={() => setShowShareModal(false)}
                singleGame={singleGame}
                currentUrl={window.location.href}
            />
        </div>
    );
}	