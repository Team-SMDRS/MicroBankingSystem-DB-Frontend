// src/components/ui/Button.tsx
import React from 'react';
import { Link } from 'react-router-dom';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  to?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  className?: string; // Allow additional classes
}

const Button: React.FC<ButtonProps> = ({ children, onClick, to, variant = 'primary', type = 'button', className }) => {
  // 👇 Note the new classes for rounded corners and transitions
  const baseClasses = `inline-flex items-center justify-center px-4 py-2 rounded-lg font-semibold text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-200 ease-in-out transform hover:scale-105`;

  const variantClasses = variant === 'primary' 
    ? "bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500"
    : "bg-gray-200 text-gray-800 hover:bg-gray-300 focus:ring-gray-400";

  const finalClassName = `${baseClasses} ${variantClasses} ${className}`;

  if (to) {
    return (
      <Link to={to} className={finalClassName}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} onClick={onClick} className={finalClassName}>
      {children}
    </button>
  );
};

export default Button;