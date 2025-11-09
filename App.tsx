
import React from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './router';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/ui/ToastContainer';

function App() {
  return (
    <div className="font-sans bg-brand-dark text-brand-light">
      <ToastProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
        <ToastContainer />
      </ToastProvider>
    </div>
  );
}

export default App;