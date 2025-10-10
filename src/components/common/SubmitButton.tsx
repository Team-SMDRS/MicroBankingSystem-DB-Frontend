interface SubmitButtonProps {
  isSubmitting: boolean;
  disabled?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit';
  children: React.ReactNode;
  loadingText?: string;
  className?: string;
}

const SubmitButton = ({ 
  isSubmitting, 
  disabled = false, 
  onClick,
  type = 'submit',
  children,
  loadingText = 'Processing...',
  className = ''
}: SubmitButtonProps) => {
  const isDisabled = isSubmitting || disabled;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={isDisabled}
      className={`w-full bg-gradient-to-r from-amber-600 to-amber-700 text-white font-semibold py-4 rounded-xl hover:from-amber-700 hover:to-amber-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-amber-600/30 ${className}`}
    >
      {isSubmitting ? loadingText : children}
    </button>
  );
};

export default SubmitButton;
