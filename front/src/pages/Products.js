import React, { useState } from 'react'
import { FaFire, FaSearch, FaTimes } from 'react-icons/fa';
import { LuClock, LuDownload, LuEye, LuFilter, LuGamepad2, LuHeart, LuPlay, LuSearch, LuShare2, LuStar, LuTrendingUp, LuTrophy, LuUsers, LuZap } from 'react-icons/lu';
import { VscArrowBoth } from "react-icons/vsc";

export default function Products() {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState('popular');
    const [favorites, setFavorites] = useState(new Set([1, 3, 5]));
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [isOpen, setIsOpen] = useState(false);
    const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);

    const options = [
        { value: "popular", label: "Most Popular" },
        { value: "rating", label: "Highest Rated" },
        { value: "downloads", label: "Most Downloaded" },
        { value: "price", label: "Price: Low to High" },
        { value: "newest", label: "Newest First" },
    ];

    const handleSelect = (value) => {
        setSortBy(value);
        setIsOpen(false);
    };

    const categories = [
        { id: 'all', name: 'All Category', icon: LuGamepad2, count: 248, color: 'from-purple-500 to-pink-500' },
        { id: 'featured', name: 'Featured', icon: FaFire, count: 12, color: 'from-orange-500 to-red-500' },
        { id: 'trending', name: 'Trending', icon: LuTrendingUp, count: 24, color: 'from-green-500 to-blue-500' },
        { id: 'action', name: 'Action', icon: LuZap, count: 68, color: 'from-red-500 to-orange-500' },
        { id: 'adventure', name: 'Adventure', icon: LuTrophy, count: 45, color: 'from-blue-500 to-indigo-500' },
        { id: 'puzzle', name: 'Puzzle', icon: LuStar, count: 39, color: 'from-purple-500 to-blue-500' },
        { id: 'racing', name: 'Racing', icon: LuZap, count: 28, color: 'from-yellow-500 to-orange-500' },
        { id: 'sports', name: 'Sports', icon: LuTrophy, count: 22, color: 'from-green-500 to-teal-500' }
    ];

    const games = [
        {
            id: 1,
            title: "Cyberpunk Legends",
            category: "action",
            rating: 4.9,
            players: "1-4 players",
            duration: "60+ min",
            downloads: "5.2M",
            image: "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800&h=600&fit=crop",
            tags: ["Sci-Fi", "Multiplayer", "Open World"],
            price: "$59.99",
            discount: 25,
            isNew: true,
            featured: true,
            description: "An epic cyberpunk adventure in a neon-lit dystopian future"
        },
        {
            id: 2,
            title: "Mystic Realms",
            category: "adventure",
            rating: 4.7,
            players: "1 player",
            duration: "80+ min",
            downloads: "3.8M",
            image: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=600&fit=crop",
            tags: ["Fantasy", "Story-rich", "RPG"],
            price: "$49.99",
            discount: 0,
            isNew: false,
            featured: true,
            description: "Embark on a magical journey through enchanted kingdoms"
        },
        {
            id: 3,
            title: "Quantum Puzzles",
            category: "puzzle",
            rating: 4.8,
            players: "1 player",
            duration: "30 min",
            downloads: "7.1M",
            image: "https://images.unsplash.com/photo-1606092195730-5d7b9af1efc5?w=800&h=600&fit=crop",
            tags: ["Logic", "Brain-teaser", "Minimalist"],
            price: "Free",
            discount: 0,
            isNew: false,
            featured: false,
            description: "Mind-bending puzzles that challenge your perception of reality"
        },
        {
            id: 4,
            title: "Empire Chronicles",
            category: "strategy",
            rating: 4.6,
            players: "2-8 players",
            duration: "120+ min",
            downloads: "2.3M",
            image: "https://images.unsplash.com/photo-1611996575749-79a3a250f79e?w=800&h=600&fit=crop",
            tags: ["Strategy", "Civilization", "Multiplayer"],
            price: "$39.99",
            discount: 15,
            isNew: true,
            featured: false,
            description: "Build and conquer civilizations across multiple eras"
        },
        {
            id: 5,
            title: "Velocity Racers",
            category: "racing",
            rating: 4.5,
            players: "1-12 players",
            duration: "20 min",
            downloads: "4.7M",
            image: "https://images.unsplash.com/photo-1552820728-8b83bb6b773f?w=800&h=600&fit=crop",
            tags: ["Racing", "Arcade", "Fast-paced"],
            price: "$29.99",
            discount: 30,
            isNew: false,
            featured: true,
            description: "High-octane racing with stunning visuals and realistic physics"
        },
        {
            id: 6,
            title: "Champions League Pro",
            category: "sports",
            rating: 4.4,
            players: "2 players",
            duration: "90 min",
            downloads: "6.2M",
            image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=600&fit=crop",
            tags: ["Football", "Simulation", "Tournament"],
            price: "$44.99",
            discount: 20,
            isNew: false,
            featured: false,
            description: "The most realistic football simulation experience"
        },
        {
            id: 7,
            title: "Shadow Ninjas",
            category: "action",
            rating: 4.7,
            players: "1-2 players",
            duration: "45 min",
            downloads: "3.5M",
            image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=600&fit=crop",
            tags: ["Stealth", "Action", "Japanese"],
            price: "$34.99",
            discount: 10,
            isNew: true,
            featured: false,
            description: "Master the way of the ninja in feudal Japan"
        },
        {
            id: 8,
            title: "Space Odyssey",
            category: "adventure",
            rating: 4.8,
            players: "1 player",
            duration: "100+ min",
            downloads: "2.9M",
            image: "https://images.unsplash.com/photo-1446776877081-d282a0f896e2?w=800&h=600&fit=crop",
            tags: ["Space", "Exploration", "Sci-Fi"],
            price: "$54.99",
            discount: 0,
            isNew: false,
            featured: true,
            description: "Explore the vast cosmos in this epic space adventure"
        }
    ];

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
            (selectedCategory === 'featured' && game.featured) ||
            (selectedCategory === 'trending' && game.isNew);
        const matchesSearch = game.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            game.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
        return matchesCategory && matchesSearch;
    });

    const sortedGames = [...filteredGames].sort((a, b) => {
        switch (sortBy) {
            case 'rating':
                return b.rating - a.rating;
            case 'downloads':
                return parseFloat(b.downloads.replace(/[^\d.]/g, '')) - parseFloat(a.downloads.replace(/[^\d.]/g, ''));
            case 'price':
                const priceA = a.price === 'Free' ? 0 : parseFloat(a.price.replace('$', ''));
                const priceB = b.price === 'Free' ? 0 : parseFloat(b.price.replace('$', ''));
                return priceA - priceB;
            case 'newest':
                return b.isNew - a.isNew;
            default:
                return b.rating - a.rating;
        }
    });

    const getDiscountedPrice = (price, discount) => {
        if (price === 'Free' || discount === 0) return price;
        const originalPrice = parseFloat(price.replace('$', ''));
        const discountedPrice = originalPrice * (1 - discount / 100);
        return `$${discountedPrice.toFixed(2)}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* Animated Background */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-10 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500 rounded-full opacity-10 animate-pulse animation-delay-1000"></div>
                <div className="absolute top-3/4 left-1/2 w-48 h-48 bg-blue-500 rounded-full opacity-10 animate-pulse animation-delay-2000"></div>
            </div>

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-800/50 to-pink-800/50"></div>
                <div className="relative px-6 pt-20 pb-6 lg:py-20">
                    <div className="text-center">
                        <h1 className="text-[25px] lg:text-[60px] font-bold mb-3 lg:mb-6 bg-gradient-to-r from-white via-purple-200 to-pink-200 bg-clip-text text-transparent">
                            Game Universe
                        </h1>
                        <p className="text-sm lg:text-lg text-white/60 max-w-3xl mx-auto">
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
                                        onClick={() => { setIsSearchOpen(!isSearchOpen) }}
                                        className="inline-flex md:hidden items-center justify-end text-xl rounded-full text-white/60 hover:text-white focus:outline-none transition-all duration-300 outline-none"
                                    >
                                        {isSearchOpen ? <FaTimes /> : <LuSearch />}
                                    </button>
                                </div>

                                {/* Sort and View Controls */}
                                <div className="flex justify-start sm:justify-between flex-col sm:flex-row sm:items-center gap-4">
                                    <button
                                        onClick={() => { setIsSearchOpen(!isSearchOpen) }}
                                        className="hidden md:inline-flex items-center justify-end text-xl rounded-full text-white/60 hover:text-white focus:outline-none transition-all duration-300 outline-none"
                                    >
                                        {isSearchOpen ? <FaTimes /> : <LuSearch />}
                                    </button>
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

                        <div className="grid grid-cols-1 md600:grid-cols-2 2xl:grid-cols-3 3xl:grid-cols-4 gap-8 relative z-10">
                            {sortedGames?.map((game, index) => (
                                <div
                                    key={game.id}
                                    className="group relative bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10 hover:border-purple-400/50 transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/20"
                                    style={{ animationDelay: `${index * 0.1}s` }}
                                >
                                    {/* Image Container */}
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={game.image}
                                            alt={game.title}
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
                                            {game.featured && (
                                                <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold">
                                                    FEATURED
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

                                        {/* Rating */}
                                        <div className="absolute bottom-4 left-4 flex items-center gap-2">
                                            <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded-full backdrop-blur-md">
                                                <LuStar className="w-4 h-4 text-yellow-400 fill-current" />
                                                <span className="text-white text-sm font-medium">{game.rating}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-white mb-2 group-hover:text-purple-300 transition-colors">
                                            {game.title}
                                        </h3>

                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">{game.description}</p>

                                        {/* Tags */}
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {game.tags.slice(0, 3).map(tag => (
                                                <span
                                                    key={tag}
                                                    className="px-3 py-1 bg-gradient-to-r from-purple-500/20 to-pink-500/20 text-purple-200 text-xs rounded-full border border-purple-400/30"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>

                                        {/* Game Info */}
                                        <div className="grid grid-cols-2 gap-4 text-sm text-white/70 mb-6">
                                            <div className="flex items-center gap-2">
                                                <LuUsers className="w-4 h-4" />
                                                <span>{game.players}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <LuClock className="w-4 h-4" />
                                                <span>{game.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <LuDownload className="w-4 h-4" />
                                                <span>{game.downloads}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <LuEye className="w-4 h-4" />
                                                <span>HD Quality</span>
                                            </div>
                                        </div>

                                        {/* Price and CTA */}
                                        <div className="flex items-center justify-between">
                                            <div className="text-white">
                                                {game.discount > 0 && game.price !== 'Free' ? (
                                                    <div>
                                                        <span className="text-2xl font-bold text-green-400">
                                                            {getDiscountedPrice(game.price, game.discount)}
                                                        </span>
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-sm text-gray-400 line-through">{game.price}</span>
                                                            <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                                                                -{game.discount}%
                                                            </span>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <span className={`text-2xl font-bold ${game.price === 'Free' ? 'text-green-400' : 'text-white'
                                                        }`}>
                                                        {game.price}
                                                    </span>
                                                )}
                                            </div>

                                            <button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-2 rounded-xl font-medium hover:from-purple-600 hover:to-pink-600 transition-all hover:scale-105 flex items-center gap-2">
                                                <LuPlay className="w-4 h-4" />
                                                {game.price === 'Free' ? 'Play' : 'Buy'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
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
        </div>
    )
}
