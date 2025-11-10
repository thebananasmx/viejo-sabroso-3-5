
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../components/ui/Button';

const NotFoundPage: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center text-center px-4">
      <div>
        <h1 className="text-6xl font-extrabold text-brand-primary">404</h1>
        <h2 className="mt-2 text-3xl font-bold text-brand-light">Página No Encontrada</h2>
        <p className="mt-4 text-gray-400">
          Lo sentimos, no pudimos encontrar la página que estás buscando.
        </p>
        <div className="mt-8">
          <Link to="/">
            <Button>Volver al inicio</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;