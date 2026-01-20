import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Link } from 'react-router-dom';
import { Star, TrendingUp, Calendar, ChevronRight } from 'lucide-react';
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

export default function HomePage() {
    const { data: trendingGames, isLoading: trendingLoading } = useQuery({
        queryKey: ['trendingGames'],
        queryFn: async () => {
            const response = await apiClient.get('/games/?trending=true');
            return response as unknown as Game[];
        }
    });

    const { data: allGames, isLoading: allLoading } = useQuery({
        queryKey: ['allGames'],
        queryFn: async () => {
            const response = await apiClient.get('/games/?ordering=-release_date');
            return response as unknown as Game[];
        }
    });

    if (trendingLoading || allLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
                />
            </div>
        );
    }

    // Top 3 for the Hero Section
    const heroGames = trendingGames ? trendingGames.slice(0, 3) : [];
    // Rest of trending
    const otherTrending = trendingGames ? trendingGames.slice(3) : [];

    return (
        <div className="min-h-screen bg-gray-50 pb-20">
            {/* Hero Section */}
            <motion.section 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="px-8 py-12 max-w-7xl mx-auto"
            >
                <div className="flex items-center gap-2 mb-6">
                    <TrendingUp className="text-indigo-600" size={32} />
                    <h1 className="text-4xl font-bold text-gray-900">Trending Now</h1>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {heroGames.map((game: Game, index: number) => (
                        <motion.div
                            key={game.id}
                            initial={{ y: 50, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Link to={`/games/${game.id}`} className="group block relative h-96 rounded-2xl overflow-hidden shadow-2xl hover:shadow-indigo-200 transition-all duration-300 transform hover:-translate-y-2">
                                <img 
                                    src={game.cover_image_url} 
                                    alt={game.title} 
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-6">
                                    <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <span className="inline-block px-3 py-1 bg-indigo-600 text-white text-xs font-bold rounded-full mb-2">
                                            #{index + 1} Trending
                                        </span>
                                        <h2 className="text-2xl font-bold text-white mb-1">{game.title}</h2>
                                        <div className="flex items-center justify-between text-gray-300 text-sm">
                                            <span>{game.developer}</span>
                                            <div className="flex items-center text-yellow-400 gap-1">
                                                <Star size={16} fill="currentColor" />
                                                <span className="font-bold text-white">{game.average_rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </motion.section>

            {/* Recent Releases Section */}
            <section className="px-8 py-8 max-w-7xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                        <Calendar className="text-indigo-500" />
                        Fresh & Popular
                    </h2>
                    <Link to="/games" className="text-indigo-600 font-semibold hover:text-indigo-800 flex items-center gap-1">
                        View All <ChevronRight size={20} />
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {/* Show rest of the games mixed from trending/all */}
                    {allGames?.map((game: Game, index: number) => (
                        <motion.div
                            key={game.id}
                            initial={{ opacity: 0, scale: 0.9 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                        >
                            <Link to={`/games/${game.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 block h-full flex flex-col">
                                <div className="h-48 overflow-hidden relative">
                                    <img 
                                        src={game.cover_image_url} 
                                        alt={game.title} 
                                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                                    />
                                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                                        <Star size={14} className="text-yellow-500" fill="currentColor" />
                                        <span className="text-xs font-bold text-gray-800">{game.average_rating}</span>
                                    </div>
                                </div>
                                <div className="p-4 flex flex-col flex-grow">
                                    <div className="text-xs text-indigo-500 font-bold uppercase tracking-wider mb-1">
                                        {game.genre || 'Action'}
                                    </div>
                                    <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight line-clamp-1">{game.title}</h3>
                                    <p className="text-sm text-gray-500 mb-3">{game.developer}</p>
                                    
                                    <div className="mt-auto pt-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-400">
                                        <span>{game.release_date}</span>
                                        <span className="group-hover:text-indigo-600 transition-colors">Details →</span>
                                    </div>
                                </div>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    );
}
