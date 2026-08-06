import { Component } from 'react';
import { AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';

// React error boundaries must be class components — there is no hook
// equivalent for getDerivedStateFromError/componentDidCatch yet.
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught render error:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.assign('/');
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-slate-50 px-6 text-center">
          <AlertTriangle className="h-10 w-10 text-red-500" />
          <h1 className="text-lg font-semibold text-slate-900">Something went wrong</h1>
          <p className="max-w-sm text-sm text-slate-600">
            An unexpected error occurred while rendering this page. Try going back to the
            homepage.
          </p>
          <Button onClick={this.handleReset}>Back to homepage</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
