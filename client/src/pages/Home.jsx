// src/components/Home.jsx
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const Home = () => {
    const { user, logout, isAuthenticated } = useAuth();

    return (
        <div className="min-h-screen bg-base-100">
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
                                    <Link to="/profile" className="justify-between">
                                        Profile
                                    </Link>
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

            <div className="hero bg-base-200">
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
        </div>
    );
};

export default Home;