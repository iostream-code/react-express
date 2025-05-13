// src/services/auth.js
const API_URL = 'http://localhost:5000/api/auth';

const fetchAPI = async (url, options = {}) => {
    try {
        const response = await fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                errorData.error ||
                `HTTP error! status: ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        console.error(`API call failed: ${url}`, error);
        throw new Error(
            error.message ||
            'Network connection failed. Please try again later.'
        );
    }

};

// Auth functions
export const register = async (userData) => {
    return fetchAPI(`${API_URL}/register`, {
        method: 'POST',
        body: JSON.stringify(userData),
    });

    return {
        token: data.token,
        user: {
            id: data.user.id,
            email: data.user.email,
            name: data.user.name,
            role: data.user.role
        }
    };
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