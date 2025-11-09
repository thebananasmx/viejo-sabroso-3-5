import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import Button from '../ui/Button';

const PublicLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col bg-light">
      <header className="bg-white/80 backdrop-blur-md sticky top-0 z-30 shadow-sm">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              Viejo Sabroso
            </Link>
            <div className="flex items-center space-x-4">
              <Link to="/app/login" className="text-gray-600 hover:text-primary-600 font-medium">
                Log In
              </Link>
              <Link to="/app/register">
                <Button>Get Started</Button>
              </Link>
            </div>
          </div>
        </nav>
      </header>
      <main className="flex-grow">
        <Outlet />
      </main>
      <footer className="bg-dark text-gray-400">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; {new Date().getFullYear()} Viejo Sabroso. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;