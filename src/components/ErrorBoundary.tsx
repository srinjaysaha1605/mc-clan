import React, { Component, ErrorInfo, ReactNode } from "react";
import { ShieldAlert } from "lucide-react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      let errorMessage = "AN UNEXPECTED SYSTEM ERROR HAS OCCURRED.";
      let errorDetails = "";

      try {
        const parsedError = JSON.parse(this.state.error?.message || "");
        if (parsedError.error) {
          errorMessage = "ACCESS DENIED: INSUFFICIENT PERMISSIONS.";
          errorDetails = `OPERATION: ${parsedError.operationType.toUpperCase()} // PATH: ${parsedError.path}`;
        }
      } catch (e) {
        // Not a JSON error
      }

      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-8 font-mono">
          <div className="w-24 h-24 border-2 border-red-500 flex items-center justify-center mb-8 animate-pulse">
            <ShieldAlert size={48} className="text-red-500" />
          </div>
          <h1 className="text-4xl font-black tracking-tighter uppercase mb-4 text-red-500 glitch-text">
            SYSTEM FAILURE
          </h1>
          <p className="text-sm uppercase tracking-widest text-white/60 mb-8 text-center max-w-md">
            {errorMessage}
          </p>
          {errorDetails && (
            <div className="bg-red-500/10 border border-red-500/20 p-4 mb-8 text-[10px] uppercase tracking-widest text-red-500/80">
              {errorDetails}
            </div>
          )}
          <button
            onClick={() => window.location.reload()}
            className="bg-white text-black px-8 py-4 font-black uppercase tracking-widest hover:bg-white/90 transition-colors"
          >
            REBOOT SYSTEM
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
