import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Star, Calendar, Gamepad2 } from 'lucide-react';

interface Game {
    id: number;
    title: string;
    description: string;
    developer: string;
    publisher: string;
    release_date: string;
    average_rating: number;
    cover_image_url: string;
}

export default function GameDetailPage() {
    const { id } = useParams<{ id: string }>();
    const queryClient = useQueryClient();
    const [status, setStatus] = useState('PLAYING');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [msg, setMsg] = useState('');

    // Fetch Game Data
    const { data: game, isLoading } = useQuery({
        queryKey: ['game', id],
        queryFn: async () => apiClient.get<Game>(`/games/${id}`)
    });

    // Mutation: Add to Library
    const libraryMutation = useMutation({
        mutationFn: (newStatus: string) => apiClient.post('/library/', { game: id, status: newStatus }),
        onSuccess: () => setMsg('Added to Library!'),
        onError: (err: any) => setMsg(err || 'Failed to add')
    });

    // Mutation: Add Review
    const reviewMutation = useMutation({
        mutationFn: () => apiClient.post('/reviews/', { game_id: id, rating, comment: reviewText }),
        onSuccess: () => {
            setMsg('Review Submitted!');
            queryClient.invalidateQueries({ queryKey: ['game', id] }); 
        },
        onError: (err: any) => setMsg(err || 'Review Failed')
    });

    if (isLoading) return <div className="w-full min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    if (!game) return <div className="w-full min-h-screen bg-gray-900 text-white flex items-center justify-center">Game not found</div>;

    // Handle array response if needed
    const gameData = Array.isArray(game) ? game[0] : game;

    return (
        <div className="w-full min-h-screen bg-gray-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Section */}
                <div className="flex flex-col md:flex-row gap-8 bg-gray-800 p-6 rounded-lg shadow-xl">
                    <div className="w-full md:w-1/3 h-64 bg-gray-700 flex items-center justify-center rounded overflow-hidden">
                        {gameData.cover_image_url ? 
                            <img src={gameData.cover_image_url} alt={gameData.title} className="w-full h-full object-cover"/> :
                            <Gamepad2 size={64} className="text-gray-500" />
                        }
                    </div>
                    
                    <div className="flex-1">
                        <h1 className="text-4xl font-bold mb-2">{gameData.title}</h1>
                        <div className="flex items-center gap-4 text-gray-400 mb-4">
                            <span className="flex items-center"><Calendar size={16} className="mr-1"/> {gameData.release_date}</span>
                            <span className="flex items-center text-yellow-400"><Star size={16} className="mr-1" fill="currentColor"/> {gameData.average_rating}/10</span>
                        </div>
                        <p className="text-gray-300 mb-6 leading-relaxed">{gameData.description || "No description available."}</p>
                        
                        {/* Library Controls */}
                        <div className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                            <h3 className="text-sm font-bold text-gray-400 uppercase mb-2">Manage Library</h3>
                            <div className="flex gap-2">
                                <select 
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    className="bg-gray-800 border border-gray-600 rounded p-2 text-white flex-1 focus:outline-none focus:border-blue-500"
                                >
                                    <option value="PLAYING">Playing</option>
                                    <option value="COMPLETED">Completed</option>
                                    <option value="WISHLIST">Wishlist</option>
                                    <option value="DROPPED">Dropped</option>
                                </select>
                                <button 
                                    onClick={() => libraryMutation.mutate(status)}
                                    className="bg-green-600 hover:bg-green-500 px-6 py-2 rounded font-bold transition duration-200"
                                >
                                    Add
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Feedback Message */}
                {msg && <div className="mt-4 p-4 bg-blue-600/20 border border-blue-500 text-blue-200 rounded text-center font-bold">{msg}</div>}

                {/* Review Section */}
                <div className="mt-8 bg-gray-800 p-6 rounded-lg shadow-xl">
                    <h2 className="text-2xl font-bold mb-4">Write a Review</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Rating (1-10)</label>
                            <input 
                                type="number" 
                                min="1" max="10" 
                                value={rating}
                                onChange={(e) => setRating(parseInt(e.target.value))}
                                className="bg-gray-900 border border-gray-700 p-2 rounded w-20 text-center focus:border-blue-500 focus:outline-none"
                            />
                        </div>
                        <textarea 
                            value={reviewText}
                            onChange={(e) => setReviewText(e.target.value)}
                            placeholder="Share your thoughts..."
                            className="w-full h-32 bg-gray-900 border border-gray-700 p-3 rounded focus:border-blue-500 focus:outline-none"
                        />
                        <button 
                            onClick={() => reviewMutation.mutate()}
                            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-2 px-6 rounded transition duration-200"
                        >
                            Submit Review
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
