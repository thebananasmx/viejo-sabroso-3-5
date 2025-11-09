import React, { useContext } from 'react';
import Toast from './Toast';
import { ToastContext } from '../../contexts/ToastContext';

// Fix: Refactored component to consume toasts directly from context.
const ToastContainer: React.FC = () => {
    const toastContext = useContext(ToastContext);

    if (!toastContext) {
        return null;
    }

    const { toasts, removeToast } = toastContext;

    return (
        <div className="fixed top-4 right-4 z-[100] w-full max-w-xs space-y-3">
            {toasts.map((toast) => (
                <Toast
                    key={toast.id}
                    message={toast.message}
                    type={toast.type}
                    onClose={() => removeToast(toast.id)}
                />
            ))}
        </div>
    );
};

export default ToastContainer;
