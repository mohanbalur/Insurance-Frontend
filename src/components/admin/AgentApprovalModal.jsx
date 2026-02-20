import React, { useState } from 'react';
import {
    X,
    ShieldCheck,
    AlertCircle,
    User,
    Briefcase,
    TrendingUp,
    Calendar,
    CheckCircle2,
    Loader2
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const AgentApprovalModal = ({ agent, onClose, onAgentUpdated }) => {
    const [confirming, setConfirming] = useState(false);
    const [processing, setProcessing] = useState(false);

    if (!agent) return null;

    const handleApprove = async () => {
        setProcessing(true);
        try {
            await adminService.approveAgent(agent._id);
            toast.success(`Agent ${agent.user?.name} approved successfully`);

            // Optimistic update
            if (onAgentUpdated) {
                onAgentUpdated(agent._id, { isApproved: true });
            }
            onClose();
        } catch (error) {
            console.error('Approval Error:', error);
            toast.error(error?.response?.data?.message || 'Failed to approve agent');
            setConfirming(false); // Reset confirmation if failed
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#162031] border border-slate-800 rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl scale-in-center">

                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                            <ShieldCheck size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Agent Review</h2>
                            <p className="text-xs text-slate-400 font-mono mt-0.5">ID: {agent._id}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Body */}
                <div className="p-8 space-y-8">

                    {/* Profile Section */}
                    <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-500 text-2xl font-bold">
                            {agent.user?.name?.charAt(0) || <User size={32} />}
                        </div>
                        <div className="flex-1 space-y-4">
                            <div>
                                <h3 className="text-lg font-bold text-white">{agent.user?.name}</h3>
                                <p className="text-slate-400 text-sm">{agent.user?.email}</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Joined</span>
                                    <span className="text-sm font-bold text-slate-300 flex items-center gap-2">
                                        <Calendar size={14} className="text-purple-400" />
                                        {new Date(agent.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="bg-slate-900/50 border border-slate-800 rounded-xl px-4 py-2">
                                    <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Commission Rate</span>
                                    <span className="text-sm font-bold text-emerald-400">{agent.commissionRate}%</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Metrics Section */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 bg-blue-500/10 text-blue-400 rounded-lg">
                                    <Briefcase size={16} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Policies Sold</span>
                            </div>
                            <p className="text-2xl font-bold text-white">{agent.totalPoliciesSold}</p>
                        </div>
                        <div className="p-5 bg-slate-900/30 border border-slate-800 rounded-2xl">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg">
                                    <TrendingUp size={16} />
                                </div>
                                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Commission Earned</span>
                            </div>
                            <p className="text-2xl font-bold text-emerald-400">₹{agent.totalCommission?.toLocaleString()}</p>
                        </div>
                    </div>

                    {/* Action Section */}
                    <div className="pt-4 border-t border-slate-800">
                        {agent.isApproved ? (
                            <div className="flex items-center gap-3 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-400">
                                <CheckCircle2 size={24} />
                                <div>
                                    <p className="font-bold text-sm uppercase tracking-wide">Agent Verified</p>
                                    <p className="text-xs opacity-80">This agent has full sales access.</p>
                                </div>
                            </div>
                        ) : confirming ? (
                            <div className="bg-amber-500/10 border border-amber-500/20 rounded-2xl p-6 space-y-4 animate-in fade-in slide-in-from-bottom-2">
                                <div className="flex items-center gap-3 text-amber-400">
                                    <AlertCircle size={24} />
                                    <h4 className="font-bold uppercase tracking-wide text-sm">Confirm Approval</h4>
                                </div>
                                <p className="text-sm text-slate-300 leading-relaxed">
                                    Are you sure you want to approve <strong>{agent.user?.name}</strong>?
                                    This will grant them immediate access to sell policies and earn commissions.
                                    This action is audit-logged.
                                </p>
                                <div className="flex gap-3 pt-2">
                                    <button
                                        onClick={() => setConfirming(false)}
                                        disabled={processing}
                                        className="flex-1 py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm transition-all"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleApprove}
                                        disabled={processing}
                                        className="flex-[2] py-3 bg-gradient-to-r from-emerald-600 to-green-600 hover:from-emerald-500 hover:to-green-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
                                    >
                                        {processing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle2 size={18} />}
                                        {processing ? 'Authorizing...' : 'Confirm Authorization'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setConfirming(true)}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2"
                            >
                                <ShieldCheck size={18} />
                                Review & Approve Agent
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AgentApprovalModal;
