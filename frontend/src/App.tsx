import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import HomePage from './pages/HomePage';
import GameDetailPage from './pages/GameDetailPage';
import type { ReactNode } from 'react';

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    const { user, isLoading } = useAuth();
    if (isLoading) return <div className="w-full min-h-screen bg-gray-900 text-white flex items-center justify-center">Loading...</div>;
    if (!user) return <Navigate to="/login" />;
    return children;
};

export default function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthProvider>
                <BrowserRouter>
                    <Routes>
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        
                        <Route 
                            path="/" 
                            element={
                                <ProtectedRoute>
                                    <HomePage />
                                </ProtectedRoute>
                            } 
                        />
                        
                        <Route 
                            path="/games/:id" 
                            element={
                                <ProtectedRoute>
                                    <GameDetailPage />
                                </ProtectedRoute>
                            } 
                        />
                    </Routes>
                </BrowserRouter>
            </AuthProvider>
        </QueryClientProvider>
    );
}
