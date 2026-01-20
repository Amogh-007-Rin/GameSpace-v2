import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LogOut, Gamepad2, User } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="bg-white shadow-md sticky top-0 z-50 px-8 py-4 flex justify-between items-center"
        >
            <Link to="/" className="flex items-center gap-2 text-2xl font-bold text-indigo-600">
                <Gamepad2 size={32} />
                <span>GameSpace</span>
            </Link>

            <div className="flex items-center gap-6">
                <Link to="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                    Home
                </Link>
                <Link to="/games" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">
                    Browse
                </Link>
                
                {user ? (
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-gray-700 font-medium">
                            <User size={20} className="text-indigo-500" />
                            <span>{user.username}</span>
                        </div>
                        <button 
                            onClick={handleLogout}
                            className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-full hover:bg-red-100 transition-colors"
                        >
                            <LogOut size={18} />
                            <span>Logout</span>
                        </button>
                    </div>
                ) : (
                    <div className="flex items-center gap-4">
                        <Link to="/login" className="text-indigo-600 font-medium hover:underline">Login</Link>
                        <Link to="/register" className="bg-indigo-600 text-white px-5 py-2 rounded-full hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200">
                            Sign Up
                        </Link>
                    </div>
                )}
            </div>
        </motion.nav>
    );
}
