import axios from '../utils/axios';

/**
 * Audit Service
 * Dedicated service for compliance and change tracking.
 */
const auditService = {
    getAuditLogs: async (params = {}) => {
        // Endpoint: /api/v1/admin/audit-logs
        const response = await axios.get('/admin/audit-logs', { params });
        return response.data;
    }
};

export default auditService;
