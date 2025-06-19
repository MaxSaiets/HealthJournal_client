
interface SpinnerProps {
  className?: string;
}

const LoadingSpinner: React.FC<SpinnerProps> = ({className=""}) => {
    return (
      <div className={`flex items-center justify-center h-screen ${className}`}>
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  };
  
export default LoadingSpinner;