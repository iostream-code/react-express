// src/services/auth.js
const API_URL = 'http://localhost:5000/api/auth';

const fetchAPI = async (url, options, timeout = 10000) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            credentials: 'include',
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(
                errorData.message ||
                errorData.error ||
                `Request failed with status ${response.status}`
            );
        }

        return await response.json();
    } catch (error) {
        clearTimeout(timeoutId);
        if (error.name === 'AbortError') {
            throw new Error('Request timeout. Please check your connection');
        }
        console.error(`API request to ${url} failed:`, error);
        throw error;
    }
};

export const register = async (credentials) => {
    try {
        const data = await fetchAPI(`${API_URL}/register`, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (!data.token || !data.user) {
            throw new Error('Invalid server response');
        }

        return {
            token: data.token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role
            }
        };
    } catch (error) {
        console.error('Register failed:', error);
        throw new Error(error.message || 'Register failed. Please try again');
    }
};

export const login = async (credentials) => {
    try {
        const data = await fetchAPI(`${API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(credentials),
        });

        if (!data.token || !data.user) {
            throw new Error('Invalid server response');
        }

        return {
            token: data.token,
            user: {
                id: data.user.id,
                email: data.user.email,
                name: data.user.name,
                role: data.user.role
            }
        };
    } catch (error) {
        console.error('Login failed:', error);
        throw new Error(error.message || 'Login failed. Please try again');
    }
};

export const getCurrentUser = async (token) => {
    return fetchAPI(`${API_URL}/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};

export const logout = async () => {
    try {
        localStorage.removeItem('token');
        sessionStorage.removeItem('token');

        await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
    } catch (err) {
        console.error('Logout error:', err);
        throw err;
    }
};

export default {
    register,
    login,
    getCurrentUser,
    logout,
};