
import React, { useEffect } from 'react';
import { XIcon, CheckCircleIcon } from '../icons/Icons'; // Assuming AlertTriangleIcon exists or will be added
import { AlertTriangleIcon } from '../icons/Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error' | 'info';
  onClose: () => void;
}

const toastConfig = {
  success: {
    icon: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
    bg: 'bg-green-50',
    text: 'text-green-800',
    bar: 'bg-green-400',
  },
  error: {
    icon: <AlertTriangleIcon className="h-6 w-6 text-red-500" />,
    bg: 'bg-red-50',
    text: 'text-red-800',
    bar: 'bg-red-400',
  },
  info: {
    icon: <AlertTriangleIcon className="h-6 w-6 text-blue-500" />,
    bg: 'bg-blue-50',
    text: 'text-blue-800',
    bar: 'bg-blue-400',
  },
};

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const config = toastConfig[type];

  return (
    <div className={`relative w-full rounded-lg shadow-lg overflow-hidden ${config.bg} animate-fade-in-right`}>
      <div className={`absolute left-0 top-0 bottom-0 w-2 ${config.bar}`}></div>
      <div className="flex items-center p-4 pl-5">
        <div className="flex-shrink-0">{config.icon}</div>
        <div className="ml-3 flex-1">
          <p className={`text-sm font-medium ${config.text}`}>{message}</p>
        </div>
        <div className="ml-4 flex-shrink-0">
          <button
            onClick={onClose}
            className={`inline-flex rounded-md p-1 ${config.text} opacity-70 hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500`}
          >
            <span className="sr-only">Cerrar</span>
            <XIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
      <style>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;