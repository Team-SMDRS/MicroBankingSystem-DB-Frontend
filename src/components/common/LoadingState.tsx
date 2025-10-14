import LoadingSpinner from './LoadingSpinner';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  loadingMessage?: string;
}

const LoadingState = ({ loading, error, children, loadingMessage = 'Loading...' }: LoadingStateProps) => {
  if (loading) {
    return (
      <div className="min-h-[200px] flex flex-col items-center justify-center">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-slate-600">{loadingMessage}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
        {error}
      </div>
    );
  }

  return <>{children}</>;
};

export default LoadingState;