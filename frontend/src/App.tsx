import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import BrowsePage from './pages/BrowsePage';
import Navbar from './components/Navbar';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="w-full min-h-screen bg-gray-50 text-indigo-600 flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

// Layout component to conditionally render Navbar
const Layout = ({ children }: { children: ReactNode }) => {
    const location = useLocation();
    const hideNavbar = ['/login', '/register'].includes(location.pathname);

    return (
        <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
            {!hideNavbar && <Navbar />}
            {children}
        </div>
    );
};

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Layout>
                        <Routes>
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/register" element={<RegisterPage />} />
                            
                            <Route 
                                path="/" 
                                element={<HomePage />} 
                            />
                            
                            <Route 
                                path="/games" 
                                element={<BrowsePage />} 
                            />

                            <Route 
                                path="/games/:id" 
                                element={<GameDetailPage />} 
                            />
                        </Routes>
                    </Layout>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}