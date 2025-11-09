
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import QRCodeGenerator from '../../components/QRCodeGenerator';
import { CheckCircleIcon } from '../../components/icons/Icons';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [registeredSlug, setRegisteredSlug] = useState('');
  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await auth.register(businessName, email, password);
      setRegisteredSlug(businessName.toLowerCase().replace(/\s+/g, '-'));
      setStep(2);
    } catch (err: any) {
      setError(err.message || 'Failed to register.');
    } finally {
      setLoading(false);
    }
  };

  if (step === 2) {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
                    <CheckCircleIcon className="mx-auto h-12 w-12 text-green-500"/>
                    <h2 className="mt-4 text-2xl font-bold text-gray-900">Registration Successful!</h2>
                    <p className="mt-2 text-gray-600">Your business is ready. Here is your unique QR code.</p>
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
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Create your business account
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Already have an account?{' '}
          <Link to="/app/login" className="font-medium text-primary-600 hover:text-primary-500">
            Sign in
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
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
            {error && <p className="text-sm text-red-600">{error}</p>}
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
