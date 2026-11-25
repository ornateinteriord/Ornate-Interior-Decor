import React, { Component, ErrorInfo, ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, RotateCcw } from "lucide-react";
import Seo from "@/components/seo/Seo";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  public state: ErrorBoundaryState = {
    hasError: false,
  };

  public static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  public componentDidCatch(_error: Error, _errorInfo: ErrorInfo) {
    // Handled gracefully by fallback UI without polluting browser console.
  }

  private handleReset = () => {
    this.setState({ hasError: false });
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-ornate-offwhite pt-32 pb-20">
          <Seo
            title="Something Went Wrong"
            description="An unexpected error occurred while loading this page on Ornate Interior Decor."
            path="/error"
            noIndex
          />
          <div className="ornate-container">
            <div className="max-w-xl mx-auto bg-white border border-ornate-gold/20 p-10 text-center shadow-sm">
              <p className="ornate-subtitle mb-3">Application Error</p>
              <h1 className="font-serif text-3xl md:text-4xl text-ornate-charcoal mb-4">
                Unable to Display This Page
              </h1>
              <p className="text-ornate-charcoal/80 mb-8 leading-relaxed">
                An unexpected issue interrupted loading this view. You can reload the page or return to the studio homepage.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="ornate-btn-primary inline-flex items-center justify-center"
                >
                  <RotateCcw size={16} className="mr-2" aria-hidden="true" />
                  Try Again
                </button>
                <Link
                  to="/"
                  onClick={this.handleReset}
                  className="ornate-btn-outline inline-flex items-center justify-center"
                >
                  <ArrowLeft size={16} className="mr-2" aria-hidden="true" />
                  Return to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

