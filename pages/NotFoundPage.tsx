
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-6xl font-extrabold text-primary-600">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-gray-800">Page Not Found</h2>
        <p className="mt-4 text-gray-600">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>Go back home</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
