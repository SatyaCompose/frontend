import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import {jwtDecode} from 'jwt-decode';
import { refreshAccessTokenService, refreshTokenService } from '../services/auth';

interface AuthContextProps {
    isAuthenticated: boolean;
    login: (token: string) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(true);

    const login = useCallback((token: string) => {
        localStorage.setItem('auth_token', token);
        setIsAuthenticated(true);
    },[]);

    const logout = useCallback(() => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('refresh_token')
        setIsAuthenticated(false);
    }, []);

    useEffect(() => {
        const initializeAuth = async () => {
            const refreshAccessToken = async () => {
                try {
                    const refreshToken = localStorage?.getItem('refresh_token');
                    if (!refreshToken) {
                        logout();
                        const refreshToken = await refreshTokenService();
                        localStorage?.setItem('refresh_token', refreshToken)
                        return refreshToken;
                    }

                    const response = await refreshAccessTokenService();
                    const { accessToken } = response?.data ?? {};

                    localStorage?.setItem('auth_token', accessToken);

                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("Failed to refresh token:", error);
                    logout();
                }
            };

            setLoading(true);

            const token = localStorage?.getItem('auth_token');
            if (token) {
                try {
                    const decoded: any = jwtDecode(token);
                    const isTokenExpired = decoded?.exp * 1000 < Date.now();

                    const isValidBase64 = (str: string): boolean => {
                        try {
                            atob(str);
                            return true;
                        } catch (e) {
                            return false;
                        }
                    };

                    const decodeTokenSafely = (token: string) => {
                        if (!token || !isValidBase64(token?.split('.')?.[1] || '')) {
                            console.error('Invalid token format:', token);
                            return null;
                        }
                        return jwtDecode(token);
                    };

                    const decodedToken = decodeTokenSafely(localStorage.getItem('auth_token') ?? '');
                    if (!decodedToken) {
                        console.error('Token decoding failed.');
                        logout();
                    }

                    if (isTokenExpired || token?.trim() === 'undefined' || isValidBase64(token) ) {
                        await refreshAccessToken();
                    } else {
                        setIsAuthenticated(true);

                        const timeUntilExpiry = decoded?.exp * 1000 - Date.now();
                        setTimeout(refreshAccessToken, timeUntilExpiry - 60000); 
                    }
                } catch (error) {
                    console.error("Invalid token:", error);
                    logout();
                }
            }
            setLoading(false);
        };

        initializeAuth();
    }, [logout]);

    const contextValue = useMemo(
        () => ({
            isAuthenticated,
            login,
            logout,
        }), [isAuthenticated, login, logout]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <AuthContext.Provider value={contextValue}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
