import { Component, StrictMode, type ErrorInfo, type ReactNode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

interface RootErrorBoundaryProps {
  children: ReactNode;
}

interface RootErrorBoundaryState {
  hasError: boolean;
  message: string;
}

class RootErrorBoundary extends Component<RootErrorBoundaryProps, RootErrorBoundaryState> {
  constructor(props: RootErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): RootErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Root render error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '24px', fontFamily: 'system-ui, sans-serif' }}>
          <h2>Application Error</h2>
          <p>The app crashed while rendering. Please refresh after dependency updates.</p>
          <pre style={{ whiteSpace: 'pre-wrap' }}>{this.state.message}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RootErrorBoundary>
      <App />
    </RootErrorBoundary>
  </StrictMode>,
)
