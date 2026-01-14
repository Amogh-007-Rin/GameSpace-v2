import React, { useState } from 'react';
import apiClient from '../api/client';
import { useNavigate, Link } from 'react-router-dom';

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
            navigate('/login');
        } catch (err: any) {
            // The interceptor now returns a string, so we can set it directly
            setError(err || 'Registration failed');
        }
    };

    return (
        <div className="w-full min-h-screen flex items-center justify-center bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl w-full max-w-md border border-gray-700">
                <h2 className="text-3xl font-bold mb-6 text-center text-purple-400">Join GameSpace</h2>
                
                {error && <div className="bg-red-500/20 text-red-300 p-3 mb-4 rounded border border-red-500 text-sm wrap-break-word">{error}</div>}
                
                <div className="space-y-4">
                    <input 
                        className="w-full p-3 bg-gray-900 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        className="w-full p-3 bg-gray-900 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                        type="email"
                        placeholder="Email Address"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input 
                        className="w-full p-3 bg-gray-900 rounded border border-gray-700 focus:border-purple-500 focus:outline-none"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="w-full mt-6 bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded transition duration-200">
                    Create Account
                </button>
                
                <div className="mt-4 text-center text-gray-400 text-sm">
                    Already have an account? <Link to="/login" className="text-purple-400 hover:text-purple-300">Login</Link>
                </div>
            </form>
        </div>
    );
}