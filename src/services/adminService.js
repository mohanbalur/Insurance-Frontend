import axios from '../api/axios';

/**
 * Admin Service
 * Centralized logic for all financial and operational control endpoints.
 */
const adminService = {
    // Dashboard & Reports
    getDashboardSummary: async () => {
        const response = await axios.get('/admin/dashboard-summary');
        return response.data;
    },

    getRevenueReport: async () => {
        const response = await axios.get('/admin/revenue-report');
        return response.data;
    },

    getClaimsReport: async () => {
        const response = await axios.get('/admin/claims-report');
        return response.data;
    },

    getPolicyReport: async () => {
        const response = await axios.get('/admin/policy-report');
        return response.data;
    },

    getAgentReport: async () => {
        const response = await axios.get('/admin/agent-report');
        return response.data;
    },

    // Agent Management
    // Agent Management
    getAllAgents: async (params) => {
        const response = await axios.get('/admin/agents', { params });
        return response.data;
    },

    approveAgent: async (agentId) => {
        const response = await axios.put(`/admin/agents/${agentId}/approve`);
        return response.data;
    },

    // Audit Logs
    getAuditLogs: async (params) => {
        const response = await axios.get('/admin/audit-logs', { params });
        return response.data;
    },

    // KYC Admin
    getPendingKYC: async (page = 1, limit = 10, status = 'PENDING_VERIFICATION') => {
        const response = await axios.get(`/users/admin/kyc/pending`, {
            params: { page, limit, status }
        });
        return response.data;
    },

    verifyKYC: async (userId) => {
        const response = await axios.patch(`/users/admin/kyc/${userId}/verify`);
        return response.data;
    },

    rejectKYC: async (userId, reason) => {
        const response = await axios.patch(`/users/admin/kyc/${userId}/reject`, { reason });
        return response.data;
    },

    // Claims Admin
    getAllClaims: async (params) => {
        const response = await axios.get('/claims', { params });
        return response.data;
    },

    getPolicyCoverage: async (policyId) => {
        const response = await axios.get(`/policies/${policyId}/coverage-summary`);
        return response.data;
    },

    updateClaimStatus: async (claimId, status, adminNotes) => {
        const response = await axios.patch(`/claims/${claimId}/status`, { status, adminNotes });
        return response.data;
    },

    // Policy Underwriting Admin
    getPendingPolicies: async () => {
        const response = await axios.get('/policies/admin/pending');
        return response.data;
    },

    approvePolicy: async (policyId, riskNotes) => {
        const response = await axios.patch(`/policies/admin/${policyId}/approve`, { riskNotes });
        return response.data;
    },

    rejectPolicy: async (policyId, reason) => {
        const response = await axios.patch(`/policies/admin/${policyId}/reject`, { reason });
        return response.data;
    },

    // User Management
    getAllUsers: async (params) => {
        const response = await axios.get('/admin/users', { params });
        return response.data;
    },

    getUserDetails: async (userId) => {
        const response = await axios.get(`/admin/users/${userId}`);
        return response.data;
    },

    updateUserStatus: async (userId, status) => {
        const response = await axios.patch(`/admin/users/${userId}/status`, { status });
        return response.data;
    },

    // CMS Management
    listCmsPages: async () => {
        const response = await axios.get('/cms');
        return response.data;
    },

    getCmsPage: async (pageKey) => {
        const response = await axios.get(`/cms/${pageKey}`);
        return response.data;
    },

    updateCmsPage: async (pageKey, data) => {
        const response = await axios.put(`/cms/${pageKey}`, data);
        return response.data;
    },

    addCmsSection: async (pageKey, sectionData) => {
        const response = await axios.post(`/cms/${pageKey}/section`, sectionData);
        return response.data;
    },

    updateCmsSection: async (pageKey, sectionId, updates) => {
        const response = await axios.put(`/cms/${pageKey}/section/${sectionId}`, updates);
        return response.data;
    },

    deleteCmsSection: async (pageKey, sectionId) => {
        const response = await axios.delete(`/cms/${pageKey}/section/${sectionId}`);
        return response.data;
    },

    // Media Upload
    uploadMedia: async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        const response = await axios.post('/media/upload', formData);
        return response.data;
    },

    // Plan Management (Insurance Products)
    adminGetPlans: async () => {
        const response = await axios.get('/plans/admin/all');
        return response.data;
    },

    adminCreatePlan: async (planData) => {
        const response = await axios.post('/plans', planData);
        return response.data;
    },

    adminUpdatePlan: async (planId, planData) => {
        const response = await axios.put(`/plans/${planId}`, planData);
        return response.data;
    },

    adminDeletePlan: async (planId) => {
        const response = await axios.delete(`/plans/${planId}`);
        return response.data;
    },

    // Category Management (Insurance Types)
    adminGetPlanTypes: async (params) => {
        const response = await axios.get('/plan-types', { params });
        return response.data;
    },

    adminCreatePlanType: async (data) => {
        const response = await axios.post('/plan-types', data);
        return response.data;
    },

    adminUpdatePlanType: async (id, data) => {
        const response = await axios.put(`/plan-types/${id}`, data);
        return response.data;
    },

    adminDeletePlanType: async (id) => {
        const response = await axios.delete(`/plan-types/${id}`);
        return response.data;
    },
};

export default adminService;


