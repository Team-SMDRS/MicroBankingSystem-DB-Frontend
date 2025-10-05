interface AlertProps {
  children: React.ReactNode;
  type?: 'error' | 'success' | 'info' | 'warning';
  className?: string;
}

const Alert = ({ children, type = 'info', className = '' }: AlertProps) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-700';
      case 'success':
        return 'bg-emerald-50 border-emerald-200 text-emerald-700';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-700';
      case 'info':
      default:
        return 'bg-blue-50 border-blue-200 text-blue-700';
    }
  };

  return (
    <div className={`border px-4 py-3 rounded-xl ${getAlertStyles()} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;
