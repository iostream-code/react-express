// src/routes/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, loading } = useAuth();

    if (loading) return <div className="loading loading-spinner"></div>;
    if (!user) return <Navigate to="/login" replace />;

    return children;
}