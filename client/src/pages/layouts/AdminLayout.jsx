// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import Navbar from '../../components/Navbar';

export default function AdminLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
}