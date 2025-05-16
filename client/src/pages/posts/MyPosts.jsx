import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

const MyPosts = () => {
    const { user, token } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyPosts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/my-posts`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setPosts(res.data);
            } catch (err) {
                console.error('Failed to fetch user posts:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchMyPosts();
        }
    }, [user, token]);

    if (loading) return <div className="text-center py-10">Loading...</div>;

    return (
        <div className="space-y-4">
            {posts.length === 0 ? (
                <p className="text-gray-500">You haven&apos;t created any posts yet.</p>
            ) : (
                <ul className="space-y-4">
                    {posts.map((post) => (
                        <li key={post.id} className="border p-4 rounded-lg shadow hover:shadow-md">
                            <h3 className="text-lg font-bold">{post.title}</h3>
                            <p className="text-sm text-gray-500 mb-2">Created at: {new Date(post.createdAt).toLocaleString()}</p>
                            <p className="text-gray-700">{post.content.slice(0, 100)}...</p>
                            <Link
                                to={`/posts/${post.id}`}
                                className="inline-block mt-2 text-sm text-primary hover:underline"
                            >
                                Edit Post
                            </Link>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default MyPosts;
