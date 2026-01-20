import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { useAuth } from '../context/AuthContext';
import { Star, Calendar, Gamepad2, Plus, MessageSquare, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

interface Review {
    id: number;
    rating: number;
    comment: string;
    created_at: string;
    user: number; // User ID
}

interface Game {
    id: number;
    title: string;
    description: string;
    developer: string;
    publisher: string;
    release_date: string;
    average_rating: number;
    cover_image_url: string;
    genre: string;
    user_library_entry?: {
        id: number;
        status: string;
    } | null;
    reviews?: Review[];
}

export default function GameDetailPage() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState('PLAYING');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(10);
    const [msg, setMsg] = useState('');

    // Fetch Game Data
    const { data: game, isLoading } = useQuery({
        queryKey: ['game', id],
        queryFn: async () => {
            const response = await apiClient.get<Game>(`/games/${id}/`);
            return response as unknown as Game;
        }
    });

    // Sync state with game data when loaded
    useState(() => {
        if (game?.user_library_entry) {
            setStatus(game.user_library_entry.status);
        }
    });

    // Mutation: Add/Update Library
    const libraryMutation = useMutation({
        mutationFn: async (newStatus: string) => {
            if (game?.user_library_entry) {
                // Update existing
                return apiClient.patch(`/library/${game.user_library_entry.id}/`, { status: newStatus });
            } else {
                // Create new
                return apiClient.post('/library/', { game: id, status: newStatus });
            }
        },
        onSuccess: () => {
            setMsg('Library updated!');
            queryClient.invalidateQueries({ queryKey: ['game', id] });
        },
        onError: (err: any) => setMsg(err || 'Failed to update library')
    });

    // Mutation: Add Review
    const reviewMutation = useMutation({
        mutationFn: () => apiClient.post('/reviews/', { game_id: id, rating, comment: reviewText }),
        onSuccess: () => {
            setMsg('Review Submitted!');
            setReviewText('');
            queryClient.invalidateQueries({ queryKey: ['game', id] }); 
        },
        onError: (err: any) => setMsg(err || 'Review Failed')
    });

    if (isLoading) return (
        <div className="w-full min-h-screen bg-gray-50 flex items-center justify-center">
            <motion.div 
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full"
            />
        </div>
    );

    if (!game) return <div className="w-full min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center">Game not found</div>;

    // Handle array response if needed (though API should return object for detail)
    const gameData = Array.isArray(game) ? game[0] : game;

    return (
        <div className="w-full min-h-screen bg-gray-50 pb-20">
            {/* Background Header Image with Blur */}
            <div className="h-80 w-full overflow-hidden relative">
                <img 
                    src={gameData.cover_image_url} 
                    alt="Background" 
                    className="w-full h-full object-cover blur-md opacity-50 scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-50"></div>
            </div>

            <div className="max-w-5xl mx-auto px-6 -mt-32 relative z-10">
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="bg-white rounded-3xl shadow-2xl overflow-hidden"
                >
                    <div className="flex flex-col md:flex-row">
                        {/* Game Cover */}
                        <div className="w-full md:w-1/3 h-96 md:h-auto relative">
                            {gameData.cover_image_url ? 
                                <img src={gameData.cover_image_url} alt={gameData.title} className="w-full h-full object-cover"/> :
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center"><Gamepad2 size={64} className="text-gray-400" /></div>
                            }
                        </div>
                        
                        {/* Game Details */}
                        <div className="p-8 md:p-12 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                    {gameData.genre || "Game"}
                                </span>
                                {gameData.developer && (
                                    <span className="text-gray-500 text-sm font-medium">by {gameData.developer}</span>
                                )}
                            </div>

                            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">{gameData.title}</h1>
                            
                            <div className="flex items-center gap-6 mb-8 border-b border-gray-100 pb-8">
                                <div className="flex items-center gap-2">
                                    <Calendar className="text-gray-400" size={20}/>
                                    <span className="text-gray-700 font-medium">{gameData.release_date}</span>
                                </div>
                                <div className="flex items-center gap-2 bg-yellow-50 px-3 py-1 rounded-lg border border-yellow-100">
                                    <Star className="text-yellow-500" size={20} fill="currentColor"/>
                                    <span className="text-gray-900 font-bold text-lg">{gameData.average_rating}</span>
                                    <span className="text-gray-400 text-sm">/ 10</span>
                                </div>
                            </div>

                            <p className="text-gray-600 text-lg leading-relaxed mb-8 flex-grow">
                                {gameData.description || "No description available."}
                            </p>
                            
                            {/* Actions */}
                            {user ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-gray-50 p-6 rounded-2xl">
                                    {/* Library Action */}
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                            <Plus size={16} /> Manage Library
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            <select 
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value)}
                                                className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 flex-grow min-w-[140px] focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-shadow"
                                            >
                                                <option value="PLAYING">Playing</option>
                                                <option value="COMPLETED">Completed</option>
                                                <option value="WISHLIST">Wishlist</option>
                                                <option value="DROPPED">Dropped</option>
                                            </select>
                                            <button 
                                                onClick={() => libraryMutation.mutate(status)}
                                                className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-bold transition-colors shadow-lg shadow-indigo-200 flex-shrink-0"
                                            >
                                                Save
                                            </button>
                                        </div>
                                    </div>

                                    {/* Review Action */}
                                    <div className="flex flex-col">
                                        <h3 className="text-sm font-bold text-gray-400 uppercase mb-3 flex items-center gap-2">
                                            <MessageSquare size={16} /> Write Review
                                        </h3>
                                        <div className="flex flex-col gap-3">
                                            <div className="flex gap-2">
                                                <input 
                                                    type="number" 
                                                    min="1" max="10" 
                                                    value={rating}
                                                    onChange={(e) => setRating(Number(e.target.value))}
                                                    className="w-16 bg-white border border-gray-300 rounded-lg px-2 py-2 text-center font-bold focus:ring-2 focus:ring-indigo-500 outline-none"
                                                    placeholder="10"
                                                />
                                                <input 
                                                    type="text" 
                                                    placeholder="Your thoughts..."
                                                    value={reviewText}
                                                    onChange={(e) => setReviewText(e.target.value)}
                                                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 text-gray-700 flex-1 min-w-0 focus:ring-2 focus:ring-indigo-500 outline-none"
                                                />
                                            </div>
                                            <button 
                                                onClick={() => reviewMutation.mutate()}
                                                className="w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-semibold transition-colors"
                                            >
                                                Submit Review
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="bg-gray-50 p-6 rounded-2xl flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-100 p-3 rounded-full text-indigo-600">
                                            <LogIn size={24} />
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-bold text-gray-900">Log in to track this game</h3>
                                            <p className="text-gray-500 text-sm">Add to your library and write reviews</p>
                                        </div>
                                    </div>
                                    <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg shadow-indigo-200">
                                        Login Now
                                    </Link>
                                </div>
                            )}
                            
                            {msg && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className={`mt-4 p-4 rounded-lg text-center font-medium ${
                                        msg.includes('Failed') ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'
                                    }`}
                                >
                                    {msg}
                                </motion.div>
                            )}
                        </div>
                        {/* Reviews Section */}
                        <div className="mt-12">
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Reviews</h2>
                            {gameData.reviews && gameData.reviews.length > 0 ? (
                                <div className="space-y-4">
                                    {gameData.reviews.map((review) => (
                                        <div key={review.id} className="bg-gray-50 p-4 rounded-xl">
                                            <div className="flex items-center gap-2 mb-2">
                                                <div className="flex text-yellow-500">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star 
                                                            key={i} 
                                                            size={14} 
                                                            fill={i < Math.round(review.rating / 2) ? "currentColor" : "none"} 
                                                            className={i < Math.round(review.rating / 2) ? "text-yellow-500" : "text-gray-300"}
                                                        />
                                                    ))}
                                                </div>
                                                <span className="font-bold text-gray-900">{review.rating}/10</span>
                                                <span className="text-xs text-gray-500 ml-auto">{new Date(review.created_at).toLocaleDateString()}</span>
                                            </div>
                                            <p className="text-gray-700 text-sm">{review.comment}</p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No reviews yet. Be the first to share your thoughts!</p>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
}
