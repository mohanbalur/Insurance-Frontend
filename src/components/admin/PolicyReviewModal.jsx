import React, { useState } from 'react';
import {
    X,
    CheckCircle,
    XCircle,
    Shield,
    User,
    CreditCard,
    Info,
    AlertCircle,
    FileText,
    Activity,
    Calendar
} from 'lucide-react';
import toast from 'react-hot-toast';

const PolicyReviewModal = ({ policy, onClose, onApprove, onReject }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [riskNotes, setRiskNotes] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);
    const [processing, setProcessing] = useState(false);

    if (!policy) return null;

    const handleApprove = async () => {
        setProcessing(true);
        try {
            await onApprove(policy._id, riskNotes);
            toast.success('Policy Activated Successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Activation failed');
        } finally {
            setProcessing(false);
        }
    };

    const handleReject = async () => {
        if (!rejectionReason.trim()) {
            toast.error('Please provide a reason for rejection');
            return;
        }
        setProcessing(true);
        try {
            await onReject(policy._id, rejectionReason);
            toast.success('Policy Application Rejected');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        } finally {
            setProcessing(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#162031] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                            <Shield size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">Policy Underwriting</h2>
                            <p className="text-xs text-slate-400 font-mono">Reference: {policy.policyNumber || policy._id.toUpperCase()}</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-8 space-y-8">
                    {/* User & KYC Status Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <User size={14} /> Applicant Data
                            </h3>
                            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Name</span>
                                    <span className="text-slate-200 font-bold uppercase">{policy.user?.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Email</span>
                                    <span className="text-slate-200 font-bold">{policy.user?.email}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">KYC Status</span>
                                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${policy.user?.kycStatus === 'VERIFIED' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'
                                        }`}>
                                        {policy.user?.kycStatus}
                                    </span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <Activity size={14} /> Plan Details
                            </h3>
                            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Plan Name</span>
                                    <span className="text-[#1E90FF] font-bold">{policy.plan?.name}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Premium Amount</span>
                                    <span className="text-white font-bold">₹{policy.premiumAmount?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium font-medium flex items-center gap-2">
                                        <Shield size={14} /> Coverage
                                    </span>
                                    <span className="text-white font-bold">₹{policy.coverageAmount?.toLocaleString()}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Timeline / Additional Info */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <Calendar size={14} /> Policy Configuration
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="p-4 bg-slate-900/20 border border-slate-800/50 rounded-xl space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">Start Date</span>
                                <p className="text-sm text-slate-300 font-medium">{new Date(policy.startDate).toLocaleDateString()}</p>
                            </div>
                            <div className="p-4 bg-slate-900/20 border border-slate-800/50 rounded-xl space-y-1">
                                <span className="text-[10px] text-slate-500 uppercase font-bold">End Date (Maturity)</span>
                                <p className="text-sm text-slate-300 font-medium">{new Date(policy.endDate).toLocaleDateString()}</p>
                            </div>
                        </div>
                    </section>

                    {/* Underwriting Controls */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                            <FileText size={14} /> Underwriting Assessment
                        </h3>
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confidential Risk Notes (Optional)</label>
                            <textarea
                                value={riskNotes}
                                onChange={(e) => setRiskNotes(e.target.value)}
                                placeholder="Add observations about risk factors, KYC validity, or special terms..."
                                className="w-full bg-[#0f172a] border border-slate-700 rounded-2xl p-4 text-slate-200 text-sm focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none min-h-[120px] transition-all"
                            />
                        </div>
                    </section>

                    {/* Audit Info */}
                    <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <Info className="text-blue-400" size={18} />
                        <p className="text-[11px] text-slate-400 leading-tight">
                            <span className="text-blue-400 font-bold uppercase mr-1">Compliance Check:</span>
                            Activation signifies that the system has received payment and the administrator has verified the risk parameters. This action is immutable and logged.
                        </p>
                    </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 border-t border-slate-800 bg-slate-900/50">
                    {!showRejectionInput ? (
                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowRejectionInput(true)}
                                className="flex-1 px-6 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 rounded-xl font-bold text-sm transition-all flex items-center justify-center gap-2"
                            >
                                <XCircle size={18} />
                                Reject Issuance
                            </button>
                            <button
                                onClick={handleApprove}
                                disabled={processing || policy.user?.kycStatus !== 'VERIFIED'}
                                className={`flex-[2] px-6 py-3 text-white rounded-xl font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 ${policy.user?.kycStatus === 'VERIFIED'
                                        ? 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 shadow-blue-500/20'
                                        : 'bg-slate-700 cursor-not-allowed shadow-none'
                                    }`}
                            >
                                <CheckCircle size={18} />
                                {processing ? 'Initializing...' : policy.user?.kycStatus !== 'VERIFIED' ? 'Pending User KYC' : 'Issue & Activate Policy'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rejection Reason</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Explain why this policy issuance cannot proceed (e.g. Invalid payment verification, Fraudulent documents)..."
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 text-slate-200 text-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none min-h-[100px] transition-all"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowRejectionInput(false)}
                                    className="flex-1 px-4 py-2 text-slate-400 hover:text-white font-medium text-sm transition-colors"
                                >
                                    Go Back
                                </button>
                                <button
                                    onClick={handleReject}
                                    disabled={processing}
                                    className="flex-[2] px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-sm shadow-lg shadow-red-500/20 transition-all disabled:opacity-50"
                                >
                                    {processing ? 'Processing...' : 'Confirm Rejection'}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PolicyReviewModal;
