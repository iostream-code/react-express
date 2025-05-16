import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Index = () => {
    const [loading, setLoading] = useState(true);
    const [posts, setPosts] = useState([]);

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
        </div>)
}

export default Index