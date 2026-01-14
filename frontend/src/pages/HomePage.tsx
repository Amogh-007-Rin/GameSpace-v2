import { useQuery } from '@tanstack/react-query';
import apiClient from '../api/client';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

interface Game {
    id: number;
    title: string;
    cover_image_url: string;
    average_rating: string;
    developer: string;
}

export default function HomePage() {
    // TanStack Query handles fetching, loading, and error states automatically
    const { data: games, isLoading } = useQuery({
        queryKey: ['trendingGames'],
        queryFn: async () => apiClient.get<Game[]>('/games/?trending=true')
    });

    if (isLoading) return <div className="text-white p-10">Loading Trending Games...</div>;

    return (
        <div className="min-h-screen bg-gray-900 text-white p-8">
            <h1 className="text-4xl font-bold mb-8 text-blue-400">Trending Now</h1>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* @ts-ignore - The API returns the array directly due to our interceptor */}
                {games?.map((game: Game) => (
                    <Link to={`/games/${game.id}`} key={game.id} className="bg-gray-800 rounded-lg overflow-hidden hover:scale-105 transition">
                        <div className="h-48 bg-gray-700 flex items-center justify-center">
                            {/* Placeholder for cover image if null */}
                            <span className="text-gray-500">{game.title} Cover</span>
                        </div>
                        <div className="p-4">
                            <h2 className="text-xl font-bold">{game.title}</h2>
                            <p className="text-gray-400 text-sm">{game.developer}</p>
                            <div className="flex items-center mt-2 text-yellow-400">
                                <Star size={16} fill="currentColor" />
                                <span className="ml-1 font-bold">{game.average_rating}</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}