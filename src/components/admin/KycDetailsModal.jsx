import React, { useState } from 'react';
import {
    X,
    CheckCircle,
    XCircle,
    Calendar,
    User,
    CreditCard,
    ExternalLink,
    AlertTriangle,
    FileText
} from 'lucide-react';
import toast from 'react-hot-toast';

const KycDetailsModal = ({ user, onClose, onVerify, onReject }) => {
    const [rejectionReason, setRejectionReason] = useState('');
    const [showRejectionInput, setShowRejectionInput] = useState(false);
    const [processing, setProcessing] = useState(false);

    if (!user) return null;

    const handleVerify = async () => {
        setProcessing(true);
        try {
            await onVerify(user._id);
            toast.success('KYC Verified Successfully');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Verification failed');
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
            await onReject(user._id, rejectionReason);
            toast.success('KYC Rejected');
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Rejection failed');
        } finally {
            setProcessing(false);
        }
    };

    const getDocLabel = (type) => {
        switch (type) {
            case 'AADHAAR': return 'Aadhaar Card';
            case 'PAN': return 'PAN Card';
            case 'BANK_PROOF': return 'Bank Proof';
            default: return type;
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#162031] border border-slate-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col scale-in-center">
                {/* Header */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
                    <div className="flex items-center space-x-3">
                        <div className="p-2 bg-blue-500/20 rounded-xl text-blue-400">
                            <User size={24} />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white uppercase tracking-tight">{user.name}</h2>
                            <p className="text-xs text-slate-400 font-mono">UID: {user._id}</p>
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
                    {/* User Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <FileText size={14} /> Basic Information
                            </h3>
                            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Email</span>
                                    <span className="text-slate-200 font-bold">{user.email}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium font-medium flex items-center gap-2">
                                        <Calendar size={14} /> Date of Birth
                                    </span>
                                    <span className="text-slate-200 font-bold">{user.dob ? new Date(user.dob).toLocaleDateString() : 'N/A'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Gender</span>
                                    <span className="text-slate-200 font-bold">{user.gender}</span>
                                </div>
                            </div>
                        </section>

                        <section className="space-y-4">
                            <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                                <CreditCard size={14} /> Sensitive Identification
                            </h3>
                            <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-5 space-y-4">
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Aadhaar (Decrypted)</span>
                                    <span className="text-blue-400 font-mono font-bold tracking-wider">{user.aadhaarNumberDecrypted || '********'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">PAN (Decrypted)</span>
                                    <span className="text-blue-400 font-mono font-bold tracking-wider">{user.panNumberDecrypted || '********'}</span>
                                </div>
                                <div className="flex justify-between items-center text-sm">
                                    <span className="text-slate-500 font-medium">Bank A/C (Decrypted)</span>
                                    <span className="text-blue-400 font-mono font-bold tracking-wider">{user.bankDetails?.accountNumberDecrypted || '********'}</span>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Documents View */}
                    <section className="space-y-4">
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest">Verification Documents</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {(user.kycDocuments || []).map((doc, idx) => (
                                <div key={idx} className="group relative bg-[#0f172a] border border-slate-800 rounded-2xl overflow-hidden shadow-lg transition-transform hover:scale-[1.02]">
                                    <div className="p-3 bg-slate-900/80 border-b border-slate-800 flex justify-between items-center">
                                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{getDocLabel(doc.type)}</span>
                                        <a
                                            href={doc.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="text-blue-400 hover:text-blue-300 transform transition-transform group-hover:scale-110"
                                        >
                                            <ExternalLink size={14} />
                                        </a>
                                    </div>
                                    <div className="aspect-[4/3] w-full bg-slate-950 flex items-center justify-center relative">
                                        {doc.url.toLowerCase().endsWith('.pdf') ? (
                                            <div className="flex flex-col items-center text-slate-500">
                                                <FileText size={48} />
                                                <span className="text-xs mt-2 uppercase font-bold tracking-tighter">PDF Document</span>
                                            </div>
                                        ) : (
                                            <img
                                                src={doc.url}
                                                alt={doc.type}
                                                className="w-full h-full object-contain p-2"
                                            />
                                        )}
                                        <div className="absolute inset-0 bg-blue-500/0 group-hover:bg-blue-500/5 transition-colors pointer-events-none" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Audit Info */}
                    <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <AlertTriangle className="text-blue-400" size={18} />
                        <p className="text-[11px] text-slate-400 leading-tight">
                            <span className="text-blue-400 font-bold uppercase mr-1">Trust Awareness:</span>
                            Reviewing decrypted PII is strictly recorded in audit logs. Ensure you double-check the document authenticity before approval.
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
                                Reject Application
                            </button>
                            <button
                                onClick={handleVerify}
                                disabled={processing}
                                className="flex-[2] px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white rounded-xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                            >
                                <CheckCircle size={18} />
                                {processing ? 'Processing...' : 'Approve & Verify KYC'}
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4 animate-in slide-in-from-bottom-2">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Rejection Reason</label>
                                <textarea
                                    value={rejectionReason}
                                    onChange={(e) => setRejectionReason(e.target.value)}
                                    placeholder="Enter specific reason for rejection (e.g. Blurred PAN card image)..."
                                    className="w-full bg-[#0f172a] border border-slate-700 rounded-xl p-4 text-slate-200 text-sm focus:ring-2 focus:ring-red-500/40 focus:border-red-500 outline-none min-h-[100px] transition-all"
                                />
                            </div>
                            <div className="flex gap-4">
                                <button
                                    onClick={() => setShowRejectionInput(false)}
                                    className="flex-1 px-4 py-2 text-slate-400 hover:text-white font-medium text-sm transition-colors"
                                >
                                    Cancel
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

export default KycDetailsModal;
