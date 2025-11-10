
import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-24 md:py-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="font-serif text-4xl md:text-7xl font-bold text-brand-light leading-tight">
            El <i className="font-style: italic;">Futuro</i> de la Comida está Aquí.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
            Crea menús hermosos y sin contacto con códigos QR sin esfuerzo. Permite que tus clientes ordenen y paguen desde su mesa.
          </p>
          <div className="mt-10">
            <Link to="/app/register">
              <Button size="lg">Crea Tu Menú Ahora</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-brand-dark-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-light">¿Por Qué Viejo Sabroso?</h2>
            <p className="mt-4 text-gray-400">Todo lo que necesitas para optimizar tu servicio.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-brand-dark p-8 rounded-xl text-center border border-gray-800">
              <h3 className="text-xl font-bold text-brand-light">Gestión de Menú Fácil</h3>
              <p className="mt-2 text-gray-400">Actualiza tu menú en cualquier momento y lugar. Agrega platillos, cambia precios y crea categorías con unos pocos clics.</p>
            </div>
            <div className="bg-brand-dark p-8 rounded-xl text-center border border-gray-800">
              <h3 className="text-xl font-bold text-brand-light">Vista de Cocina en Tiempo Real</h3>
              <p className="mt-2 text-gray-400">Los pedidos aparecen al instante en tu cocina en una pantalla clara y fácil de usar. Sigue el estado del pedido de pendiente a listo.</p>
            </div>
            <div className="bg-brand-dark p-8 rounded-xl text-center border border-gray-800">
              <h3 className="text-xl font-bold text-brand-light">Analíticas Detalladas</h3>
              <p className="mt-2 text-gray-400">Entiende a tus clientes y tus ventas. Ve tus platillos más populares y sigue tu rendimiento a lo largo del tiempo.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-light">¿Listo para mejorar tu eficiencia?</h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                Únete a cientos de restaurantes que están transformando su servicio con Viejo Sabroso.
            </p>
            <div className="mt-10">
                <Link to="/app/register">
                    <Button size="lg" variant="secondary">Regístrate Gratis</Button>
                </Link>
            </div>
         </div>
      </section>
    </>
  );
};

export default HomePage;