import React, { useState, useEffect } from 'react';
import {
    Search,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    History,
    FileText,
    Shield,
    Eye,
    ChevronDown,
    ChevronUp,
    Database,
    User,
    Calendar,
    Code
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AuditLogViewer = () => {
    const [loading, setLoading] = useState(true);
    const [logs, setLogs] = useState([]);
    const [stats, setStats] = useState({ total: 0, pages: 1 });
    const [expandedLog, setExpandedLog] = useState(null);
    const [filters, setFilters] = useState({
        page: 1,
        limit: 20,
        action: '',
        resourceType: ''
    });

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                ...(filters.action && { action: filters.action }),
                ...(filters.resourceType && { resourceType: filters.resourceType })
            };
            const response = await adminService.getAuditLogs(params);
            setLogs(response.data?.logs || response.logs || []);
            setStats({
                total: response.data?.total || response.total || 0,
                pages: response.data?.pages || response.pages || 1
            });
        } catch (error) {
            console.error('Audit Logs Fetch Error:', error);
            toast.error('Failed to load audit trail');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, [filters.page, filters.action, filters.resourceType]);

    const toggleExpand = (id) => {
        setExpandedLog(expandedLog === id ? null : id);
    };

    const ActionBadge = ({ action }) => {
        let color = 'text-slate-400 bg-slate-800 border-slate-700';

        if (action.includes('APPROVE') || action.includes('VERIFIED')) {
            color = 'text-green-400 bg-green-500/10 border-green-500/20';
        } else if (action.includes('REJECT') || action.includes('DENIED')) {
            color = 'text-red-400 bg-red-500/10 border-red-500/20';
        } else if (action.includes('UPDATE') || action.includes('EDIT')) {
            color = 'text-blue-400 bg-blue-500/10 border-blue-500/20';
        } else if (action.includes('CREATE') || action.includes('SUBMIT')) {
            color = 'text-purple-400 bg-purple-500/10 border-purple-500/20';
        } else if (action.includes('LOGIN')) {
            color = 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20';
        }

        return (
            <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider w-fit ${color}`}>
                <Shield size={10} />
                {action.replace(/_/g, ' ')}
            </span>
        );
    };

    const ChangesDiff = ({ changes }) => {
        if (!changes || (!changes.before && !changes.after)) return <p className="text-slate-500 text-sm italic">No data changes recorded</p>;

        return (
            <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-slate-950 rounded-xl p-4 border border-red-500/10 overflow-hidden">
                    <h5 className="text-[10px] font-bold text-red-400 uppercase tracking-widest mb-2 border-b border-red-500/10 pb-2">Before</h5>
                    <pre className="text-xs text-red-300 font-mono overflow-auto max-h-40 whitespace-pre-wrap">
                        {JSON.stringify(changes.before, null, 2)}
                    </pre>
                </div>
                <div className="bg-slate-950 rounded-xl p-4 border border-green-500/10 overflow-hidden">
                    <h5 className="text-[10px] font-bold text-green-400 uppercase tracking-widest mb-2 border-b border-green-500/10 pb-2">After</h5>
                    <pre className="text-xs text-green-300 font-mono overflow-auto max-h-40 whitespace-pre-wrap">
                        {JSON.stringify(changes.after, null, 2)}
                    </pre>
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Audit Log Viewer
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-xs rounded-full border border-indigo-500/30 font-mono">
                            {stats.total} EVENTS
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">Compliance & Security Trail</p>
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={fetchLogs}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all active:scale-95"
                    >
                        <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                        Refresh
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all">
                        <FileText size={16} />
                        Export
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 p-4 bg-[#162031] border border-slate-800 rounded-3xl shadow-xl">
                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        <Filter size={16} />
                    </div>
                    <select
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/40 outline-none appearance-none"
                        value={filters.action}
                        onChange={(e) => setFilters(prev => ({ ...prev, action: e.target.value, page: 1 }))}
                    >
                        <option value="">All Actions</option>
                        <option value="LOGIN_SUCCESS">Login Success</option>
                        <option value="KYC_VERIFIED">KYC Verified</option>
                        <option value="KYC_REJECTED">KYC Rejected</option>
                        <option value="POLICY_PURCHASED">Policy Purchased</option>
                        <option value="POLICY_APPROVED">Policy Approved</option>
                        <option value="POLICY_REJECTED">Policy Rejected</option>
                        <option value="CLAIM_FILE">Claim Filed</option>
                        <option value="CLAIM_APPROVED">Claim Approved</option>
                        <option value="CLAIM_REJECTED">Claim Rejected</option>
                        <option value="AGENT_APPLY">Agent Applied</option>
                        <option value="AGENT_APPROVED">Agent Approved</option>
                    </select>
                </div>

                <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500">
                        <Database size={16} />
                    </div>
                    <select
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-slate-200 focus:ring-2 focus:ring-indigo-500/40 outline-none appearance-none"
                        value={filters.resourceType}
                        onChange={(e) => setFilters(prev => ({ ...prev, resourceType: e.target.value, page: 1 }))}
                    >
                        <option value="">All Resources</option>
                        <option value="User">User</option>
                        <option value="Policy">Policy</option>
                        <option value="Claim">Claim</option>
                        <option value="Agent">Agent</option>
                    </select>
                </div>
            </div>

            {/* Timeline Table */}
            <div className="bg-[#162031] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Timestamp</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Action</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Actor</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Resource</th>
                                <th className="px-6 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Details</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                Array(5).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-6 py-6"><div className="h-8 bg-slate-800/50 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : logs.length > 0 ? (
                                logs.map((log) => (
                                    <React.Fragment key={log._id}>
                                        <tr
                                            onClick={() => toggleExpand(log._id)}
                                            className={`hover:bg-slate-800/30 transition-colors cursor-pointer group ${expandedLog === log._id ? 'bg-slate-800/20' : ''}`}
                                        >
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-300 font-mono">
                                                        {new Date(log.timestamp).toLocaleTimeString()}
                                                    </span>
                                                    <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">
                                                        {new Date(log.timestamp).toLocaleDateString()}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <ActionBadge action={log.action} />
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-slate-800 flex items-center justify-center text-[10px] font-bold text-slate-500 border border-slate-700">
                                                        {log.performedBy?.role === 'ADMIN' ? 'A' : 'U'}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-300">{log.performedBy?.name || 'System'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap">
                                                <span className="text-xs font-mono text-slate-400 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                                                    {log.targetResource?.resourceType}
                                                    <span className="opacity-50 mx-1">•</span>
                                                    {log.targetResource?.resourceId?.slice(-6)}
                                                </span>
                                            </td>
                                            <td className="px-6 py-5 whitespace-nowrap text-right">
                                                <button className="text-slate-500 hover:text-indigo-400 transition-colors">
                                                    {expandedLog === log._id ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                </button>
                                            </td>
                                        </tr>

                                        {/* Expanded Details */}
                                        {expandedLog === log._id && (
                                            <tr className="bg-slate-900/40 shadow-inner">
                                                <td colSpan="5" className="px-6 py-6">
                                                    <div className="ml-12 border-l-2 border-slate-700 pl-6 space-y-4">
                                                        {/* Metadata Row */}
                                                        <div className="grid grid-cols-3 gap-6">
                                                            <div>
                                                                <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">IP Address</h6>
                                                                <p className="text-xs font-mono text-slate-300">{log.metadata?.ipAddress || 'Unknown'}</p>
                                                            </div>
                                                            <div>
                                                                <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Session Agent</h6>
                                                                <p className="text-xs text-slate-300 truncate w-48" title={log.metadata?.userAgent}>
                                                                    {log.metadata?.userAgent || 'Unknown'}
                                                                </p>
                                                            </div>
                                                            {log.metadata?.reason && (
                                                                <div>
                                                                    <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Reason/Notes</h6>
                                                                    <p className="text-xs text-amber-200 bg-amber-500/10 px-2 py-1 rounded border border-amber-500/20 w-fit">
                                                                        {log.metadata.reason}
                                                                    </p>
                                                                </div>
                                                            )}
                                                            {log.metadata?.notes && (
                                                                <div>
                                                                    <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Admin Notes</h6>
                                                                    <p className="text-xs text-blue-200 bg-blue-500/10 px-2 py-1 rounded border border-blue-500/20 w-fit">
                                                                        {log.metadata.notes}
                                                                    </p>
                                                                </div>
                                                            )}
                                                        </div>

                                                        {/* JSON Diff */}
                                                        <div>
                                                            <div className="flex items-center gap-2 mb-2">
                                                                <Code size={14} className="text-indigo-400" />
                                                                <h6 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">State Changes Log</h6>
                                                            </div>
                                                            <ChangesDiff changes={log.changes} />
                                                        </div>
                                                    </div>
                                                </td>
                                            </tr>
                                        )}
                                    </React.Fragment>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-6 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-600 space-y-4">
                                            <History size={48} className="opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No audit events found</p>
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
        </div>
    );
};

export default AuditLogViewer;
