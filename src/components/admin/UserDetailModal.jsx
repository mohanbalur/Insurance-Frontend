import React, { useEffect, useState } from 'react';
import { X, Shield, FileText, AlertCircle, Clock, CheckCircle, XCircle, CreditCard, User } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const UserDetailModal = ({ userId, onClose, onStatusChange }) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (userId) {
            fetchDetails();
        }
    }, [userId]);

    const fetchDetails = async () => {
        setLoading(true);
        try {
            const response = await adminService.getUserDetails(userId);
            setData(response.data);
        } catch (error) {
            toast.error('Failed to load user details');
            onClose();
        } finally {
            setLoading(false);
        }
    };

    const handleStatusToggle = async () => {
        if (!data || !data.user) return;
        const user = data.user;

        if (!confirm(`Are you sure you want to ${user.isActive ? 'SUSPEND' : 'ACTIVATE'} this account?`)) return;

        try {
            const newStatus = user.isActive ? 'SUSPENDED' : 'ACTIVE';
            const result = await adminService.updateUserStatus(user._id, newStatus);
            toast.success(`User ${newStatus === 'ACTIVE' ? 'Activated' : 'Suspended'}`);
            setData(prev => ({ ...prev, user: result.data.user }));
            if (onStatusChange) onStatusChange();
        } catch (error) {
            toast.error('Action failed');
        }
    };

    if (!userId) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fadeIn">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">

                {/* Header */}
                <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
                    <h2 className="text-lg font-bold text-[#0B1F3A] flex items-center gap-2">
                        <User className="text-[#1E90FF]" size={20} />
                        User Details
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1E90FF]"></div>
                        </div>
                    ) : data ? (
                        <>
                            {/* Profile Section */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                {/* Basic Info */}
                                <div className="md:col-span-1 space-y-4">
                                    <div className="flex flex-col items-center p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                        <div className="w-20 h-20 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-3xl font-bold mb-4">
                                            {data.user.name.charAt(0)}
                                        </div>
                                        <h3 className="text-lg font-bold text-[#0B1F3A]">{data.user.name}</h3>
                                        <p className="text-sm text-slate-500">{data.user.email}</p>

                                        <div className="mt-4 flex flex-wrap gap-2 justify-center">
                                            <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-bold uppercase">
                                                {data.user.role}
                                            </span>
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${data.user.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                                }`}>
                                                {data.user.isActive ? 'Active' : 'Suspended'}
                                            </span>
                                        </div>

                                        <button
                                            onClick={handleStatusToggle}
                                            className={`mt-6 w-full py-2 px-4 rounded-xl font-medium text-sm transition-all ${data.user.isActive
                                                ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200'
                                                : 'bg-green-50 text-green-600 hover:bg-green-100 border border-green-200'
                                                }`}
                                        >
                                            {data.user.isActive ? 'Suspend Account' : 'Reactivate Account'}
                                        </button>
                                    </div>
                                </div>

                                {/* Detailed Info */}
                                <div className="md:col-span-2 space-y-6">
                                    {/* Personal Details */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <Shield size={16} /> Personal Information
                                        </h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-slate-500">Phone</p>
                                                <p className="font-medium text-[#0B1F3A]">{data.user.phone || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">KYC Status</p>
                                                <p className="font-medium text-[#0B1F3A]">{data.user.kycStatus.replace(/_/g, ' ')}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Address</p>
                                                <p className="font-medium text-[#0B1F3A]">{data.user.address || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Join Date</p>
                                                <p className="font-medium text-[#0B1F3A]">
                                                    {new Date(data.user.createdAt).toLocaleDateString()}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Last Login</p>
                                                <p className="font-medium text-[#0B1F3A]">
                                                    {data.user.lastLogin
                                                        ? new Date(data.user.lastLogin).toLocaleString()
                                                        : 'Never'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-slate-500">Account Status</p>
                                                <p className={`font-medium ${data.user.isActive ? 'text-green-600' : 'text-red-600'}`}>
                                                    {data.user.isActive ? 'Active' : 'Suspended'}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Policies Summary */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <FileText size={16} /> Recent Policies ({data.policies.length})
                                        </h4>
                                        {data.policies.length === 0 ? (
                                            <p className="text-slate-400 text-sm italic">No policies found.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {data.policies.slice(0, 3).map(policy => (
                                                    <div key={policy._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                        <div>
                                                            <p className="text-sm font-bold text-[#0B1F3A]">{policy.policyNumber}</p>
                                                            <p className="text-xs text-slate-500">Premium: ₹{policy.premiumAmount}</p>
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${policy.status === 'ACTIVE' ? 'bg-green-100 text-green-700' : 'bg-slate-200 text-slate-600'
                                                            }`}>
                                                            {policy.status}
                                                        </span>
                                                    </div>
                                                ))}
                                                {data.policies.length > 3 && (
                                                    <p className="text-center text-xs text-blue-500 hover:underline cursor-pointer">
                                                        View all {data.policies.length} policies
                                                    </p>
                                                )}
                                            </div>
                                        )}
                                    </div>

                                    {/* Claims Summary */}
                                    <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                                        <h4 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                                            <AlertCircle size={16} /> Recent Claims ({data.claims.length})
                                        </h4>
                                        {data.claims.length === 0 ? (
                                            <p className="text-slate-400 text-sm italic">No claims found.</p>
                                        ) : (
                                            <div className="space-y-3">
                                                {data.claims.slice(0, 3).map(claim => (
                                                    <div key={claim._id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-100">
                                                        <div>
                                                            <p className="text-sm font-bold text-[#0B1F3A]">{claim.claimNumber}</p>
                                                            <p className="text-xs text-slate-500">{claim.reason} - ₹{claim.amount}</p>
                                                        </div>
                                                        <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${claim.status === 'APPROVED' ? 'bg-green-100 text-green-700' :
                                                            claim.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                                                                'bg-red-100 text-red-700'
                                                            }`}>
                                                            {claim.status}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-12 text-slate-500">User description unavailable</div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDetailModal;
