import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { normalizeRole } from '../../utils/role';

/**
 * AdminRoute Guard
 * Enforces authenticated session and 'ADMIN' role.
 * Structural isolation from standard user ProtectedRoute.
 */
const AdminRoute = () => {
    const { isAuthenticated, user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#1E90FF]"></div>
            </div>
        );
    }

    // Role spoofing & URL tampering prevention
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (normalizeRole(user?.role) !== 'ADMIN') {
        console.warn('Unauthorized access attempt to Admin Namespace blocked.');
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
};

export default AdminRoute;
