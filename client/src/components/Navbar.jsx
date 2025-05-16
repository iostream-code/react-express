import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title = "News App" }) => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="navbar bg-base-100 shadow-lg px-4 sm:px-8">
            {/* Main Navigation */}
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost normal-case text-xl">
                    {title}
                </Link>

                {/* Navigation Links  */}
                {isAuthenticated && (
                    <div className="hidden sm:flex ml-4 gap-2">

                        {/* Admin Navigations */}
                        {user?.role === 'admin' && (
                            <>
                                <div className="dropdown dropdown-hover">
                                    <label tabIndex={0} className="btn btn-ghost btn-sm">
                                        Admin Panel
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </label>
                                    <ul tabIndex={0} className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52">
                                        <li><Link to="/admin/users">User Management</Link></li>
                                        <li><Link to="/admin/reports">Reports</Link></li>
                                    </ul>
                                </div>
                                <Link to='/posts' className="btn btn-ghost btn-sm">
                                    Posts
                                </Link>
                            </>
                        )}

                        {/* Author Navigations */}
                        {user?.role === 'author' && (
                            <Link to="/posts" className="btn btn-ghost btn-sm">
                                My Posts
                            </Link>
                        )}

                        <Link to="/profile" className="btn btn-ghost btn-sm">
                            Profile
                        </Link>
                    </div>
                )}
            </div>

            {/* User Menu */}
            <div className="flex-none gap-4">
                {isAuthenticated ? (
                    <>
                        {/* Mobile Menu (Dropdown) */}
                        <div className="dropdown dropdown-end sm:hidden">
                            <label tabIndex={0} className="btn btn-ghost btn-circle">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </label>
                            <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
                                <li><Link to="/dashboard">Dashboard</Link></li>
                                <li><Link to="/posts">Posts</Link></li>
                                {user?.role === 'admin' && (
                                    <>
                                        <li className="menu-title"><span>Admin</span></li>
                                        <li><Link to="/admin/users">User Management</Link></li>
                                    </>
                                )}
                                <li><Link to="/profile">Profile</Link></li>
                                <li><button onClick={handleLogout}>Logout</button></li>
                            </ul>
                        </div>

                        {/* Desktop User Menu */}
                        <div className="dropdown dropdown-end">
                            <div className="flex items-center gap-2">
                                <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                                    <div className="w-10 rounded-full bg-neutral text-neutral-content flex items-center justify-center">
                                        {user?.name?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                </label>
                            </div>
                            <ul tabIndex={0} className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52">
                                {user?.role === 'admin' && (
                                    <li className="py-2 text-sm font-medium">
                                        {/* {user?.name || user?.email} */}
                                        <span className="badge badge-primary mx-auto flex items-center justify-center">ADMIN</span>
                                        <div className="divider w-full mb-0"></div>
                                    </li>
                                )}
                                <li><Link to="/profile">Profile</Link></li>
                                <li><Link to="/settings">Settings</Link></li>
                                <li><button onClick={handleLogout} className="text-error">Logout</button></li>
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="flex gap-2">
                        <Link to="/login" className="btn btn-ghost">
                            Login
                        </Link>
                        <Link to="/register" className="btn btn-primary">
                            Register
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Navbar;