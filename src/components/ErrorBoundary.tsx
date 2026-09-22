import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return (
        <div style={{ padding: '24px', color: '#c6d4df', background: '#1b2838', borderRadius: '4px', margin: '16px' }}>
          <h2 style={{ color: '#fe7676', margin: '0 0 12px' }}>Algo ha ido mal</h2>
          <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word', fontSize: '13px', fontFamily: 'monospace' }}>
            {this.state.error?.message}
            {this.state.error?.stack && `\n\n${this.state.error.stack}`}
          </pre>
        </div>
      );
    }

    return this.props.children;
  }
}