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
      className={`w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white font-semibold py-4 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-600/30 ${className}`}
    >
      {isSubmitting ? loadingText : children}
    </button>
  );
};

export default SubmitButton;
