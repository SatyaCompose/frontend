import React, { Component, ReactNode } from 'react';

interface ErrorBoundaryProps {
    children: ReactNode; // Define 'children' type as ReactNode
}

interface ErrorBoundaryState {
    hasError: boolean;
    error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
    state: ErrorBoundaryState = { hasError: false, error: null };

    static getDerivedStateFromError(error: any) {
        return { hasError: true, error };
    }

    componentDidCatch(error: any, info: any) {
        console.error('ErrorBoundary caught an error', error, info);
    }

    render() {
        if (this.state.hasError) {
            return <h1>Something went wrong: {this.state.error?.message}</h1>;
        }
        return this.props.children; // Safe access to children
    }
}

export default ErrorBoundary;
