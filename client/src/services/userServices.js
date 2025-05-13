import axios from 'axios';

const API_URL = '/api/users'; // Gunakan proxy jika ada (lihat catatan di bawah)

const handleRequest = async (request) => {
    try {
        const response = await request;
        return response.data;
    } catch (error) {
        const errorMessage = error.response?.data?.error ||
            error.message ||
            'Request failed';
        throw new Error(errorMessage);
    }
};

export const userService = {
    getUsers: (token) => handleRequest(
        axios.get(API_URL, {
            headers: { Authorization: `Bearer ${token}` }
        })
    ),

    updateRole: (userId, role, token) => handleRequest(
        axios.patch(`${API_URL}/${userId}/role`, { role }, {
            headers: { Authorization: `Bearer ${token}` }
        })
    ),

    deleteUser: (userId, token) => handleRequest(
        axios.delete(`${API_URL}/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        })
    )
};