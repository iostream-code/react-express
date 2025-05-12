import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = ({ title = "MyApp" }) => {
    const { isLogin, authUser, logout } = useAuth();

    return (
        <div className="navbar bg-base-100 shadow-lg">
            <div className="flex-1">
                <Link to="/" className="btn btn-ghost normal-case text-xl">
                    {title}
                </Link>
            </div>
            <div className="flex-none gap-2">
                {isLogin && authUser ? (
                    <div className="dropdown dropdown-end">
                        <label tabIndex={0} className="btn btn-ghost btn-circle avatar">
                            <div className="w-10 rounded-full bg-primary text-white flex items-center justify-center">
                                {authUser.Email?.charAt(0).toUpperCase() || "U"}
                            </div>
                        </label>
                        <ul
                            tabIndex={0}
                            className="mt-3 p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
                        >
                            <li>
                                <span className="justify-between">
                                    {authUser.Email}
                                </span>
                            </li>
                            <li>
                                <button onClick={logout}>Logout</button>
                            </li>
                        </ul>
                    </div>
                ) : (
                    <Link to="/login" className="btn btn-primary">
                        Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Navbar;