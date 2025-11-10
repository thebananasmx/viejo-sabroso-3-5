
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { useAuth } from '../../hooks/useAuth';
import { useToast } from '../../hooks/useToast';

const AdminRegisterPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const auth = useAuth();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (!auth.registerAdmin) {
        throw new Error("La función de registro de administrador no está disponible.");
      }
      await auth.registerAdmin(email, password);
      navigate('/admin/dashboard');
      addToast('¡Cuenta de administrador creada!', 'success');
    } catch (err: any) {
      addToast(err.message || 'Error al registrar.', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-brand-light">
          Registrar Nuevo Administrador
        </h2>
        <p className="mt-2 text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link to="/admin/login" className="font-medium text-brand-primary hover:opacity-80">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-brand-dark-accent py-8 px-4 shadow-xl sm:rounded-lg sm:px-10 border border-gray-800">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <Input
              id="email"
              label="Correo electrónico"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              id="password"
              label="Contraseña"
              type="password"
              autoComplete="new-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            
            <div>
              <Button type="submit" className="w-full flex justify-center" disabled={loading}>
                {loading ? 'Creando cuenta...' : 'Crear Cuenta de Admin'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminRegisterPage;
