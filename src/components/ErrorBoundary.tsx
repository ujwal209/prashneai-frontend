import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, ShieldAlert, ChevronRight } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 font-sans">
          <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl border border-slate-200 overflow-hidden">
            
            {/* Header Section */}
            <div className="p-8 text-center">
              <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6 border border-rose-100 shadow-sm">
                <AlertTriangle className="w-10 h-10 text-rose-600" />
              </div>
              
              <h1 className="text-2xl font-bold text-slate-900 mb-3 tracking-tight">
                Application Error
              </h1>
              
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                We encountered an unexpected issue while processing your request. 
                Our engineering team has been automatically notified.
              </p>

              <button
                onClick={() => window.location.reload()}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <RefreshCw className="w-5 h-5" />
                Reload Application
              </button>
            </div>

            {/* Technical Details Section */}
            <div className="bg-slate-50 border-t border-slate-100 p-6">
                <div className="flex items-center gap-2 mb-3">
                    <ShieldAlert className="w-4 h-4 text-slate-400" />
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                        Diagnostic Information
                    </span>
                </div>
                
                <div className="bg-slate-900 rounded-lg p-4 overflow-hidden border border-slate-800">
                    <code className="text-xs font-mono text-rose-300 block mb-2 break-words">
                        {this.state.error?.message || 'Unknown Error'}
                    </code>
                    <div className="h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 pr-2">
                        <pre className="text-[10px] font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
                            {this.state.errorInfo?.componentStack || this.state.error?.stack || 'No stack trace available.'}
                        </pre>
                    </div>
                </div>
                
                <div className="mt-4 text-center">
                    <p className="text-xs text-slate-400 font-medium">
                        Error Code: <span className="font-mono text-slate-500">ERR_CLIENT_RENDER</span>
                    </p>
                </div>
            </div>

          </div>
          
          <div className="mt-8 text-center">
             <p className="text-xs text-slate-400 font-medium">
                © 2025 Prashne Inc. Enterprise System.
             </p>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;