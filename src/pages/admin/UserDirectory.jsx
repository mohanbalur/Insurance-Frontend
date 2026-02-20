import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    Shield,
    FileText,
    AlertCircle,
    MoreVertical,
    CheckCircle,
    XCircle,
    Eye,
    Lock,
    Unlock,
    User
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import UserDetailModal from '../../components/admin/UserDetailModal';

// Enum Maps for UI Badges
const KYC_STATUS_COLORS = {
    NOT_SUBMITTED: 'bg-slate-100 text-slate-600',
    PENDING_VERIFICATION: 'bg-orange-100 text-orange-600',
    VERIFIED: 'bg-green-100 text-green-600',
    REJECTED: 'bg-red-100 text-red-600'
};

const UserDirectory = () => {
    // State
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, pages: 1 });
    const [searchQuery, setSearchQuery] = useState('');
    const [filters, setFilters] = useState({
        role: '',
        kycStatus: '',
        policyStatus: '',
        isActive: '' // 'true' or 'false'
    });
    const [showFilters, setShowFilters] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Fetch Data
    const fetchUsers = async () => {
        setLoading(true);
        try {
            const params = {
                page: pagination.page,
                limit: pagination.limit,
                search: searchQuery,
                ...filters
            };
            // Clean empty filters
            Object.keys(params).forEach(key => params[key] === '' && delete params[key]);

            const response = await adminService.getAllUsers(params);
            setUsers(response.data.users);
            // Backend returns flat { users, total, page, pages }
            const { total, page, pages } = response.data;
            setPagination(prev => ({ ...prev, total, page, pages }));
        } catch (error) {
            toast.error('Failed to load users');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Debounce Search
    useEffect(() => {
        const timer = setTimeout(() => {
            setPagination(prev => ({ ...prev, page: 1 }));
            fetchUsers();
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery, filters]);

    // Pagination Change
    useEffect(() => {
        if (pagination.page > 0) {
            fetchUsers();
        }
    }, [pagination.page]);

    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
        setPagination(prev => ({ ...prev, page: 1 }));
    };

    const toggleUserStatus = async (user) => {
        if (!confirm(`Are you sure you want to ${user.isActive ? 'SUSPEND' : 'ACTIVATE'} ${user.name}?`)) return;

        try {
            const newStatus = user.isActive ? 'SUSPENDED' : 'ACTIVE';
            await adminService.updateUserStatus(user._id, newStatus);
            toast.success(`User ${newStatus === 'ACTIVE' ? 'Activated' : 'Suspended'} Successfully`);
            fetchUsers();
        } catch (error) {
            toast.error('Failed to update status');
        }
    };

    const handleUserUpdate = () => {
        fetchUsers();
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1F3A]">User Directory</h1>
                    <p className="text-slate-500 text-sm">Manage system users, view KYC status, and control access.</p>
                </div>
                <div className="flex items-center space-x-3">
                    <div className="bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-200 text-sm font-medium">
                        <span className="text-slate-500 mr-2">Total Users:</span>
                        <span className="text-[#0B1F3A] font-bold">{pagination.total}</span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                    <input
                        type="text"
                        placeholder="Search by name or email..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] focus:border-transparent"
                    />
                </div>

                {/* Filter Toggle */}
                <div className="flex items-center space-x-2 w-full md:w-auto">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`px-4 py-2 rounded-xl border flex items-center gap-2 text-sm font-medium transition-colors ${showFilters ? 'bg-blue-50 border-[#1E90FF] text-[#1E90FF]' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                            }`}
                    >
                        <Filter size={18} />
                        Filters
                    </button>
                </div>
            </div>

            {/* Expanded Filters */}
            {showFilters && (
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fadeIn">
                    {/* Role Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Role</label>
                        <select
                            value={filters.role}
                            onChange={(e) => handleFilterChange('role', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        >
                            <option value="">All Roles</option>
                            <option value="USER">User</option>
                        </select>
                    </div>

                    {/* KYC Status Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">KYC Status</label>
                        <select
                            value={filters.kycStatus}
                            onChange={(e) => handleFilterChange('kycStatus', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        >
                            <option value="">All Statuses</option>
                            <option value="NOT_SUBMITTED">Not Submitted</option>
                            <option value="PENDING_VERIFICATION">Pending Review</option>
                            <option value="VERIFIED">Verified</option>
                            <option value="REJECTED">Rejected</option>
                        </select>
                    </div>

                    {/* Policy Status Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Policy Status</label>
                        <select
                            value={filters.policyStatus}
                            onChange={(e) => handleFilterChange('policyStatus', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        >
                            <option value="">All Policy Statuses</option>
                            <option value="ACTIVE">Active Policy</option>
                            <option value="PENDING">Pending Policy</option>
                            <option value="EXPIRED">Expired Policy</option>
                            <option value="CANCELLED">Cancelled Policy</option>
                        </select>
                    </div>

                    {/* Account Status Filter */}
                    <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1">Account Status</label>
                        <select
                            value={filters.isActive}
                            onChange={(e) => handleFilterChange('isActive', e.target.value)}
                            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#1E90FF]"
                        >
                            <option value="">All Accounts</option>
                            <option value="true">Active</option>
                            <option value="false">Suspended</option>
                        </select>
                    </div>
                </div>
            )}

            {/* Table */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left min-w-[1000px]">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">KYC Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Policies</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Claims</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {loading ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">Loading users...</td>
                                </tr>
                            ) : users.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-slate-400">No users found matching filters.</td>
                                </tr>
                            ) : (
                                users.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-xs uppercase">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold text-[#0B1F3A]">{user.name}</p>
                                                    <p className="text-xs text-slate-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${user.role === 'ADMIN' ? 'bg-purple-100 text-purple-700' :
                                                user.role === 'AGENT' ? 'bg-indigo-100 text-indigo-700' :
                                                    'bg-slate-100 text-slate-600'
                                                }`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full ${KYC_STATUS_COLORS[user.kycStatus] || 'bg-slate-100'}`}>
                                                {user.kycStatus.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0B1F3A]">{user.policiesCount}</span>
                                                <span className="text-[10px] text-green-600 font-medium">{user.activePoliciesCount} Active</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0B1F3A]">{user.claimsCount}</span>
                                                <span className="text-[10px] text-orange-600 font-medium">{user.pendingClaimsCount} Pending</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {user.isActive ? (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                                                    <CheckCircle size={12} /> Active
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center gap-1 text-xs font-semibold text-red-600 bg-red-50 px-2 py-1 rounded-lg">
                                                    <XCircle size={12} /> Suspended
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex items-center justify-end space-x-2">
                                                <button
                                                    onClick={() => toggleUserStatus(user)}
                                                    className={`p-2 rounded-lg transition-colors ${user.isActive
                                                        ? 'text-red-500 hover:bg-red-50 hover:text-red-700'
                                                        : 'text-green-500 hover:bg-green-50 hover:text-green-700'
                                                        }`}
                                                    title={user.isActive ? "Suspend User" : "Activate User"}
                                                >
                                                    {user.isActive ? <Lock size={16} /> : <Unlock size={16} />}
                                                </button>
                                                <button
                                                    onClick={() => setSelectedUserId(user._id)}
                                                    className="p-2 text-slate-400 hover:text-[#1E90FF] hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Details"
                                                >
                                                    <Eye size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
                    <p className="text-sm text-slate-500">
                        Page <span className="font-bold text-[#0B1F3A]">{pagination.page}</span> of <span className="font-bold text-[#0B1F3A]">{pagination.pages}</span>
                    </p>
                    <div className="flex space-x-2">
                        <button
                            disabled={pagination.page === 1}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${pagination.page === 1
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#0B1F3A]'
                                }`}
                        >
                            Previous
                        </button>
                        <button
                            disabled={pagination.page === pagination.pages}
                            onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${pagination.page === pagination.pages
                                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:text-[#0B1F3A]'
                                }`}
                        >
                            Next
                        </button>
                    </div>
                </div>
            </div>

            {/* User Detail Modal */}
            {selectedUserId && (
                <UserDetailModal
                    userId={selectedUserId}
                    onClose={() => setSelectedUserId(null)}
                    onStatusChange={handleUserUpdate}
                />
            )}
        </div>
    );
};

export default UserDirectory;
