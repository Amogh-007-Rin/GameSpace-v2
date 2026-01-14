import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

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
        <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
            <form onSubmit={handleSubmit} className="bg-gray-800 p-8 rounded-lg shadow-2xl w-96 border border-gray-700">
                <h2 className="text-3xl font-bold mb-2 text-center text-blue-400">Welcome Back</h2>
                <p className="text-gray-400 text-center mb-6">Login to your library</p>
                
                {error && <div className="bg-red-500/20 text-red-300 p-3 mb-4 rounded border border-red-500 text-sm">{error}</div>}
                
                <div className="space-y-4">
                    <input 
                        className="w-full p-3 bg-gray-900 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    <input 
                        className="w-full p-3 bg-gray-900 rounded border border-gray-700 focus:border-blue-500 focus:outline-none"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                <button className="w-full mt-6 bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 rounded transition duration-200">
                    Sign In
                </button>

                <div className="mt-4 text-center text-gray-400 text-sm">
                    New here? <Link to="/register" className="text-blue-400 hover:text-blue-300">Create an Account</Link>
                </div>
            </form>
        </div>
    );
}
