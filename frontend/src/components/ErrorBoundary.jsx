import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    // You can also log the error to an error reporting service
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen flex items-center justify-center bg-secondary p-4">
          <div className="bg-primary p-8 rounded-2xl shadow-theme max-w-lg w-full text-center border border-borderColor">
            <h1 className="text-3xl font-black text-red-600 mb-4">Oops! Something went wrong.</h1>
            <p className="text-textMuted mb-8 text-lg">We apologize, but an unexpected error occurred while loading this page.</p>
            <div className="p-4 bg-secondary rounded-lg mb-8 text-left overflow-auto max-h-40 border border-borderColor">
              <code className="text-sm text-red-500 font-mono">{this.state.error?.toString()}</code>
            </div>
            <button
              className="bg-accent text-white font-bold py-3 px-8 rounded-full shadow hover:bg-opacity-90 transition-colors"
              onClick={() => window.location.reload()}
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children; 
  }
}

export default ErrorBoundary;
