import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";
import axios from "axios";

const Home = () => {
    const { isLogin, authUser } = useAuth();
    const [posts, setPosts] = useState([]); // Inisialisasi sebagai array kosong
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isLogin) {
            const fetchPosts = async () => {
                try {
                    setLoading(true);
                    const response = await axios.get("/api/posts", {
                        headers: {
                            Authorization: `Bearer ${authUser.token}`,
                        },
                    });

                    // Pastikan response.data adalah array
                    const postsData = Array.isArray(response.data) ? response.data : [];

                    // Filter posts berdasarkan role
                    let filteredPosts = postsData;
                    if (authUser.role === "user") {
                        filteredPosts = postsData.filter(post => post.isPublic);
                    } else if (authUser.role === "editor") {
                        filteredPosts = postsData.filter(post =>
                            post.isPublic || post.authorId === authUser.id
                        );
                    }

                    setPosts(filteredPosts);
                } catch (err) {
                    console.error("Error fetching posts:", err);
                    setError("Failed to fetch posts");
                    setPosts([]); // Set ke array kosong jika error
                } finally {
                    setLoading(false);
                }
            };

            fetchPosts();
        }
    }, [isLogin, authUser]);

    // ... (kode sebelumnya tetap sama)

    return (
        <div className="min-h-screen bg-base-200">
            <Navbar title="MyApp Home" />

            <div className="container mx-auto px-4 py-8">
                {/* ... (kode header tetap sama) */}

                {/* Posts Section */}
                {isLogin && (
                    <div className="mb-12">
                        <h2 className="text-3xl font-bold mb-6 text-center">
                            {authUser?.role === "admin" ? "All Posts" : "Available Posts"}
                        </h2>

                        {loading ? (
                            <div className="flex justify-center">
                                <span className="loading loading-spinner loading-lg"></span>
                            </div>
                        ) : error ? (
                            <div className="alert alert-error max-w-md mx-auto">
                                <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>{error}</span>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Pastikan posts adalah array sebelum mapping */}
                                {Array.isArray(posts) && posts.length > 0 ? (
                                    posts.map(post => (
                                        <div key={post.id} className="card bg-base-100 shadow-xl">
                                            <div className="card-body">
                                                <h3 className="card-title">{post.title}</h3>
                                                <p>{post.content?.substring(0, 100)}...</p>
                                                <div className="flex justify-between items-center mt-4">
                                                    <span className="badge badge-outline">
                                                        {post.isPublic ? "Public" : "Private"}
                                                    </span>
                                                    <span className="text-sm opacity-70">
                                                        {new Date(post.createdAt).toLocaleDateString()}
                                                    </span>
                                                </div>
                                                {(authUser.role === "admin" || authUser.id === post.authorId) && (
                                                    <div className="card-actions justify-end mt-2">
                                                        <button className="btn btn-sm btn-outline">Edit</button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="col-span-full text-center py-8">
                                        <p>No posts available</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* ... (kode lainnya tetap sama) */}
            </div>
        </div>
    );
};

export default Home;