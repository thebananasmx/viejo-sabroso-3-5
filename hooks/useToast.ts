
import { useContext } from 'react';
import { ToastContext } from '../contexts/ToastContext';

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    // Fix: Corrected error message to refer to ToastProvider.
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
