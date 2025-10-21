interface AlertProps {
  children: React.ReactNode;
  type?: 'error' | 'success' | 'info' | 'warning';
  className?: string;
}

const Alert = ({ children, type = 'info', className = '' }: AlertProps) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-500 text-red-700';
      case 'success':
        return 'bg-emerald-50 border-emerald-400 text-emerald-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-400 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-50 border-secondary text-textSecondary';
    }
  };

  return (
    <div className={`border px-5 py-4 rounded-xl font-medium transition-all duration-300 animate-slide-down ${getAlertStyles()} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;
