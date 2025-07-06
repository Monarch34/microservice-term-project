import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import Cookies from 'js-cookie';
import apiClient from '../api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(Cookies.get('token') || null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchUser = useCallback(async () => {
        if (!Cookies.get('token')) {
            setUser(null);
            setIsLoading(false);
            return;
        }
        try {
            const response = await apiClient.get('/api/user/me');
            const userData = response.data;
            
            // Kullanıcı verisine isAdmin bayrağını ekle
            const isAdmin = userData.email === 'admin@gmail.com';
            setUser({ ...userData, isAdmin });

        } catch (error) {
            console.error("Failed to fetch user. Token might be invalid.", error);
            logout();
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const login = (jwtToken) => {
        setToken(jwtToken);
        Cookies.set('token', jwtToken, { expires: 1, secure: true, sameSite: 'strict' });
        fetchUser();
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        Cookies.remove('token');
    };

    const value = {
        user,
        token,
        isAuthenticated: !!user,
        isAdmin: user?.isAdmin || false, // isAdmin durumunu context'ten sağla
        isLoading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    return useContext(AuthContext);
};