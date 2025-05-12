import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

const authApi = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const login = async (credentials) => {
    try {
        const response = await authApi.post('/auth/login', credentials);

        if (!response.data || !response.data.token) {
            throw new Error('Invalid response structure from server');
        }

        localStorage.setItem('user', JSON.stringify({
            token: response.data.token,
            email: response.data.user.email,
            role: response.data.user.role,
            id: response.data.user.id
        }));

        return response.data;
    } catch (error) {
        // Handle error response dari server
        const errorMessage = error.response?.data?.message ||
            error.response?.data?.error ||
            error.message;
        throw new Error(errorMessage || 'Login failed');
    }
};

export const getCurrentUser = () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
};

export const logout = () => {
    localStorage.removeItem('user');
};