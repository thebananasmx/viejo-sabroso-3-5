
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Input: React.FC<InputProps> = ({ label, id, className = '', ...props }) => {
  return (
    <div className="w-full">
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-300 mb-1">{label}</label>}
      <input
        id={id}
        className={`w-full px-4 py-2.5 bg-brand-dark-accent border border-gray-700 rounded-lg shadow-sm text-brand-light placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-brand-primary focus:border-transparent sm:text-sm ${className}`}
        {...props}
      />
    </div>
  );
};

export default Input;