

import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { MenuIcon, XIcon, DashboardIcon, MenuBoardIcon, KitchenIcon, LogoutIcon, SettingsIcon } from '../icons/Icons';
import { firebaseService } from '../../services/firebaseService';
import { Business } from '../../types';

const AppLayout: React.FC = () => {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const auth = useAuth();
    const navigate = useNavigate();
    const [business, setBusiness] = useState<Business | null>(null);

    useEffect(() => {
        const fetchBusiness = async () => {
            if (auth.user?.businessId) {
                const biz = await firebaseService.getBusinessById(auth.user.businessId);
                setBusiness(biz);
            }
        };
        fetchBusiness();
    }, [auth.user]);

    const handleLogout = async () => {
        await auth.logout();
        navigate('/app/login');
    };

    const navItems = [
        { name: 'Dashboard', to: '/app/dashboard', icon: <DashboardIcon className="h-6 w-6" /> },
        { name: 'Menu', to: '/app/menu', icon: <MenuBoardIcon className="h-6 w-6" /> },
        { name: 'Kitchen', to: '/app/kitchen', icon: <KitchenIcon className="h-6 w-6" /> },
        { name: 'Settings', to: '/app/settings', icon: <SettingsIcon className="h-6 w-6" /> },
    ];
    
    const sidebarContent = (
      <div className="flex flex-col h-full">
        <div className="px-4 py-6 flex items-center h-16">
          {business?.logoUrl ? (
            <img src={business.logoUrl} alt={business.name} className="h-10 w-auto max-w-full" />
          ) : (
            <h1 className="text-2xl font-bold text-brand-light">Viejo Sabroso</h1>
          )}
        </div>
        <nav className="flex-1 px-2 space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors ${
                  isActive
                    ? 'bg-brand-primary/10 text-brand-primary'
                    : 'text-gray-300 hover:bg-brand-dark-accent hover:text-white'
                }`
              }
            >
              {item.icon}
              <span className="ml-3">{item.name}</span>
            </NavLink>
          ))}
        </nav>
        <div className="px-2 py-4 border-t border-gray-800">
          <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium rounded-md text-gray-300 hover:bg-brand-dark-accent hover:text-white"
          >
              <LogoutIcon className="h-6 w-6" />
              <span className="ml-3">Logout</span>
          </button>
           <p className="mt-4 text-center text-xs text-gray-500">
            Powered by Viejo Sabroso
          </p>
        </div>
      </div>
    );

    return (
        <div className="flex h-screen bg-brand-dark">
            {/* Mobile sidebar */}
            <div className={`fixed inset-0 flex z-40 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="fixed inset-0 bg-black/60" onClick={() => setSidebarOpen(false)}></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full bg-brand-dark border-r border-gray-800">
                    {sidebarContent}
                </div>
            </div>

            {/* Desktop sidebar */}
            <div className="hidden md:flex md:w-64 md:flex-shrink-0">
                <div className="flex flex-col w-64">
                   <div className="flex flex-col h-0 flex-1 bg-brand-dark border-r border-gray-800">{sidebarContent}</div>
                </div>
            </div>

            <div className="flex flex-col w-0 flex-1 overflow-hidden bg-brand-dark-accent">
                <div className="relative z-10 flex-shrink-0 flex h-16 bg-brand-dark shadow-md md:hidden border-b border-gray-800">
                    <button
                        onClick={() => setSidebarOpen(true)}
                        className="px-4 border-r border-gray-800 text-gray-400 focus:outline-none"
                    >
                        <MenuIcon className="h-6 w-6" />
                    </button>
                    <div className="flex-1 px-4 flex justify-between">
                       <div className="flex-1 flex items-center">
                          {business?.logoUrl ? (
                            <img src={business.logoUrl} alt={business.name} className="h-8 w-auto" />
                          ) : (
                            <h1 className="text-xl font-bold text-brand-light">Viejo Sabroso</h1>
                          )}
                       </div>
                    </div>
                </div>

                <main className="flex-1 relative overflow-y-auto focus:outline-none">
                    <div className="py-6">
                        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 text-brand-light">
                            <Outlet />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AppLayout;