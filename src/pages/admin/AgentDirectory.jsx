import React, { useState, useEffect, useCallback } from 'react';
import {
    Search,
    RefreshCw,
    Filter,
    ChevronLeft,
    ChevronRight,
    Users,
    ShieldCheck,
    Briefcase,
    TrendingUp,
    AlertCircle,
    MoreHorizontal,
    Shield
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';
import AgentApprovalModal from '../../components/admin/AgentApprovalModal';

// Simple debounce utility to avoid external dependency issues
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

const AgentDirectory = () => {
    const [loading, setLoading] = useState(true);
    const [agents, setAgents] = useState([]);
    const [stats, setStats] = useState({ total: 0, pages: 1 });
    const [filters, setFilters] = useState({
        page: 1,
        limit: 10,
        isApproved: '', // '' | 'true' | 'false'
        search: ''
    });
    const [selectedAgent, setSelectedAgent] = useState(null);

    const handleAgentUpdated = (agentId, updates) => {
        setAgents(prev => prev.map(a =>
            a._id === agentId ? { ...a, ...updates } : a
        ));
        if (selectedAgent?._id === agentId) {
            setSelectedAgent(prev => ({ ...prev, ...updates }));
        }
    };

    const fetchAgents = async () => {
        setLoading(true);
        try {
            const params = {
                page: filters.page,
                limit: filters.limit,
                ...(filters.isApproved !== '' && { isApproved: filters.isApproved }),
                ...(filters.search && { search: filters.search })
            };
            const response = await adminService.getAllAgents(params);
            setAgents(response.data?.agents || response.agents || []);
            setStats({
                total: response.data?.total || response.total || 0,
                pages: response.data?.pages || response.pages || 1
            });
        } catch (error) {
            console.error('Agents Fetch Error:', error);
            toast.error('Failed to load agent directory');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAgents();
    }, [filters.page, filters.isApproved, filters.search]);

    const debouncedSearch = useCallback(
        debounce((val) => {
            setFilters(prev => ({ ...prev, search: val, page: 1 }));
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        debouncedSearch(e.target.value);
    };

    const StatusBadge = ({ isApproved }) => {
        if (isApproved) {
            return (
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider bg-green-400/10 text-green-400 border-green-400/20">
                    <ShieldCheck size={10} />
                    Verified Agent
                </span>
            );
        }
        return (
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1.5 uppercase tracking-wider bg-amber-400/10 text-amber-400 border-amber-400/20">
                <AlertCircle size={10} />
                Pending Approval
            </span>
        );
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Agent Directory
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30 font-mono">
                            {stats.total} TOTAL
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-1 uppercase text-[10px] font-bold tracking-[0.2em]">Sales Force Management</p>
                </div>

                <button
                    onClick={fetchAgents}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-sm font-bold rounded-xl border border-slate-700 transition-all active:scale-95"
                >
                    <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
                    Refresh List
                </button>
            </div>

            {/* Filters Bar */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center bg-[#162031] border border-slate-800 p-4 rounded-3xl shadow-xl">
                <div className="lg:col-span-5 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search by Name or Email..."
                        onChange={handleSearchChange}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-3 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-purple-500/40 focus:border-purple-500 outline-none transition-all"
                    />
                </div>

                <div className="lg:col-span-4 flex items-center gap-2 px-2">
                    <Filter className="text-slate-500" size={16} />
                    <div className="flex gap-1">
                        {[
                            { label: 'All Agents', value: '' },
                            { label: 'Pending', value: 'false' },
                            { label: 'Approved', value: 'true' }
                        ].map((opt) => (
                            <button
                                key={opt.value}
                                onClick={() => setFilters(prev => ({ ...prev, isApproved: opt.value, page: 1 }))}
                                className={`px-4 py-1.5 rounded-xl text-[10px] font-bold uppercase transition-all border ${filters.isApproved === opt.value
                                    ? 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                                    : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
                                    }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-3 text-right">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mr-2">
                        Page {filters.page} of {stats.pages}
                    </p>
                </div>
            </div>

            {/* Main Table */}
            <div className="bg-[#162031] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Agent Profile</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Performance</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Commission</th>
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
                            ) : agents.length > 0 ? (
                                agents.map((agent) => (
                                    <tr key={agent._id} className="hover:bg-slate-800/30 transition-colors group">
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-bold border border-slate-700">
                                                    {agent.user?.name?.charAt(0) || 'A'}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-sm font-bold text-slate-200">{agent.user?.name}</span>
                                                    <span className="text-xs text-slate-500">{agent.user?.email}</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-white flex items-center gap-2">
                                                    <Briefcase size={14} className="text-slate-500" />
                                                    {agent.totalPoliciesSold} Policies
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Joined: {new Date(agent.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-emerald-400 flex items-center gap-2">
                                                    <TrendingUp size={14} />
                                                    ₹{agent.totalCommission?.toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">Rate: {agent.commissionRate}%</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <StatusBadge isApproved={agent.isApproved} />
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <button
                                                onClick={() => setSelectedAgent(agent)}
                                                className="p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white rounded-xl transition-all border border-slate-700 hover:border-slate-600 shadow-sm"
                                                title="Review Agent"
                                            >
                                                <MoreHorizontal size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center">
                                        <div className="flex flex-col items-center justify-center text-slate-600 space-y-4">
                                            <Users size={48} className="opacity-20" />
                                            <p className="text-sm font-bold uppercase tracking-widest text-slate-500">No agents found</p>
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
            {selectedAgent && (
                <AgentApprovalModal
                    agent={selectedAgent}
                    onClose={() => setSelectedAgent(null)}
                    onAgentUpdated={handleAgentUpdated}
                />
            )}
        </div>
    );
};

export default AgentDirectory;
