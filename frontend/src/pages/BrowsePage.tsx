import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Link } from 'react-router-dom';
import { Search, Filter, Star, Gamepad2 } from 'lucide-react';
import { motion } from 'framer-motion';

interface Game {
    id: number;
    title: string;
    cover_image_url: string;
    average_rating: number;
    developer: string;
    genre: string;
    release_date: string;
}

const GENRES = ["Action", "RPG", "Adventure", "Shooter", "Strategy", "Puzzle", "Sports", "Racing"];
const SORT_OPTIONS = [
    { label: "Newest Releases", value: "-release_date" },
    { label: "Oldest Releases", value: "release_date" },
    { label: "Highest Rated", value: "-average_rating" },
    { label: "Lowest Rated", value: "average_rating" },
    { label: "Alphabetical (A-Z)", value: "title" },
];

export default function BrowsePage() {
    const [search, setSearch] = useState('');
    const [genre, setGenre] = useState('');
    const [ordering, setOrdering] = useState('-release_date');

    const { data: games, isLoading } = useQuery({
        queryKey: ['games', search, genre, ordering],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            if (genre) params.append('genre', genre);
            if (ordering) params.append('ordering', ordering);
            const response = await apiClient.get(`/games/?${params.toString()}`);
            return response as unknown as Game[];
        }
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        // The query will automatically refetch due to dependency on `search` state
    };

    return (
        <div className="min-h-screen bg-gray-50 pb-20 pt-8">
            <div className="max-w-7xl mx-auto px-6">
                
                {/* Header & Controls */}
                <div className="mb-10">
                    <motion.h1 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="text-4xl font-bold text-gray-900 mb-6 flex items-center gap-3"
                    >
                        <Gamepad2 className="text-indigo-600" size={40} />
                        Browse Games
                    </motion.h1>

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 flex flex-col md:flex-row gap-4 items-center"
                    >
                        {/* Search */}
                        <div className="relative flex-grow w-full md:w-auto">
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input 
                                type="text" 
                                placeholder="Search games, developers..." 
                                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>

                        {/* Filters */}
                        <div className="flex gap-4 w-full md:w-auto">
                            <div className="relative flex-1 md:flex-none">
                                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
                                <select 
                                    className="w-full pl-10 pr-8 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                    value={genre}
                                    onChange={(e) => setGenre(e.target.value)}
                                >
                                    <option value="">All Genres</option>
                                    {GENRES.map(g => <option key={g} value={g}>{g}</option>)}
                                </select>
                            </div>

                            <div className="relative flex-1 md:flex-none">
                                <select 
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl appearance-none focus:ring-2 focus:ring-indigo-500 outline-none cursor-pointer"
                                    value={ordering}
                                    onChange={(e) => setOrdering(e.target.value)}
                                >
                                    {SORT_OPTIONS.map(opt => (
                                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-20">
                         <motion.div 
                            animate={{ rotate: 360 }}
                            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                            className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                        />
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {games && games.length > 0 ? (
                            games.map((game: Game, index: number) => (
                                <motion.div
                                    key={game.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <Link to={`/games/${game.id}`} className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 block h-full flex flex-col group transform hover:-translate-y-1">
                                        <div className="h-56 overflow-hidden relative">
                                            <img 
                                                src={game.cover_image_url} 
                                                alt={game.title} 
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            />
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                                <Star size={14} className="text-yellow-500" fill="currentColor" />
                                                <span className="text-xs font-bold text-gray-800">{game.average_rating}</span>
                                            </div>
                                            {game.genre && (
                                                <div className="absolute bottom-3 left-3 bg-indigo-600/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wide">
                                                    {game.genre}
                                                </div>
                                            )}
                                        </div>
                                        <div className="p-5 flex flex-col flex-grow">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight group-hover:text-indigo-600 transition-colors">{game.title}</h3>
                                            <p className="text-sm text-gray-500 mb-4">{game.developer}</p>
                                            
                                            <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400 font-medium">
                                                <span>{game.release_date}</span>
                                                <span className="text-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity">View Details →</span>
                                            </div>
                                        </div>
                                    </Link>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full text-center py-20 text-gray-500">
                                <p className="text-xl font-semibold">No games found.</p>
                                <p className="mt-2">Try adjusting your filters or search terms.</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}