import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, logout as apiLogout, getCurrentUser } from '../services/auth';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const user = getCurrentUser();
        if (user) {
            setUser(user);
        }
        setLoading(false);
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);
            const userData = await apiLogin(credentials);
            setUser({
                email: userData.user.email,
                role: userData.user.role,
                id: userData.user.id,
                token: userData.token
            });
            navigate('/');
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        apiLogout();
        setUser(null);
        navigate('/login');
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        isAuthenticated: !!user?.token
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}