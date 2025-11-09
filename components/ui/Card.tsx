
import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ children, className = '', onClick }) => {
  const cardClasses = `bg-brand-dark-accent rounded-xl shadow-lg overflow-hidden transition-all duration-300 border border-transparent ${onClick ? 'cursor-pointer hover:border-gray-700' : ''} ${className}`;
  
  return (
    <div className={cardClasses} onClick={onClick}>
      {children}
    </div>
  );
};

export default Card;