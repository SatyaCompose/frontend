import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const { isAuthenticated } = useAuth();

    // Wait for authentication state to be determined
    if (isAuthenticated === undefined) {
        return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
        return <Navigate to="/sign-in" replace />;
    }

    return <>{children}</>;
};

export default ProtectedRoute;
