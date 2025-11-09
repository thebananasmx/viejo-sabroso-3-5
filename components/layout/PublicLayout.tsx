
import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';
import Button from '../ui/Button';
import { XIcon } from '../icons/Icons';

const PublicLayout: React.FC = () => {
  const [isBannerVisible, setIsBannerVisible] = useState(true);

  return (
    <div className="min-h-screen flex flex-col">
      {isBannerVisible && (
        <div className="relative text-center py-2 px-4 sm:px-6 lg:px-8 text-sm bg-gradient-to-r from-yellow-300 via-brand-primary to-pink-300 text-brand-dark font-medium">
          <p>Spots is launching soon. Click to learn more.</p>
          <button onClick={() => setIsBannerVisible(false)} className="absolute top-1/2 right-4 -translate-y-1/2 text-brand-dark">
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      )}
      <header className="bg-brand-dark/80 backdrop-blur-md sticky top-0 z-30 border-b border-gray-800">
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link to="/" className="text-2xl font-bold text-brand-light">
              Viejo Sabroso
            </Link>
            <div className="flex items-center space-x-6">
              <Link to="/app/login" className="text-gray-300 hover:text-brand-primary font-medium">
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
      <footer className="bg-brand-dark border-t border-gray-800">
        <div className="container mx-auto py-8 px-4 sm:px-6 lg:px-8 text-center text-gray-500">
          <p>&copy; {new Date().getFullYear()} Viejo Sabroso. All rights reserved.</p>
          <div className="mt-4">
            <Link to="/styleguide" className="text-sm text-gray-600 hover:text-brand-primary">
              Styleguide
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
