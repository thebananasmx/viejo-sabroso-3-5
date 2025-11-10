
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
        <div className="min-h-screen bg-gray-900">
            <header className="bg-brand-dark shadow border-b border-gray-800">
                <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
                    <h1 className="text-2xl font-bold text-brand-light">Panel de Administración</h1>
                    <button onClick={handleLogout} className="flex items-center text-brand-light hover:text-brand-primary">
                        <LogoutIcon className="h-6 w-6 mr-2"/>
                        Cerrar Sesión
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