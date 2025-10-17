interface AlertProps {
  children: React.ReactNode;
  type?: 'error' | 'success' | 'info' | 'warning';
  className?: string;
}

const Alert = ({ children, type = 'info', className = '' }: AlertProps) => {
  const getAlertStyles = () => {
    switch (type) {
      case 'error':
        return 'bg-[#E63946] bg-opacity-10 border-[#E63946] text-[#E63946]';
      case 'success':
        return 'bg-[#38B000] bg-opacity-10 border-[#38B000] text-[#264653]';
      case 'warning':
        return 'bg-[#F4A261] bg-opacity-10 border-[#F4A261] text-[#264653]';
      case 'info':
      default:
        return 'bg-[#2A9D8F] bg-opacity-10 border-[#2A9D8F] text-[#264653]';
    }
  };

  return (
    <div className={`border px-5 py-4 rounded-lg shadow-sm ${getAlertStyles()} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;
