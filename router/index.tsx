
import React, { useContext } from 'react';
import { createHashRouter, Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import { UserRole } from '../types';

// Layouts
import AppLayout from '../components/layout/AppLayout';
import PublicLayout from '../components/layout/PublicLayout';
import AdminLayout from '../components/layout/AdminLayout';

// Public Pages
import HomePage from '../pages/public/HomePage';
import CustomerMenuPage from '../pages/menu/CustomerMenuPage';
import StyleguidePage from '../pages/public/StyleguidePage'; // Import the new page

// App Pages
import LoginPage from '../pages/app/LoginPage';
import RegisterPage from '../pages/app/RegisterPage';
import DashboardPage from '../pages/app/DashboardPage';
import MenuPage from '../pages/app/MenuPage';
import KitchenPage from '../pages/app/KitchenPage';
import SettingsPage from '../pages/app/SettingsPage'; // Import Settings page

// Admin Pages
import AdminLoginPage from '../pages/admin/AdminLoginPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import NotFoundPage from '../pages/NotFoundPage';

const ProtectedRoute: React.FC<{ allowedRoles: UserRole[] }> = ({ allowedRoles }) => {
  const authContext = useContext(AuthContext);

  if (authContext === null) {
    // This should ideally show a loading spinner
    return <div>Loading...</div>;
  }
  const { user, loading } = authContext;

  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    const redirectPath = allowedRoles.includes(UserRole.ADMIN) ? '/admin/login' : '/app/login';
    return <Navigate to={redirectPath} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect if role does not match
    const redirectPath = user.role === UserRole.ADMIN ? '/admin/dashboard' : '/app/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  return <Outlet />;
};


const router = createHashRouter([
  {
    path: '/',
    element: <PublicLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'menu/:slug', element: <CustomerMenuPage /> },
      { path: 'styleguide', element: <StyleguidePage /> }, // Add the styleguide route
    ],
  },
  {
    path: '/app',
    children: [
      { path: 'login', element: <LoginPage /> },
      { path: 'register', element: <RegisterPage /> },
      {
        element: <ProtectedRoute allowedRoles={[UserRole.BUSINESS]} />,
        children: [
          {
            element: <AppLayout />,
            children: [
              { path: 'dashboard', element: <DashboardPage /> },
              { path: 'menu', element: <MenuPage /> },
              { path: 'kitchen', element: <KitchenPage /> },
              { path: 'settings', element: <SettingsPage /> }, // Add Settings route
            ],
          },
        ],
      },
    ],
  },
  {
    path: '/admin',
    children: [
      { path: 'login', element: <AdminLoginPage /> },
      {
        element: <ProtectedRoute allowedRoles={[UserRole.ADMIN]} />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { path: 'dashboard', element: <AdminDashboardPage /> },
            ],
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  }
]);

export default router;