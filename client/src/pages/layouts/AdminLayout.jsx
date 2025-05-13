// src/layouts/AdminLayout.jsx
import { Outlet } from 'react-router-dom';
import AdminNavbar from '../../components/Navbar';

export default function AdminLayout() {
    return (
        <div className="flex flex-col min-h-screen">
            <AdminNavbar />
            <div className="flex-1 p-6">
                <Outlet />
            </div>
        </div>
    );
}