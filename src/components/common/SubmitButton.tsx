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
      className={`w-full bg-[#2A9D8F] text-white font-medium py-3 rounded-lg hover:bg-opacity-90 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {isSubmitting ? loadingText : children}
    </button>
  );
};

export default SubmitButton;
