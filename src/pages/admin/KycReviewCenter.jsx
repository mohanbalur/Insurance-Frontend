import React, { useState, useEffect } from 'react';
import {
    Search,
    Filter,
    UserCheck,
    Clock,
    XCircle,
    RefreshCw,
    AlertCircle,
    ChevronRight,
    Users
} from 'lucide-react';
import adminService from '../../services/adminService';
import KycDetailsModal from '../../components/admin/KycDetailsModal';
import toast from 'react-hot-toast';

const KycReviewCenter = () => {
    const [loading, setLoading] = useState(true);
    const [submissions, setSubmissions] = useState([]);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });
    const [filter, setFilter] = useState('PENDING_VERIFICATION'); // PENDING_VERIFICATION, VERIFIED, REJECTED
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedUser, setSelectedUser] = useState(null);
    const [stats, setStats] = useState({ pending: 0 });

    useEffect(() => {
        fetchSubmissions();
        // Also fetch summary for stats (we can reuse the pending count from list or separate call)
    }, [filter, pagination.page]);

    const fetchSubmissions = async () => {
        setLoading(true);
        try {
            // Note: API expects 'status' query param if we want to filter beyond pending
            const response = await adminService.getPendingKYC(pagination.page, 10, filter);
            const data = response.data || {};
            setSubmissions(data.users || []);
            setPagination({
                page: data.page || 1,
                pages: data.pages || 1,
                total: data.total || 0
            });

            if (filter === 'PENDING_VERIFICATION') {
                setStats({ pending: data.total || 0 });
            }
        } catch (error) {
            console.error('KYC Fetch Error:', error);
            toast.error('Failed to load KYC submissions');
        } finally {
            setLoading(false);
        }
    };

    const handleVerify = async (userId) => {
        try {
            await adminService.verifyKYC(userId);
            toast.success('KYC Verified Successfully');
            fetchSubmissions(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
        }
    };

    const handleReject = async (userId, reason) => {
        try {
            await adminService.rejectKYC(userId, reason);
            toast.success('KYC Rejected Successfully');
            fetchSubmissions(); // Refresh list
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        }
    };

    const getStatusStyle = (status) => {
        switch (status) {
            case 'VERIFIED': return 'bg-green-500/10 text-green-400 border-green-500/20';
            case 'REJECTED': return 'bg-red-500/10 text-red-400 border-red-500/20';
            default: return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        }
    };

    const filteredSubmissions = submissions.filter(s =>
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Header Area */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        KYC Review Center
                        {stats.pending > 0 && (
                            <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 animate-pulse">
                                {stats.pending} ACTION REQUIRED
                            </span>
                        )}
                    </h1>
                    <p className="text-slate-400 mt-1">Verify user identities and legal documentation.</p>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => fetchSubmissions()}
                        className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl border border-slate-700 transition-all active:scale-95"
                        title="Refresh Submissions"
                    >
                        <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
                    </button>
                    <div className="flex bg-slate-900/50 border border-slate-800 p-1 rounded-xl">
                        {[
                            { id: 'PENDING_VERIFICATION', label: 'Pending', icon: Clock },
                            { id: 'VERIFIED', label: 'Verified', icon: UserCheck },
                            { id: 'REJECTED', label: 'Rejected', icon: XCircle },
                        ].map((btn) => (
                            <button
                                key={btn.id}
                                onClick={() => { setFilter(btn.id); setPagination(p => ({ ...p, page: 1 })); }}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold transition-all ${filter === btn.id
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/20'
                                    : 'text-slate-500 hover:text-slate-300 hover:bg-slate-800'
                                    }`}
                            >
                                <btn.icon size={14} />
                                {btn.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Search and Quick Filters */}
            <div className="bg-[#162031] border border-slate-800 rounded-2xl p-4 flex flex-col md:flex-row gap-4 items-center shadow-xl">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or user ID..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#0f172a] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all"
                    />
                </div>
                <div className="flex items-center gap-2 text-slate-500 px-2 cursor-default">
                    <Filter size={16} />
                    <span className="text-xs font-bold uppercase tracking-widest whitespace-nowrap">Status Sort Active</span>
                </div>
            </div>

            {/* Submissions Table */}
            <div className="bg-[#162031] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">User Profile</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Contact Information</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Submitted Date</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6">
                                            <div className="h-10 bg-slate-800/50 rounded-xl" />
                                        </td>
                                    </tr>
                                ))
                            ) : filteredSubmissions.length > 0 ? (
                                filteredSubmissions.map((user) => (
                                    <tr key={user._id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center border border-slate-700 font-bold text-slate-300 text-sm">
                                                    {user.name.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-slate-200 group-hover:text-white transition-colors uppercase tracking-tight">{user.name}</p>
                                                    <p className="text-[10px] text-slate-500 font-mono mt-0.5">ID: {user._id.slice(-8).toUpperCase()}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-sm text-slate-400 font-medium">{user.email}</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-sm text-slate-500">
                                            {user.updatedAt ? new Date(user.updatedAt).toLocaleDateString(undefined, {
                                                year: 'numeric', month: 'short', day: 'numeric'
                                            }) : 'N/A'}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className={`px-3 py-1 rounded-full text-[10px] font-bold border uppercase tracking-widest ${getStatusStyle(user.kycStatus)}`}>
                                                {user.kycStatus?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedUser(user)}
                                                className="px-4 py-2 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/20 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ml-auto"
                                            >
                                                Review Details
                                                <ChevronRight size={14} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-600 space-y-4">
                                            <div className="p-6 bg-slate-900/30 rounded-full border border-slate-800 flex items-center justify-center">
                                                <Users size={48} className="opacity-20" />
                                            </div>
                                            <div>
                                                <p className="text-lg font-bold text-slate-500 uppercase tracking-widest">No Submissions Found</p>
                                                <p className="text-xs max-w-xs mx-auto mt-2 leading-relaxed">
                                                    It looks like there are no KYC applications matching your current filter. Check back later or try adjusting your search.
                                                </p>
                                            </div>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="p-6 border-t border-slate-800 bg-slate-900/30 flex justify-between items-center">
                        <p className="text-xs text-slate-500 font-medium uppercase tracking-widest">
                            Showing page {pagination.page} of {pagination.pages}
                        </p>
                        <div className="flex gap-2">
                            <button
                                disabled={pagination.page === 1}
                                onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold border border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                Previous
                            </button>
                            <button
                                disabled={pagination.page === pagination.pages}
                                onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}
                                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-lg text-xs font-bold border border-slate-700 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Modal */}
            {selectedUser && (
                <KycDetailsModal
                    user={selectedUser}
                    onClose={() => setSelectedUser(null)}
                    onVerify={handleVerify}
                    onReject={handleReject}
                />
            )}
        </div>
    );
};

export default KycReviewCenter;
