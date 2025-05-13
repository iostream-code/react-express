import { useAuth } from '../context/AuthContext';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const ProtectedRoute = ({
    children,
    redirectPath = '/login',
    roles = [],
    requireVerified = false
}) => {
    const { user, loading, isAuthenticated } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen gap-4">
                <span className="loading loading-spinner loading-lg"></span>
                <p className="text-lg">Loading authentication...</p>
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to={redirectPath} state={{ from: location }} replace />;
    }

    if (requireVerified && !user?.isVerified) {
        return <Navigate to="/verify-email" state={{ from: location }} replace />;
    }

    if (roles.length > 0 && !roles.includes(user?.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children ? children : <Outlet />;
};

export default ProtectedRoute;