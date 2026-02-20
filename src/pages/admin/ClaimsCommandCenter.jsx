import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    FileText,
    AlertCircle,
    CheckCircle2,
    Clock,
    XCircle,
    Eye
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import ClaimReviewModal from '../../components/admin/ClaimReviewModal';

// Simple debounce utility
const debounce = (func, wait) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

const CLAIM_STATUS_MAP = {
    PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20', icon: Clock },
    UNDER_REVIEW: { label: 'Under Review', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/20', icon: FileText },
    APPROVED: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/20', icon: CheckCircle2 },
    REJECTED: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/20', icon: XCircle },
    SETTLED: { label: 'Settled', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20', icon: CheckCircle2 },
};

const ClaimsCommandCenter = () => {
    const [loading, setLoading] = useState(true);
    const [claims, setClaims] = useState([]);
    const [stats, setStats] = useState({ total: 0, pages: 1 });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        status: '',
        search: ''
    });

    const [selectedClaim, setSelectedClaim] = useState(null);

    // Optimistic update: reflect status change in table without full refetch
    const handleStatusUpdated = (claimId, newStatus) => {
        setClaims(prev => prev.map(c =>
            c._id === claimId ? { ...c, status: newStatus } : c
        ));
        // Also update the selected claim so the modal reflects the new state
        setSelectedClaim(prev => prev?._id === claimId ? { ...prev, status: newStatus } : prev);
    };

    const fetchClaims = async () => {
        setLoading(true);
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                ...(filters.status && { status: filters.status }),
                ...(filters.search && { search: filters.search })
            };
            const response = await adminService.getAllClaims(params);
            setClaims(response.data?.claims || response.claims || []);
            setStats({
                total: response.data?.total || response.total || 0,
                pages: response.data?.pages || response.pages || 1
            });
        } catch (error) {
            console.error('Claims Fetch Error:', error);
            toast.error('Failed to load claims database');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClaims();
    }, [filters.page, filters.status, filters.search]);

    const debouncedSearch = useCallback(
        debounce((val) => {
            setFilters(prev => ({ ...prev, search: val, page: 1 }));
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const StatusBadge = ({ status }) => {
        const config = CLAIM_STATUS_MAP[status] || CLAIM_STATUS_MAP.PENDING;
        const Icon = config.icon;
        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider ${config.bg} ${config.color} ${config.border}`}>
                <Icon size={10} />
                {config.label}
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Claims Command Center
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30 font-mono">
                            LIVE OPS
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">Operational Financial Control Hub</p>
                </div>

                <button
                    onClick={fetchClaims}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all active:scale-95"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh Feed
                </button>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#162031] border border-slate-800 p-4 rounded-3xl shadow-xl">
                <div className="lg:col-span-5 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID, Policy, or Email..."
                        onChange={handleSearchChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all"
                    />
                </div>

                <div className="lg:col-span-4 flex items-center gap-2 px-2">
                    <Filter className="text-slate-500" size={16} />
                    <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar">
                        {['', 'PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((s) => (
                            <button
                                key={s}
                                onClick={() => setFilters(prev => ({ ...prev, status: s, page: 1 }))}
                                className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all whitespace-nowrap border ${filters.status === s
                                    ? 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-500/20'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {s || 'ALL CLAIMS'}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">
                        Displaying {claims.length} of {stats.total} Records
                    </p>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-[#162031] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Claim Reference</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Policyholder</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Claim Amount</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6"><div className="h-10 bg-slate-800/50 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : claims.length > 0 ? (
                                claims.map((claim) => (
                                    <tr key={claim._id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-200 font-mono text-xs uppercase tracking-tight">#{claim._id.slice(-8).toUpperCase()}</span>
                                                <span className="text-[10px] text-slate-500 font-bold mt-1 uppercase">Policy: {claim.policy?.policyNumber || 'N/A'}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-slate-300 uppercase">{claim.user?.name}</span>
                                                <span className="text-xs text-slate-500">{claim.user?.email}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white">₹{claim.amount?.toLocaleString()}</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter">Type: {claim.claimType}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <StatusBadge status={claim.status} />
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedClaim(claim)}
                                                className="p-2.5 bg-blue-600/10 hover:bg-blue-600 text-blue-400 hover:text-white rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
                                                title="View Details"
                                            >
                                                <Eye size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-600 space-y-4">
                                            <FileText size={48} className="opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No matching claims found</p>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="p-6 bg-slate-900/30 border-t border-slate-800 flex items-center justify-between">
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                        Page {filters.page} of {stats.pages}
                    </div>
                    <div className="flex gap-2">
                        <button
                            disabled={filters.page === 1}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                        >
                            <ChevronLeft size={18} />
                        </button>
                        <button
                            disabled={filters.page === stats.pages}
                            onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                            className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 hover:text-white disabled:opacity-30 disabled:hover:text-slate-400 transition-all"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                </div>
            </div>

            {/* Compliance Footer */}
            <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-3xl flex items-start gap-3 shrink-0">
                <AlertCircle className="text-blue-500 shrink-0" size={20} />
                <div className="space-y-0.5">
                    <h5 className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">Administrative Protocol</h5>
                    <p className="text-[10px] text-slate-500 leading-relaxed font-medium">
                        All claim status transitions (APPROVED/REJECTED) are permanent and trigger automated financial disbursements or system-wide audit logs. Ensure all user-uploaded evidence is reviewed before final state updates.
                    </p>
                </div>
            </div>

            {/* Modal */}
            {selectedClaim && (
                <ClaimReviewModal
                    claim={selectedClaim}
                    onClose={() => setSelectedClaim(null)}
                    onStatusUpdated={handleStatusUpdated}
                />
            )}
        </div>
    );
};

export default ClaimsCommandCenter;
