import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

const Profile = () => {
    const { user, token } = useAuth();
    const [formData, setFormData] = useState({ name: '', email: '' });
    const [status, setStatus] = useState({ loading: false, success: null, error: null });

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name || '', email: user.email || '' });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            [e.target.name]: e.target.value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus({ loading: true, success: null, error: null });

        try {
            const res = await axios.put(
                `${import.meta.env.VITE_API_URL}/users/profile`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setStatus({ loading: false, success: 'Profile updated!', error: null });
        } catch (err) {
            console.error(err);
            setStatus({ loading: false, success: null, error: 'Failed to update profile' });
        }
    };

    return (
        <div className="max-w-xl mx-auto py-10 px-4">
            <h2 className="text-3xl font-bold mb-6">Edit Profile</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="label">
                        <span className="label-text">Name</span>
                    </label>
                    <input
                        type="text"
                        name="name"
                        className="input input-bordered w-full"
                        value={formData.name}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Email</span>
                    </label>
                    <input
                        type="email"
                        name="email"
                        className="input input-bordered w-full"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <button
                    type="submit"
                    className={`btn btn-primary w-full ${status.loading ? 'loading' : ''}`}
                    disabled={status.loading}
                >
                    {status.loading ? 'Updating...' : 'Update Profile'}
                </button>

                {status.success && (
                    <div className="alert alert-success mt-4">
                        <span>{status.success}</span>
                    </div>
                )}

                {status.error && (
                    <div className="alert alert-error mt-4">
                        <span>{status.error}</span>
                    </div>
                )}
            </form>
        </div>
    );
};

export default Profile;
