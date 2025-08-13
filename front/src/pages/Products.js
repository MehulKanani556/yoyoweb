import React, { useEffect, useState } from 'react'
import { FaApple, FaTimes, FaWindows } from 'react-icons/fa';
import { LuFilter, LuGamepad2, LuHeart, LuPlay, LuSearch, LuStar, LuTrendingUp, LuTrophy, LuUsers, LuZap } from 'react-icons/lu';
import { FiShoppingCart } from "react-icons/fi";
import { useDispatch, useSelector } from 'react-redux';
import { getAllActiveGames } from '../Redux/Slice/game.slice';
import { getAllCategories } from '../Redux/Slice/category.slice';
import { DiAndroid } from "react-icons/di";
import { useNavigate } from 'react-router-dom';
import BackgroundColor from '../component/BackgroundColor';
import gr from '../Asset/images/gr.svg'
import gr2 from '../Asset/images/gr2.svg'
import gr3 from '../Asset/images/gr3.svg'
import gr4 from '../Asset/images/gr4.svg'

export default function Products() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [favorites, setFavorites] = useState(new Set([1, 3, 5]));
    const [grid, setGrid] = useState(4);
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState({});
    const ActiveGames = useSelector((state) => state.game.games);
    const categoriesName = useSelector((state) => state.category.categories);

    useEffect(() => {
        dispatch(getAllActiveGames())
        dispatch(getAllCategories())
    }, [dispatch])

    const options = [
        { value: "popular", label: "Most Popular" },
        { value: "price", label: "Price: Low to High" },
        { value: "price_desc", label: "Price: High to Low" },
        { value: "newest", label: "Newest First" },
    ];

    const handleSelect = (value) => {
        setSortBy(value);
        setIsOpen(false);
    };

    // Icon mapping for categories
    const getIconForCategory = (categoryName) => {
        const iconMap = {
            'action': LuZap,
            'adventure': LuTrophy,
            'puzzle': LuStar,
            'racing': LuZap,
            'sports': LuTrophy,
            'strategy': LuStar,
            'rpg': LuGamepad2,
            'simulation': LuUsers,
            'arcade': LuPlay,
            'fighting': LuZap,
            'platform': LuGamepad2,
            'shooter': LuZap
        };

        const key = categoryName.toLowerCase();
        return iconMap[key] || LuGamepad2;
    };

    // Color mapping for categories
    const getColorForCategory = (categoryName) => {
        const colorMap = {
            'action': 'from-red-500 to-orange-500',
            'adventure': 'from-blue-500 to-indigo-500',
            'puzzle': 'from-purple-500 to-blue-500',
            'racing': 'from-yellow-500 to-orange-500',
            'sports': 'from-green-500 to-teal-500',
            'strategy': 'from-indigo-500 to-purple-500',
            'rpg': 'from-purple-500 to-pink-500',
            'simulation': 'from-cyan-500 to-blue-500',
            'arcade': 'from-pink-500 to-rose-500',
            'fighting': 'from-red-600 to-orange-600',
            'platform': 'from-green-400 to-blue-500',
            'shooter': 'from-gray-500 to-gray-700'
        };

        const key = categoryName.toLowerCase();
        return colorMap[key] || 'from-purple-500 to-pink-500';
    };

    // const categories = [
    //     { id: 'all', name: 'All Category', icon: LuGamepad2, count: 248, color: 'from-purple-500 to-pink-500' },
    //     // { id: 'featured', name: 'Featured', icon: FaFire, count: 12, color: 'from-orange-500 to-red-500' },
    //     { id: 'trending', name: 'Trending', icon: LuTrendingUp, count: 24, color: 'from-green-500 to-blue-500' },
    //     { id: 'action', name: 'Action', icon: LuZap, count: 68, color: 'from-red-500 to-orange-500' },
    //     { id: 'adventure', name: 'Adventure', icon: LuTrophy, count: 45, color: 'from-blue-500 to-indigo-500' },
    //     { id: 'puzzle', name: 'Puzzle', icon: LuStar, count: 39, color: 'from-purple-500 to-blue-500' },
    //     { id: 'racing', name: 'Racing', icon: LuZap, count: 28, color: 'from-yellow-500 to-orange-500' },
    //     { id: 'sports', name: 'Sports', icon: LuTrophy, count: 22, color: 'from-green-500 to-teal-500' }
    // ];

    // Convert dynamic categories to the format expected by the component
    const getDynamicCategories = () => {
        const baseCategories = [
            {
                id: 'all',
                name: 'All Category',
                icon: LuGamepad2,
                count: ActiveGames?.length,
                color: 'from-purple-500 to-pink-500'
            },
            {
                id: 'trending',
                name: 'Trending',
                icon: LuTrendingUp,
                count: ActiveGames?.filter(game => game.isNew)?.length,
                color: 'from-green-500 to-blue-500'
            }
        ];

        const dynamicCategories = categoriesName?.map(category => ({
            id: category.categoryName.toLowerCase(),
            name: category.categoryName,
            icon: getIconForCategory(category.categoryName),
            count: ActiveGames?.filter(game => game.category.categoryName?.toLowerCase() === category.categoryName.toLowerCase())?.length || 0,
            color: getColorForCategory(category.categoryName),
            _id: category._id
        })) || [];

        return [...baseCategories, ...dynamicCategories];
    };
    // Convert dynamic games to the format expected by the component
    const getFormattedGames = () => {
        return ActiveGames?.map((game, index) => {
            // Get the best available platform price
            // const getBestPrice = () => {
            //     const platforms = game.platforms;
            //     if (!platforms) return 'Free';

            //     const prices = [];
            //     if (platforms.windows?.available && platforms.windows?.price > 0) prices.push(platforms.windows.price);
            //     if (platforms.ios?.available && platforms.ios?.price > 0) prices.push(platforms.ios.price);
            //     if (platforms.android?.available && platforms.android?.price > 0) prices.push(platforms.android.price);

            //     if (prices.length === 0) return 'Free';
            //     return `$${Math.min(...prices).toFixed(2)}`;
            // };

            const getAvailablePlatforms = () => {
                const platforms = game.platforms;
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

            // Calculate total downloads (mock data since not in API)
            // const getDownloads = () => {
            //     const downloadValues = ['1.2M', '2.5M', '3.8M', '4.1M', '5.2M', '6.7M', '7.1M', '8.3M'];
            //     return downloadValues[index % downloadValues.length];
            // };

            // // Generate rating (mock data since not in API)
            // const getRating = () => {
            //     const ratings = [4.2, 4.3, 4.4, 4.5, 4.6, 4.7, 4.8, 4.9];
            //     return ratings[index % ratings.length];
            // };

            // // Get players info
            // const getPlayers = () => {
            //     const playerOptions = ['1 player', '1-2 players', '1-4 players', '2-8 players', '1-12 players'];
            //     return playerOptions[index % playerOptions.length];
            // };

            // // Get duration
            // const getDuration = () => {
            //     const durations = ['20 min', '30 min', '45 min', '60+ min', '80+ min', '90 min', '100+ min', '120+ min'];
            //     return durations[index % durations.length];
            // };

            const getBestPrice = () => {
                const platforms = game.platforms;
                if (!platforms) return 'Free';

                const prices = [];
                Object.keys(platforms).forEach(platform => {
                    if (platforms[platform].available && platforms[platform].price > 0) {
                        prices.push(platforms[platform].price);
                    }
                });
                if (prices.length === 0) return 'Free';
                return prices.length > 0 ? Math.min(...prices) : 'Free';
            };

            // Check if game is new (created in last 7 days)
            const isNewGame = new Date(game.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

            return {
                id: game._id,
                title: game.title,
                category: game.category?.categoryName?.toLowerCase() || 'action',
                // rating: getRating(),
                // players: getPlayers(),
                // duration: getDuration(),
                // downloads: getDownloads(),
                // availablePlatforms: getAvailablePlatforms(),
                tags: game.tags || [],
                price: getBestPrice(),
                // discount: index % 3 === 0 ? (10 + (index % 3) * 10) : 0, // Mock discount
                cover_image: game.cover_image?.url,
                isNew: isNewGame,
                description: game.description,
                instructions: game.instructions,
                platforms: getAvailablePlatforms(),
                images: game.images
            };
        }) || [];
    };

    const categories = getDynamicCategories();
    const games = getFormattedGames();

    const toggleFavorite = (gameId) => {
        setFavorites(prev => {
            const newFavorites = new Set(prev);
            if (newFavorites.has(gameId)) {
                newFavorites.delete(gameId);
            } else {
                newFavorites.add(gameId);
            }
            return newFavorites;
        });
    };

    const filteredGames = games.filter(game => {
        const matchesCategory = selectedCategory === 'all' ||
            game.category === selectedCategory ||
            // (selectedCategory === 'featured' && game.featured) ||
            (selectedCategory === 'trending' && game.isNew);
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    // Helper to get a game's price for sorting based on selected platform
    const getPriceForSorting = (game) => {
        const gamePlatforms = game.platforms || {};
        const selectedPlatformForGame = selectedPlatforms[game.id] || (gamePlatforms.windows ? 'windows' : null);

        if (selectedPlatformForGame && gamePlatforms[selectedPlatformForGame]) {
            const price = gamePlatforms[selectedPlatformForGame].price;
            return typeof price === 'number' ? price : 0;
        }

        const prices = Object.values(gamePlatforms)
            .map((p) => (typeof p?.price === 'number' ? p.price : 0))
            .filter((n) => n > 0);
        return prices.length ? Math.min(...prices) : 0;
    };

    const sortedGames = [...filteredGames].sort((a, b) => {
        switch (sortBy) {
            case 'popular':
                return 0; // keep original order
            case 'price':
                return getPriceForSorting(a) - getPriceForSorting(b);
            case 'price_desc':
                return getPriceForSorting(b) - getPriceForSorting(a);
            case 'newest':
                return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
            default:
                return 0;
        }
    });

    // Note: If discount pricing is needed later, reintroduce a helper.

    return (
        <BackgroundColor className="relative ">
            {/* Hero Section */}
            <div className="relative overflow-hidden">
                {/* <div className="absolute inset-0 bg-gradient-to-r from-purple-800/50 to-pink-800/50"></div> */}
                <div className="relative px-6 pt-20 pb-6 lg:py-20">
                    <div className="text-center">
                        <h1 className="text-[25px] lg:text-[60px] font-bold mb-3 lg:mb-6 text-primary-light">
                            Game Universe
                        </h1>
                        <p className="text-sm lg:text-lg text-primary-light/60 max-w-3xl mx-auto">
                            {/* mb-8 */}
                            Discover incredible gaming experiences from indie gems to AAA blockbusters.
                            Your next gaming obsession awaits.
                        </p>
                        {/* <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-300">
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur">
                                <LuStar className="w-4 h-4 text-yellow-400" />
                                <span>248 Premium Games</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur">
                                <LuDownload className="w-4 h-4 text-green-400" />
                                <span>50M+ Downloads</span>
                            </div>
                            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur">
                                <LuUsers className="w-4 h-4 text-blue-400" />
                                <span>2M+ Players</span>
                            </div>
                        </div> */}
                    </div>
                </div>
            </div>

            <div className="relative px-4 lg:px-8 xl:px-16 py-8">
                <div className="grid grid-cols-4 gap-4 lg:gap-8">
                    {/* Categories Sidebar */}
                    <div className="col-span-1 hidden md:block">
                        <div className="bg-white/5 backdrop-blur-xl rounded-lg lg:rounded-3xl p-3 xl:p-6 border border-white/10 sticky top-8">
                            <h3 className="text-xl lg:text-2xl font-bold text-white mb-3 lg:mb-6 flex items-center gap-3">
                                <LuGamepad2 className="hidden lg:block w-6 h-6 text-purple-400" />
                                Categories
                            </h3>
                            <div className="space-y-3">
                                {categories.map(category => {
                                    const IconComponent = category.icon;
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setSelectedCategory(category.id)}
                                            className={`w-full group relative overflow-hidden rounded-lg lg:rounded-2xl transition-all duration-300 hover:scale-105 ${selectedCategory === category.id
                                                ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-2xl'
                                                : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
                                                }`}
                                        >
                                            <div className="flex items-center justify-between p-3 xl:p-4">
                                                <div className="flex items-center gap-3 text-sm">
                                                    <IconComponent className="w-5 h-5 hidden lg:block" />
                                                    <span className="font-medium">{category.name}</span>
                                                </div>
                                                <span className={`hidden lg:block text-sm px-2 py-1 rounded-full ${selectedCategory === category.id
                                                    ? 'bg-white/20'
                                                    : 'bg-white/10'
                                                    }`}>
                                                    {category.count}
                                                </span>
                                            </div>
                                            {selectedCategory === category.id && (
                                                <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                            )}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Games Grid */}
                    <div className="md:col-span-3 col-span-4">
                        {/* Search and Filters */}
                        <div className="bg-white/5 backdrop-blur-xl rounded-lg lg:rounded-2xl p-4 mb-4 border border-white/10 relative z-20">
                            <div className="flex md:justify-end flex-col md600:flex-row gap-3">
                                {/* Search */}
                                <div className='flex justify-start sm:justify-end gap-1'>
                                    {isSearchOpen && (
                                        <div className="relative flex-1">
                                            <LuSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                                            <input
                                                type="text"
                                                placeholder="Search for your next adventure..."
                                                value={searchTerm}
                                                onChange={(e) => setSearchTerm(e.target.value)}
                                                className="w-full pl-12 pr-6 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all backdrop-blur text-sm"
                                            />
                                        </div>
                                    )}
                                    <button
                                        onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchTerm(''); }}
                                        className="inline-flex md:hidden items-center justify-end text-xl rounded-full text-white/60 hover:text-white focus:outline-none transition-all duration-300 outline-none"
                                    >
                                        {isSearchOpen ? <FaTimes /> : <LuSearch />}
                                    </button>
                                </div>

                                {/* Sort and View Controls */}
                                <div className="flex justify-start sm:justify-between flex-col sm:flex-row sm:items-center gap-2">
                                    <button
                                        onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchTerm(''); }}
                                        className="hidden md:inline-flex items-center justify-end text-xl rounded-full text-white/60 hover:text-white focus:outline-none transition-all duration-300 outline-none"
                                    >
                                        {isSearchOpen ? <FaTimes /> : <LuSearch />}
                                    </button>
                                    <div className="flex gap-2 items-center">
                                        <img
                                            onClick={() => setGrid(4)}
                                            src={gr4}
                                            alt="grid"
                                            className="w-5 h-5 object-contain cursor-pointer"
                                        />
                                        <img
                                            onClick={() => setGrid(1)}
                                            src={gr}
                                            alt="grid"
                                            className="w-5 h-5 object-contain cursor-pointer"
                                        />
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <LuGamepad2 className="block sm:hidden text-white/60 w-5 h-5" />
                                        <div className="relative inline-block text-left md:hidden">
                                            {/* Dropdown Button */}
                                            <button
                                                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                                                className="bg-white/10 border border-white/20 rounded-lg px-3 md:px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur flex justify-between items-center w-32 md:w-48 lg:w-64 text-sm"
                                            >
                                                {/* Categories */}
                                                {categories.find((c) => c?.id === selectedCategory)?.name}
                                                <svg
                                                    className={`w-4 h-4 ml-2 transition-transform ${isCategoriesOpen ? "rotate-180" : ""
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isCategoriesOpen && (
                                                <div className="text-sm absolute mt-2 w-32 md:w-48 lg:w-64 bg-gray-800 border border-white/20 rounded-lg shadow-lg text-white z-50">
                                                    {categories.map((category) => {
                                                        return (
                                                            <button
                                                                key={category.id}
                                                                onClick={() => { setSelectedCategory(category.id); setIsCategoriesOpen(false) }}
                                                                className={`w-full group relative overflow-hidden transition-all duration-300 ${selectedCategory === category.id
                                                                    ? 'bg-gradient-to-r ' + category.color + ' text-white shadow-2xl'
                                                                    : 'bg-white/5 text-white/80 hover:bg-white/10'
                                                                    }`}
                                                            >
                                                                <div className="flex items-center justify-between p-2 md:p-3 xl:p-4">
                                                                    <span className="font-medium">{category.name}</span>
                                                                </div>
                                                                {selectedCategory === category.id && (
                                                                    <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                                                                )}
                                                            </button>
                                                        )
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <LuFilter className="text-white/60 w-5 h-5" />
                                        <div className="relative inline-block text-left">
                                            {/* Dropdown Button */}
                                            <button
                                                onClick={() => setIsOpen(!isOpen)}
                                                className="bg-white/10 border border-white/20 rounded-lg px-3 md:px-6 py-2 text-white focus:outline-none focus:ring-2 focus:ring-purple-400 backdrop-blur flex justify-between items-center w-44 md:w-48 lg:w-64 text-sm"
                                            >
                                                {options.find((o) => o.value === sortBy)?.label}
                                                <svg
                                                    className={`w-4 h-4 ml-2 transition-transform ${isOpen ? "rotate-180" : ""
                                                        }`}
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="2"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </button>

                                            {/* Dropdown Menu */}
                                            {isOpen && (
                                                <div className="text-sm absolute mt-2 w-44 md:w-48 lg:w-64 bg-gray-800 border border-white/20 rounded-lg shadow-lg text-white z-50">
                                                    {options.map((option) => (
                                                        <div
                                                            key={option.value}
                                                            onClick={() => handleSelect(option.value)}
                                                            className={`px-3 md:px-6 py-2 cursor-pointer hover:bg-purple-500/20 ${sortBy === option.value ? "bg-purple-500/30" : ""
                                                                }`}
                                                        >
                                                            {option.label}
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center justify-between mb-4 lg:mb-8">
                            <div>
                                <h2 className="text-lg lg:text-3xl font-bold text-white mb-1 lg:mb-2 tracking-wider">
                                    {selectedCategory === 'all' ? 'All Games' :
                                        categories.find(c => c.id === selectedCategory)?.name || 'Games'}
                                </h2>
                                <p className="text-white/60 text-sm lg:text-base">
                                    Showing {sortedGames?.length} games
                                </p>
                            </div>
                        </div>

                        <div className={`grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-${grid} gap-8 relative z-10`}>
                            {sortedGames?.map((game, index) => {
                                const selectedPlatform = selectedPlatforms[game.id] || (game.platforms?.windows ? 'windows' : (game.platforms?.ios ? 'ios' : (game.platforms?.android ? 'android' : 'windows')));
                                return (
                                    <div
                                        key={game.id}
                                        className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20 cursor-pointer"
                                        style={{ animationDelay: `${index * 0.1}s` }}
                                        onClick={() => { navigate(`/gamedetails/${game.id}`) }}
                                    >
                                        {/* Image Container */}
                                        <div className="relative h-48 overflow-hidden">
                                            <img
                                                src={game?.cover_image}
                                                alt={game?.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                                            {/* Badges */}
                                            <div className="absolute top-4 left-4 flex gap-2">
                                                {game.isNew && (
                                                    <span className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-3 py-1 rounded-full text-xs font-bold animate-pulse">
                                                        NEW
                                                    </span>
                                                )}
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                                <button
                                                    onClick={() => toggleFavorite(game.id)}
                                                    className={`p-2 rounded-full backdrop-blur-md transition-all duration-300 ${favorites.has(game.id)
                                                        ? 'bg-red-500 text-white scale-110'
                                                        : 'bg-black/30 text-white hover:bg-red-500 hover:scale-110'
                                                        }`}
                                                >
                                                    <LuHeart className={`w-4 h-4 ${favorites.has(game.id) ? 'fill-current' : ''}`} />
                                                </button>
                                            </div>

                                            {/* Play Button Overlay */}
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300">
                                                <button className="bg-white/90 text-gray-900 p-4 rounded-full hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl">
                                                    <LuPlay className="w-6 h-6 ml-1" />
                                                </button>
                                            </div>
                                        </div>

                                        {/* Content */}
                                        <div className="p-6">
                                            <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                                {game.title}
                                            </h3>

                                            <p className="text-gray-400 text-sm mb-4 line-clamp-3">{game.description}</p>
                                            {/* Platforms */}
                                            <div className="mt-4">
                                                <h4 className="text-lg font-semibold text-white tracking-wider">Platforms :</h4>
                                                <div className="text-white/40 text-base flex gap-4 mt-2">
                                                    {Object.keys(game.platforms).map(platform => (
                                                        <div
                                                            key={platform}
                                                            className={`flex items-center cursor-pointer`}
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                setSelectedPlatforms(prev => ({ ...prev, [game.id]: platform }));
                                                            }}
                                                        >
                                                            {platform === 'windows' && <FaWindows title="Show Windows Price" className={`${selectedPlatform === platform ? 'text-blue-500' : ''}`} />}
                                                            {platform === 'ios' && <FaApple title="Show Ios Price" className={`${selectedPlatform === platform ? 'text-white' : ''}`} />}
                                                            {platform === 'android' && <DiAndroid title="Show Android Price" className={`${selectedPlatform === platform ? 'text-green-500' : ''}`} />}
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            {/* Tags */}
                                            {/* <div className="flex flex-wrap gap-2 mb-4">
                                            {game.tags.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 text-xs rounded-full border border-purple-400/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div> */}

                                            {/* Price and CTA */}
                                            <div className="flex items-center justify-between">
                                                <div className="mt-2 text-white flex flex-col gap-1">
                                                    <p className=''>Price - $ {game.platforms[selectedPlatform]?.price}</p>
                                                    <p className=''>Size - {game.platforms[selectedPlatform]?.size}</p>
                                                </div>

                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        try {
                                                            const key = 'yoyoCart';
                                                            const existing = JSON.parse(localStorage.getItem(key) || '[]');
                                                            const itemId = game.id + ':' + selectedPlatform;
                                                            const next = Array.isArray(existing) ? [...existing] : [];
                                                            const idx = next.findIndex((it) => it?.id === itemId);
                                                            if (idx >= 0) {
                                                                next[idx] = { ...next[idx], qty: (next[idx]?.qty || 1) + 1 };
                                                            } else {
                                                                next.push({ id: itemId, gameId: game.id, platform: selectedPlatform, qty: 1 });
                                                            }
                                                            localStorage.setItem(key, JSON.stringify(next));
                                                            window.dispatchEvent(new Event('cartUpdated'));
                                                        } catch (err) {
                                                            // ignore
                                                        }
                                                    }}
                                                    className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-3 py-2 rounded-md font-medium hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 flex items-center gap-2"
                                                >
                                                    <FiShoppingCart className="w-4 h-4" />
                                                    Add To Cart
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>

                        {sortedGames.length === 0 && (
                            <div className="text-center py-20">
                                <LuGamepad2 className="w-16 h-16 text-white/30 mx-auto mb-4" />
                                <div className="text-white/60 text-2xl mb-4">No games found</div>
                                <div className="text-white/40">Try adjusting your search or category filters</div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </BackgroundColor>
    )
}
