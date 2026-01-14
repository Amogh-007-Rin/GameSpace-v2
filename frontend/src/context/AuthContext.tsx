import React, {
    createContext,
    useContext,
    useState,
    useEffect,
} from 'react';
import apiClient from '../api/client';
import type { ReactNode } from 'react';

/* ---------- Types ---------- */

interface User {
    id: number;
    username: string;
    role: string;
}

interface LoginResponse {
    access: string;
    refresh: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

/* ---------- Context ---------- */

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ---------- Provider ---------- */

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        const storedUser = localStorage.getItem('user_data');

        if (token && storedUser) {
            setUser(JSON.parse(storedUser) as User);
        }

        setIsLoading(false);
    }, []);

    
    const login = async (
            username: string,
            password: string
        ): Promise<void> => {
            const response = await apiClient.post<LoginResponse>(
                '/auth/login/',
                { username, password }
            );

            const { access, refresh, user } = response.data;

            localStorage.setItem('access_token', access);
            localStorage.setItem('refresh_token', refresh);
            localStorage.setItem('user_data', JSON.stringify(user));

            setUser(user);
    };


    const logout = (): void => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_data');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
