import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Gamepad2 } from 'lucide-react';

export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        try {
            await login(username, password);
            navigate('/');
        } catch (err: any) {
            console.error(err);
            setError('Invalid username or password.');
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 text-gray-900 relative overflow-hidden">
             {/* Decorative Background Circles */}
             <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute -top-20 -left-20 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-50"></div>
            </div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="bg-white p-8 md:p-10 rounded-3xl shadow-2xl w-full max-w-md border border-gray-100 relative z-10"
            >
                <div className="flex justify-center mb-6">
                    <div className="p-4 bg-indigo-50 rounded-full text-indigo-600">
                        <Gamepad2 size={40} />
                    </div>
                </div>

                <h2 className="text-3xl font-bold mb-2 text-center text-gray-900">Welcome Back</h2>
                <p className="text-gray-500 text-center mb-8">Login to your gaming universe</p>
                
                {error && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-50 text-red-600 p-3 mb-6 rounded-lg border border-red-100 text-sm font-medium text-center"
                    >
                        {error}
                    </motion.div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
                        <input 
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                            placeholder="Enter your username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                        <input 
                            className="w-full p-3 bg-gray-50 rounded-xl border border-gray-200 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 focus:outline-none transition-all"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button 
                        className="w-full mt-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-indigo-200 transform hover:-translate-y-0.5"
                    >
                        Sign In
                    </button>
                </form>

                <div className="mt-8 text-center text-gray-500 text-sm">
                    New here? <Link to="/register" className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline">Create an Account</Link>
                </div>
            </motion.div>
        </div>
    );
}
