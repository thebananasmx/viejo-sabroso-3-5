
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
            The <i className="font-style: italic;">Future</i> of Dining is Here.
          </h1>
          <p className="mt-6 max-w-2xl mx-auto text-lg md:text-xl text-gray-300">
            Effortlessly create beautiful, contactless QR code menus. Let your customers order and pay right from their table.
          </p>
          <div className="mt-10">
            <Link to="/app/register">
              <Button size="lg">Create Your Menu Now</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-brand-dark-accent">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-light">Why Viejo Sabroso?</h2>
            <p className="mt-4 text-gray-400">Everything you need to streamline your service.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-brand-dark p-8 rounded-xl text-center border border-gray-800">
              <h3 className="text-xl font-bold text-brand-light">Easy Menu Management</h3>
              <p className="mt-2 text-gray-400">Update your menu anytime, anywhere. Add items, change prices, and create categories with a few clicks.</p>
            </div>
            <div className="bg-brand-dark p-8 rounded-xl text-center border border-gray-800">
              <h3 className="text-xl font-bold text-brand-light">Real-time Kitchen View</h3>
              <p className="mt-2 text-gray-400">Orders appear instantly in your kitchen on a clear, easy-to-use display. Track order status from pending to ready.</p>
            </div>
            <div className="bg-brand-dark p-8 rounded-xl text-center border border-gray-800">
              <h3 className="text-xl font-bold text-brand-light">Insightful Analytics</h3>
              <p className="mt-2 text-gray-400">Understand your customers and sales. See your most popular items and track your performance over time.</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24">
         <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif text-3xl md:text-5xl font-bold text-brand-light">Ready to boost your efficiency?</h2>
            <p className="mt-6 max-w-2xl mx-auto text-lg text-gray-300">
                Join hundreds of restaurants transforming their service with Viejo Sabroso.
            </p>
            <div className="mt-10">
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