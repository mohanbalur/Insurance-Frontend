import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../api/axios';
import { normalizeRole } from '../utils/role';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
    const [loading, setLoading] = useState(true);

    const isAuthenticated = !!accessToken;

    const normalizeUserRole = (u) => (u ? { ...u, role: normalizeRole(u.role) } : u);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(normalizeUserRole(JSON.parse(storedUser)));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const { accessToken, refreshToken, user: rawUserData } = response.data.data;
            const userData = normalizeUserRole(rawUserData);

            setAccessToken(accessToken);
            setUser(userData);

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(userData));

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const register = async (userData) => {
        try {
            const response = await axiosInstance.post('/auth/register', userData);
            const { accessToken, refreshToken, user: rawRegisteredUser } = response.data.data;
            const registeredUser = normalizeUserRole(rawRegisteredUser);

            setAccessToken(accessToken);
            setUser(registeredUser);

            localStorage.setItem('accessToken', accessToken);
            localStorage.setItem('refreshToken', refreshToken);
            localStorage.setItem('user', JSON.stringify(registeredUser));

            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const logout = async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setAccessToken(null);
            setUser(null);
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            localStorage.removeItem('user');
        }
    };

    const refreshToken = async () => {
        try {
            const currentRefreshToken = localStorage.getItem('refreshToken');
            if (!currentRefreshToken) throw new Error('No refresh token');

            const response = await axiosInstance.post('/auth/refresh', { refreshToken: currentRefreshToken });
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = response.data.data;

            setAccessToken(newAccessToken);
            localStorage.setItem('accessToken', newAccessToken);
            if (newRefreshToken) {
                localStorage.setItem('refreshToken', newRefreshToken);
            }

            return newAccessToken;
        } catch (error) {
            logout();
            throw error;
        }
    };

    const forgotPassword = async (email) => {
        try {
            const response = await axiosInstance.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const resetPassword = async (token, password) => {
        try {
            const response = await axiosInstance.post('/auth/reset-password', { token, password });
            return response.data;
        } catch (error) {
            throw error.response?.data || error;
        }
    };

    const refreshUser = async () => {
        try {
            const response = await axiosInstance.get('/users/profile');
            const userData = normalizeUserRole(response.data.data.user);
            setUser(userData);
            localStorage.setItem('user', JSON.stringify(userData));
            return userData;
        } catch (error) {
            console.error('Failed to refresh user data:', error);
            throw error;
        }
    };

    const value = {
        user,
        setUser,
        accessToken,
        isAuthenticated,
        loading,
        login,
        register,
        logout,
        refreshToken,
        refreshUser,
        forgotPassword,
        resetPassword
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
