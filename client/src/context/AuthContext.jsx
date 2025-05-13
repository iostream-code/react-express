// src/context/authContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import auth from '../services/auth';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUser = async () => {
            if (token) {
                try {
                    const userData = await auth.getCurrentUser(token);
                    setUser(userData);
                } catch (err) {
                    console.error('Failed to load user', err);
                    logout();
                }
            }
            setLoading(false);
        };

        loadUser();
    }, [token]);

    const login = async (email, password) => {
        try {
            const { token: newToken, user: userData } = await auth.login({ email, password });
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const register = async (userData) => {
        try {
            const { token: newToken, user: userData } = await auth.register(userData);
            localStorage.setItem('token', newToken);
            setToken(newToken);
            setUser(userData);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const logout = async () => {
        try {
            await auth.logout();
        } finally {
            localStorage.removeItem('token');
            setToken(null);
            setUser(null);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);