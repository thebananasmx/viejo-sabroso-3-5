import React from 'react';
import { Link } from 'react-router-dom';
import Button from '../../components/ui/Button';

const HomePage: React.FC = () => {
  return (
    <>
      {/* Hero Section */}
      <section className="relative py-20 md:py-32 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold text-dark leading-tight">
            The Future of Dining is Here.
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-gray-600">
            Effortlessly create beautiful, contactless QR code menus. Let your customers order and pay right from their table.
          </p>
          <div className="mt-8">
            <Link to="/app/register">
              <Button size="lg">Create Your Menu Now</Button>
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-light to-transparent"></div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-light">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">Why Viejo Sabroso?</h2>
            <p className="mt-2 text-gray-600">Everything you need to streamline your service.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-bold text-dark">Easy Menu Management</h3>
              <p className="mt-2 text-gray-600">Update your menu anytime, anywhere. Add items, change prices, and create categories with a few clicks.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-bold text-dark">Real-time Kitchen View</h3>
              <p className="mt-2 text-gray-600">Orders appear instantly in your kitchen on a clear, easy-to-use display. Track order status from pending to ready.</p>
            </div>
            <div className="bg-white p-8 rounded-xl shadow-lg text-center">
              <h3 className="text-xl font-bold text-dark">Insightful Analytics</h3>
              <p className="mt-2 text-gray-600">Understand your customers and sales. See your most popular items and track your performance over time.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-20 bg-white">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-dark">Ready to boost your efficiency?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
                Join hundreds of restaurants transforming their service with Viejo Sabroso.
            </p>
            <div className="mt-8">
                <Link to="/app/register">
                    <Button size="lg" variant="secondary">Sign Up for Free</Button>
                </Link>
            </div>
         </div>
      </section>
    </>
  );
};

export default HomePage;