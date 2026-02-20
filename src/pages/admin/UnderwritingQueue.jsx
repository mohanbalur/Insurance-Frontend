import React, { useState, useEffect } from 'react';
import {
    Search,
    RefreshCw,
    Shield,
    ChevronRight,
    Users,
    ClipboardList,
    AlertTriangle
} from 'lucide-react';
import adminService from '../../services/adminService';
import PolicyReviewModal from '../../components/admin/PolicyReviewModal';
import toast from 'react-hot-toast';

const UnderwritingQueue = () => {
    const [loading, setLoading] = useState(true);
    const [policies, setPolicies] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPolicy, setSelectedPolicy] = useState(null);

    useEffect(() => {
        fetchPolicies();
    }, []);

    const fetchPolicies = async () => {
        setLoading(true);
        try {
            const response = await adminService.getPendingPolicies();
            // Assuming the backend returns data.policies or data.data.policies
            // Standardizing based on expected response structure
            setPolicies(response.data?.policies || response.policies || []);
        } catch (error) {
            console.error('Underwriting Fetch Error:', error);
            toast.error('Failed to load underwriting queue');
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (policyId, riskNotes) => {
        try {
            await adminService.approvePolicy(policyId, riskNotes);
            toast.success('Policy Approved Successfully');
            fetchPolicies(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Approval failed');
        }
    };

    const handleReject = async (policyId, reason) => {
        try {
            await adminService.rejectPolicy(policyId, reason);
            toast.success('Policy Rejected Successfully');
            fetchPolicies(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        }
    };

    const filteredPolicies = policies.filter(p =>
        p.policyNumber?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p._id.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Underwriting Queue
                        {policies.length > 0 && (
                            <span className="px-2 py-0.5 bg-orange-500/20 text-orange-400 text-xs rounded-full border border-orange-500/30">
                                {policies.length} PENDING
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-400 mt-1">Assess paid policies and authorize risk coverage.</p>
                </div>

                <div className="flex gap-3">
                    <button
                        onClick={fetchPolicies}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all active:scale-95"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-[#162031] border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <ClipboardList size={20} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Awaiting Review</p>
                        <p className="text-xl font-bold text-white">{policies.length}</p>
                    </div>
                </div>
            </div>

            {/* Search */}
            <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                <input
                    type="text"
                    placeholder="Search by policy number, name, or email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-[#162031] border border-slate-800 rounded-2xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all shadow-xl"
                />
            </div>

            {/* Policies Table - Priority */}
            <div className="bg-[#162031] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Policy Reference</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Policyholder</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Risk Plan</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">KYC Status</th>
                                <th className="px-6 py-4 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-4">
                                            <div className="h-10 bg-slate-800/50 rounded-xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredPolicies.length > 0 ? (
                                filteredPolicies.map((policy) => (
                                    <tr key={policy._id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-200 font-mono tracking-tight uppercase">
                                                    {policy.policyNumber || policy._id.slice(-8).toUpperCase()}
                                                </span>
                                                <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-tighter">Issue Date: {new Date(policy.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-300 uppercase">{policy.user?.name}</span>
                                                <span className="text-xs text-slate-500">{policy.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-[#1E90FF]">{policy.plan?.name}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">₹{policy.premiumAmount?.toLocaleString()} Premium</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${policy.user?.kycStatus === 'VERIFIED'
                                                ? 'bg-green-500/10 text-green-400 border-green-500/20'
                                                : 'bg-red-500/10 text-red-400 border-red-500/20'
                                                }`}>
                                                {policy.user?.kycStatus || 'UNKNOWN'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedPolicy(policy)}
                                                className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ml-auto"
                                            >
                                                Assess Risk
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-12 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-600 space-y-4">
                                            <Shield size={32} className="opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">Queue Is Empty</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Underwriting Policy Card - Compact */}
            <div className="bg-[#11243f] rounded-lg p-4 text-sm border border-orange-500/10">
                <h3 className="text-orange-400 text-sm font-semibold uppercase tracking-widest flex items-center gap-2">
                    <AlertTriangle size={16} />
                    Underwriting Policy
                </h3>
                <p className="text-xs mt-2 text-slate-400 leading-relaxed">
                    Authorized personnel must verify that the applicant's KYC status is <strong className="text-white">VERIFIED</strong> before issuing any policy. Issuing insurance to unverified entities violates compliance standards and is recorded for audit purposes.
                </p>
            </div>

            {/* Modal */}
            {selectedPolicy && (
                <PolicyReviewModal
                    policy={selectedPolicy}
                    onClose={() => setSelectedPolicy(null)}
                    onApprove={handleApprove}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default UnderwritingQueue;
