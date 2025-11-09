
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { CheckCircleIcon } from '../../components/icons/Icons';
import { useToast } from '../../hooks/useToast';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSlug, setRegisteredSlug] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await auth.register(businessName, email, password);
      setRegisteredSlug(businessName.toLowerCase().replace(/\s+/g, '-'));
      setStep(2);
      addToast('Registration successful!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Failed to register.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
        <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-brand-dark-accent py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 text-center border border-gray-800">
                    <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500"/>
                    <h2 className="mt-4 text-2xl font-bold text-brand-light">Registration Successful!</h2>
                    <p className="mt-2 text-gray-400">Your business is ready. Here is your unique QR code.</p>
                    <div className="mt-8">
                        <QRCodeGenerator slug={registeredSlug} />
                    </div>
                    <Button onClick={() => navigate('/app/dashboard')} className="mt-8 w-full">
                        Go to Dashboard
                    </Button>
                </div>
            </div>
        </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-light">
          Create your business account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/app/login" className="font-medium text-brand-primary hover:opacity-80">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-brand-dark-accent py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="businessName"
              label="Business Name"
              type="text"
              required
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <Input
              id="email"
              label="Email address"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              label="Password"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div>
              <Button type="submit" className="w-full flex justify-center" disabled={loading}>
                {loading ? 'Creating account...' : 'Create Account'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;