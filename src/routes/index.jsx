import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import PublicLayout from '../layouts/PublicLayout';
import DashboardLayout from '../layouts/DashboardLayout';
import ProtectedRoute from '../components/common/ProtectedRoute';
import HomePage from '../pages/HomePage';
import PlansPage from '../pages/PlansPage';
import PlanDetailPage from '../pages/PlanDetailPage';
import RegisterPage from '../pages/RegisterPage';
import LoginPage from '../pages/LoginPage';
import ForgotPassword from '../pages/ForgotPassword';
import ResetPassword from '../pages/ResetPassword';
import UserDashboard from '../pages/UserDashboard';
import PoliciesPage from '../pages/dashboard/PoliciesPage';
import ClaimsPage from '../pages/dashboard/ClaimsPage';
import PaymentsPage from '../pages/dashboard/PaymentsPage';
import ProfilePage from '../pages/dashboard/ProfilePage';
import KYCPage from '../pages/dashboard/KYCPage';
import FileClaimPage from '../pages/dashboard/FileClaimPage';
import BecomeAgent from '../pages/dashboard/BecomeAgent';
import PaymentSimulationPage from '../pages/dashboard/PaymentSimulationPage';

// Admin Imports
import AdminRoute from '../components/admin/AdminRoute';
import AdminLayout from '../layouts/AdminLayout';
import AdminDashboard from '../pages/admin/AdminDashboard';
import KycReviewCenter from '../pages/admin/KycReviewCenter';
import UnderwritingQueue from '../pages/admin/UnderwritingQueue';
import ClaimsCommandCenter from '../pages/admin/ClaimsCommandCenter';
import AgentDirectory from '../pages/admin/AgentDirectory';
import AuditLogViewer from '../pages/admin/AuditLogViewer';
import UserDirectory from '../pages/admin/UserDirectory';
import CmsEditor from '../pages/admin/CmsEditor';
import AdminProfile from '../pages/admin/AdminProfile';
import PlanManagement from '../pages/admin/PlanManagement';
import CategoryManagement from '../pages/admin/CategoryManagement';

// Agent Imports
import AgentDashboard from '../pages/agent/AgentDashboard';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Routes */}
            <Route element={<PublicLayout />}>
                <Route path="/" element={<HomePage />} />
                <Route path="/plans" element={<PlansPage />} />
                <Route path="/plans/:id" element={<PlanDetailPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
            </Route>

            {/* Agent Dashboard Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['AGENT']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/agent/dashboard" element={<AgentDashboard />} />
                    <Route path="/agent/overview" element={<AgentDashboard />} />
                </Route>
            </Route>

            {/* Dashboard Routes (Protected) */}
            <Route element={<ProtectedRoute allowedRoles={['USER', 'ADMIN', 'AGENT']} />}>
                <Route element={<DashboardLayout />}>
                    <Route path="/dashboard" element={<UserDashboard />} />
                    <Route path="/dashboard/policies" element={<PoliciesPage />} />
                    <Route path="/dashboard/claims" element={<ClaimsPage />} />
                    <Route path="/dashboard/claims/new" element={<FileClaimPage />} />
                    <Route path="/dashboard/payments" element={<PaymentsPage />} />
                    <Route path="/dashboard/payments/simulate/:policyId" element={<PaymentSimulationPage />} />
                    <Route path="/dashboard/kyc" element={<KYCPage />} />
                    <Route path="/dashboard/apply-agent" element={<BecomeAgent />} />
                </Route>
                <Route element={<PublicLayout />}>
                    <Route path="/profile" element={<ProfilePage />} />
                </Route>
            </Route>

            {/* Admin Routes (RBAC Isolated) */}
            <Route element={<AdminRoute />}>
                <Route element={<AdminLayout />}>
                    <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/kyc" element={<KycReviewCenter />} />
                    <Route path="/admin/plans" element={<PlanManagement />} />
                    <Route path="/admin/categories" element={<CategoryManagement />} />
                    <Route path="/admin/underwriting" element={<UnderwritingQueue />} />
                    <Route path="/admin/agents" element={<AgentDirectory />} />
                    <Route path="/admin/claims" element={<ClaimsCommandCenter />} />
                    <Route path="/admin/audit-logs" element={<AuditLogViewer />} />
                    <Route path="/admin/users" element={<UserDirectory />} />
                    <Route path="/admin/cms" element={<CmsEditor />} />
                    <Route path="/admin/profile" element={<AdminProfile />} />
                </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
};

export default AppRoutes;
