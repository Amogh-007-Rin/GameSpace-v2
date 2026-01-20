import React, { useState } from 'react';
import apiClient from '../api/client';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { UserPlus } from 'lucide-react';

export default function RegisterPage() {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await apiClient.post('/auth/register/', { 
                username, 
                email, 
                password,
                role: 'GAMER' 
            });
            navigate('/login/');
        } catch (err: any) {
            // The interceptor now returns a string, so we can set it directly
            setError(err || 'Registration failed');
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-50 text-gray-900 relative overflow-hidden">
             {/* Decorative Background Circles */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-10 right-10 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-10 left-10 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-purple-50 rounded-full text-purple-600">
                        <UserPlus size={40} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Join GameSpace</h2>
                <p className="text-gray-500 text-center mb-8">Start your journey today</p>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 mb-6 rounded-lg border border-red-100 text-sm font-medium text-center wrap-break-word"
                    >
                        {error}
                    </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                            placeholder="Choose a username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                        <input 
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none transition-all"
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        className="w-full mt-2 bg-purple-600 hover:bg-purple-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-200 transform hover:-translate-y-0.5"
                    >
                        Create Account
                    </button>
                </form>
                
                <div className="mt-8 text-center text-gray-500 text-sm">
                    Already have an account? <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800 hover:underline">Login</Link>
                </div>
            </motion.div>
        </div>
    );
}