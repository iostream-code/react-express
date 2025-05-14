import { useAuth } from '../context/AuthContext';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
    const { user, logout, isAuthenticated } = useAuth();
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${import.meta.env.VITE_API_URL}/posts/`);
                console.log(res.data);
                setPosts(res.data);
            } catch (err) {
                console.error('Error fetching posts:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className="min-h-screen bg-base-100">
            {/* Navbar */}
            <div className="navbar bg-base-300">
                <div className="flex-1">
                    <Link to="/" className="btn btn-ghost normal-case text-xl">MyApp</Link>
                </div>
                <div className="flex-none">
                    {isAuthenticated ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full bg-neutral-focus text-neutral-content flex items-center justify-center">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li>
                                    <Link to="/profile">Profile</Link>
                                </li>
                                <li><a>Settings</a></li>
                                <li><button onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                    ) : (
                        <div className="flex gap-2">
                            <Link to="/login" className="btn btn-ghost">Login</Link>
                            <Link to="/register" className="btn btn-primary">Register</Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Hero */}
            <div className="hero bg-base-200 py-12">
                <div className="hero-content text-center">
                    <div className="max-w-md">
                        <h1 className="text-5xl font-bold">Hello {user?.name || 'Guest'}</h1>
                        <p className="py-6">
                            {isAuthenticated
                                ? 'Welcome back to our platform!'
                                : 'Please login or register to access all features'}
                        </p>
                        {!isAuthenticated && (
                            <div className="flex gap-4 justify-center">
                                <Link to="/login" className="btn btn-primary">Login</Link>
                                <Link to="/register" className="btn btn-outline">Register</Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Post List */}
            <div className="px-4 md:px-10 py-10">
                <h2 className="text-3xl font-bold mb-6 text-center">Latest Posts</h2>

                {loading ? (
                    <div className="flex justify-center">
                        <span className="loading loading-spinner text-primary loading-lg"></span>
                    </div>
                ) : posts.length === 0 ? (
                    <p className="text-center text-gray-500">No posts available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {posts.map((post) => (
                            <div key={post.id} className="card bg-base-100 shadow-md border border-base-300">
                                <div className="card-body">
                                    <h3 className="card-title">{post.title}</h3>
                                    <p className="text-sm text-gray-500">
                                        By {post.author_id || 'Unknown'} &middot; {new Date(post.created_at).toLocaleDateString()}
                                    </p>
                                    <p className="line-clamp-3 text-sm">{post.content}</p>
                                    <div className="card-actions justify-end mt-4">
                                        <Link to={`/posts/${post.id}`} className="btn btn-sm btn-outline btn-primary">
                                            Read More
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Home;
