// src/services/auth.js
const API_URL = 'http://localhost:5000/api/auth';

const fetchAPI = async (url, options = {}) => {
    const response = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options.headers,
        },
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Something went wrong');
    }

    return response.json();
};

// Auth functions
export const register = async (userData) => {
    return fetchAPI(`${API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
    });
};

export const login = async (credentials) => {
    return fetchAPI(`${API_URL}/login`, {
        method: 'POST',
        body: JSON.stringify(credentials),
    });
};

export const getCurrentUser = async (token) => {
    return fetchAPI(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const logout = async () => {
    // Jika backend memiliki endpoint logout
    try {
        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include',
        });
    } catch (err) {
        console.error('Logout error:', err);
    }
};

export default {
    register,
    login,
    getCurrentUser,
    logout,
};