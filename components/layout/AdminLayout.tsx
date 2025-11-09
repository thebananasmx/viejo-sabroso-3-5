
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { LogoutIcon } from '../icons/Icons';

const AdminLayout: React.FC = () => {
    const auth = useAuth();
    const navigate = useNavigate();

    const handleLogout = async () => {
        await auth.logout();
        navigate('/admin/login');
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <header className="bg-secondary shadow">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-white">Admin Panel</h1>
                    <button onClick={handleLogout} className="flex items-center text-white hover:text-primary-300">
                        <LogoutIcon className="h-6 w-6 mr-2"/>
                        Logout
                    </button>
                </div>
            </header>
            <main>
                <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
