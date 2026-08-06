import Spinner from '../ui/Spinner';

const LoadingScreen = ({ label = 'Loading…' }) => (
  <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-background">
    <Spinner size="lg" />
    <p className="text-sm text-muted">{label}</p>
  </div>
);

export default LoadingScreen;
