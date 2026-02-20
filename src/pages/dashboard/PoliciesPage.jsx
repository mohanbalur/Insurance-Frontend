import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import PolicyStatusBadge from '../../components/PolicyStatusBadge';
import { Trash2 } from 'lucide-react';
import toast from 'react-hot-toast';

const PoliciesPage = () => {
    const [policies, setPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPolicies = async () => {
            try {
                const response = await axiosInstance.get('/policies/my-policies');
                setPolicies(response.data.data.policies || []);
            } catch (error) {
                console.error('Error fetching policies:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchPolicies();
    }, []);

    const navigate = useNavigate();

    const handleCompletePayment = (policyId) => {
        navigate(`/dashboard/payments/simulate/${policyId}`);
    };

    const handleRemovePolicy = async (policyId) => {
        if (!window.confirm('Are you sure you want to remove this policy? This action cannot be undone.')) {
            return;
        }

        try {
            await axiosInstance.delete(`/policies/${policyId}`);
            toast.success('Policy removed successfully');
            setPolicies(prev => prev.filter(p => p._id !== policyId));
        } catch (error) {
            console.error('Error removing policy:', error);
            toast.error(error.response?.data?.message || 'Failed to remove policy');
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1E90FF]"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fadeIn">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-[#0B1F3A]">My Policies</h1>
                    <p className="text-slate-500">Manage and view your insurance coverage lifecycle.</p>
                </div>
                <button
                    onClick={() => {
                        setLoading(true);
                        const fetch = async () => {
                            try {
                                const response = await axiosInstance.get('/policies/my-policies');
                                setPolicies(response.data.data.policies || []);
                            } catch (e) {
                                console.error(e);
                            } finally {
                                setLoading(false);
                            }
                        };
                        fetch();
                    }}
                    className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#1E90FF] hover:bg-[#1E90FF]/5 rounded-xl transition-all"
                    title="Check for status updates"
                >
                    <svg className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Refresh
                </button>
            </div>

            <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-50 border-b border-slate-100">
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Policy Number / ID</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Plan Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Coverage</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {policies.length > 0 ? (
                                policies.map((policy) => (
                                    <tr key={policy._id} className="hover:bg-slate-50 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#0B1F3A]">{policy.policyNumber}</span>
                                                <span className="text-[10px] text-slate-400 font-mono uppercase">ID: {policy._id.slice(-8)}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-slate-600">{policy.plan?.name || 'Unknown Plan'}</span>
                                                {policy.plan?.isDeleted && (
                                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-tight mt-0.5">Archived Plan</span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {policy.status === 'ACTIVE' ? (
                                                <div className="text-sm text-slate-600">
                                                    {new Date(policy.startDate).toLocaleDateString()} - {new Date(policy.endDate).toLocaleDateString()}
                                                </div>
                                            ) : (
                                                <span className="text-sm text-slate-400 italic">Not yet active</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="text-sm font-bold text-[#0B1F3A]">₹{policy.coverageAmount.toLocaleString()}</span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col gap-1">
                                                <PolicyStatusBadge status={policy.status} />
                                                {policy.status === 'REJECTED' && policy.rejectionReason && (
                                                    <span className="text-[10px] text-red-500 max-w-[150px] truncate" title={policy.rejectionReason}>
                                                        Reason: {policy.rejectionReason}
                                                    </span>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            {policy.status === 'PENDING_PAYMENT' ? (
                                                <button
                                                    onClick={() => handleCompletePayment(policy._id)}
                                                    className="text-xs font-bold text-white bg-[#1E90FF] px-3 py-1.5 rounded-lg hover:bg-blue-600 transition-colors"
                                                >
                                                    Pay Now
                                                </button>
                                            ) : policy.status === 'ACTIVE' ? (
                                                <Link
                                                    to="/dashboard/claims"
                                                    className="text-xs font-bold text-[#1E90FF] border border-[#1E90FF] px-3 py-1.5 rounded-lg hover:bg-[#1E90FF] hover:text-white transition-all"
                                                >
                                                    Claim
                                                </Link>
                                            ) : policy.status === 'REJECTED' ? (
                                                <span className="text-xs text-slate-400 font-medium">Contact Support</span>
                                            ) : (
                                                <span className="text-xs text-slate-400">Locked</span>
                                            )}

                                            {/* Remove Button (Only for non-ACTIVE policies) */}
                                            {policy.status !== 'ACTIVE' && (
                                                <button
                                                    onClick={() => handleRemovePolicy(policy._id)}
                                                    className="ml-3 p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                                                    title="Remove Policy"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400">
                                        <div className="flex flex-col items-center">
                                            <p className="mb-4">No policies found.</p>
                                            <Link to="/plans" className="text-[#1E90FF] font-bold underline">Browse Plans</Link>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default PoliciesPage;
