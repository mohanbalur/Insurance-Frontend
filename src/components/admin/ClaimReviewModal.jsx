import React, { useState, useEffect } from 'react';
import {
    X,
    Shield,
    CreditCard,
    Info,
    AlertTriangle,
    AlertCircle,
    FileText,
    Activity,
    ExternalLink,
    CheckCircle2,
    XCircle,
    Clock,
    Eye,
    Lock,
    ChevronDown,
    Loader2,
    UserCheck,
    Calendar
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

// ─── State Machine ────────────────────────────────────────────────────────────
const VALID_TRANSITIONS = {
    PENDING: ['UNDER_REVIEW', 'APPROVED', 'REJECTED'],
    UNDER_REVIEW: ['APPROVED', 'REJECTED'],
    APPROVED: [], // FINAL — immutable
    REJECTED: [], // FINAL — immutable
    SETTLED: [], // FINAL — immutable
};

const STATUS_CONFIG = {
    PENDING: { label: 'Pending', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/30', icon: Clock },
    UNDER_REVIEW: { label: 'Under Review', color: 'text-blue-400', bg: 'bg-blue-400/10', border: 'border-blue-400/30', icon: FileText },
    APPROVED: { label: 'Approved', color: 'text-green-400', bg: 'bg-green-400/10', border: 'border-green-400/30', icon: CheckCircle2 },
    REJECTED: { label: 'Rejected', color: 'text-red-400', bg: 'bg-red-400/10', border: 'border-red-400/30', icon: XCircle },
    SETTLED: { label: 'Settled', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/30', icon: CheckCircle2 },
};

const TRANSITION_LABELS = {
    UNDER_REVIEW: 'Move to Under Review',
    APPROVED: 'Approve Claim',
    REJECTED: 'Reject Claim',
};

// ─── Component ────────────────────────────────────────────────────────────────
const ClaimReviewModal = ({ claim: initialClaim, onClose, onStatusUpdated }) => {
    const [claim, setClaim] = useState(initialClaim);
    const [coverage, setCoverage] = useState(null);
    const [loadingCoverage, setLoadingCoverage] = useState(true);

    // Transition state
    const [selectedStatus, setSelectedStatus] = useState('');
    const [adminNotes, setAdminNotes] = useState(claim.adminNotes || '');
    const [processing, setProcessing] = useState(false);

    // Double-confirm for APPROVED
    const [confirmStep, setConfirmStep] = useState(false); // Phase 5D: approval confirmation

    const isFinal = !VALID_TRANSITIONS[claim.status] || VALID_TRANSITIONS[claim.status].length === 0;
    const allowedTransitions = VALID_TRANSITIONS[claim.status] || [];
    const isOverCoverage = coverage && claim.amount > coverage.remainingCoverage;

    // ── Fetch coverage ─────────────────────────────────────────────────────────
    useEffect(() => {
        const fetchCoverage = async () => {
            if (!claim?.policy?._id) { setLoadingCoverage(false); return; }
            try {
                const res = await adminService.getPolicyCoverage(claim.policy._id);
                setCoverage(res.data?.summary || res.summary || res.data);
            } catch (err) {
                console.warn('Coverage fetch failed:', err.message);
            } finally {
                setLoadingCoverage(false);
            }
        };
        fetchCoverage();
    }, [claim.policy?._id]);

    // ── Transition handler ─────────────────────────────────────────────────────
    const handleTransition = async () => {
        if (!selectedStatus) { toast.error('Select a target status first'); return; }

        // Rejection requires notes (min 10 chars)
        if (selectedStatus === 'REJECTED' && adminNotes.trim().length < 10) {
            toast.error('Rejection requires a reason (min 10 characters)');
            return;
        }

        // APPROVED: require double-confirm
        if (selectedStatus === 'APPROVED' && !confirmStep) {
            setConfirmStep(true);
            return;
        }

        setProcessing(true);
        try {
            const res = await adminService.updateClaimStatus(claim._id, selectedStatus, adminNotes.trim());

            // Trigger parent update FIRST to ensure UI reflects change immediately
            if (onStatusUpdated) onStatusUpdated(claim._id, selectedStatus);

            const updated = res.data?.claim || res.claim;
            setClaim(prev => ({ ...prev, status: selectedStatus, adminNotes: adminNotes.trim(), ...updated }));
            toast.success(`Claim moved to ${selectedStatus}`);
            setSelectedStatus('');
            setConfirmStep(false);
            onClose(); // Close modal after successful update
        } catch (err) {
            toast.error(err?.response?.data?.message || 'Status update failed');
            setConfirmStep(false);
        } finally {
            setProcessing(false);
        }
    };

    const cancelConfirm = () => setConfirmStep(false);

    // ── Status badge ───────────────────────────────────────────────────────────
    const StatusBadge = ({ status }) => {
        const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.PENDING;
        const Icon = cfg.icon;
        return (
            <span className={`px-3 py-1.5 rounded-full text-[10px] font-black border flex items-center gap-1.5 uppercase tracking-widest ${cfg.bg} ${cfg.color} ${cfg.border}`}>
                <Icon size={11} /> {cfg.label}
            </span>
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm">
            <div className="bg-[#162031] border border-slate-800 rounded-3xl w-full max-w-5xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">

                {/* ── Header ── */}
                <div className="p-6 border-b border-slate-800 flex items-center justify-between bg-slate-900/60 shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-blue-500/20 rounded-xl text-blue-400">
                            <Activity size={22} />
                        </div>
                        <div>
                            <h2 className="text-lg font-black text-white uppercase tracking-tight flex items-center gap-3">
                                Claim Command Review
                                {isFinal && (
                                    <span className="flex items-center gap-1 px-2 py-0.5 bg-slate-700 text-slate-400 text-[9px] font-bold rounded border border-slate-600 uppercase">
                                        <Lock size={9} /> Immutable
                                    </span>
                                )}
                            </h2>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                                REF: {claim.claimNumber || claim._id.slice(-10).toUpperCase()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <StatusBadge status={claim.status} />
                        <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                            <X size={22} />
                        </button>
                    </div>
                </div>

                {/* ── Body ── */}
                <div className="flex-1 overflow-y-auto p-7">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-7">

                        {/* Left: Financials */}
                        <div className="lg:col-span-4 space-y-5">

                            {/* Policy Context */}
                            <section className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Shield size={12} /> Policy Context
                                </h3>
                                <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Policy #</span>
                                        <span className="text-xs text-slate-200 font-black font-mono">{claim.policy?.policyNumber || '—'}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Policyholder</span>
                                        <span className="text-xs text-slate-300 font-bold">{claim.user?.name}</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs text-slate-500">Filed On</span>
                                        <span className="text-xs text-slate-300 font-bold">{new Date(claim.createdAt).toLocaleDateString()}</span>
                                    </div>
                                    {claim.status === 'APPROVED' && claim.approvedBy && (
                                        <div className="pt-3 border-t border-slate-800/50 space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="text-xs text-slate-500 flex items-center gap-1"><UserCheck size={11} /> Approved By</span>
                                                <span className="text-xs text-green-400 font-bold">{claim.approvedBy?.name || 'Admin'}</span>
                                            </div>
                                            {claim.approvedAt && (
                                                <div className="flex justify-between items-center">
                                                    <span className="text-xs text-slate-500 flex items-center gap-1"><Calendar size={11} /> Approved At</span>
                                                    <span className="text-xs text-green-400 font-bold">{new Date(claim.approvedAt).toLocaleString()}</span>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* Financial Audit */}
                            <section className="space-y-3">
                                <h3 className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <CreditCard size={12} /> Financial Audit
                                </h3>
                                <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-4 space-y-4">
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Claim Amount</p>
                                        <p className="text-2xl font-black text-white mt-1">₹{claim.amount?.toLocaleString()}</p>
                                    </div>
                                    <div className="pt-3 border-t border-slate-800/50 space-y-2.5">
                                        <div className="flex justify-between text-xs">
                                            <span className="text-slate-500">Original Coverage</span>
                                            <span className="text-slate-300 font-bold">₹{claim.policy?.coverageAmount?.toLocaleString() || '—'}</span>
                                        </div>
                                        {loadingCoverage ? (
                                            <div className="flex items-center gap-2 text-slate-600 text-xs">
                                                <Loader2 size={12} className="animate-spin" /> Loading coverage...
                                            </div>
                                        ) : coverage ? (
                                            <>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Used (Approved)</span>
                                                    <span className="text-slate-300 font-bold">₹{coverage.usedAmount?.toLocaleString()}</span>
                                                </div>
                                                <div className="flex justify-between text-xs">
                                                    <span className="text-slate-500">Reserved (Pending)</span>
                                                    <span className="text-slate-300 font-bold">₹{coverage.reservedAmount?.toLocaleString()}</span>
                                                </div>
                                                <div className={`flex justify-between items-center p-2.5 rounded-xl border ${isOverCoverage ? 'bg-red-500/10 border-red-500/30' : 'bg-slate-800/40 border-slate-700/40'}`}>
                                                    <span className="text-[10px] text-slate-400 font-black uppercase">Remaining</span>
                                                    <span className={`text-sm font-black ${isOverCoverage ? 'text-red-400' : 'text-green-400'}`}>
                                                        ₹{coverage.remainingCoverage?.toLocaleString()}
                                                    </span>
                                                </div>
                                            </>
                                        ) : (
                                            <p className="text-[10px] text-slate-600 italic">Coverage data unavailable</p>
                                        )}
                                    </div>
                                    {isOverCoverage && (
                                        <div className="flex items-center gap-2 p-2.5 bg-red-500/10 border border-red-500/20 rounded-xl text-red-400">
                                            <AlertTriangle size={14} />
                                            <span className="text-[10px] font-black uppercase">Claim exceeds remaining coverage</span>
                                        </div>
                                    )}
                                </div>
                            </section>
                        </div>

                        {/* Right: Claim Details + Actions */}
                        <div className="lg:col-span-8 space-y-5">

                            {/* Claim Info */}
                            <section className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <FileText size={12} /> Claim Information
                                </h3>
                                <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 space-y-4">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Claim Type</p>
                                            <p className="text-sm text-slate-200 font-bold mt-1">{claim.claimType || claim.reason || '—'}</p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] text-slate-500 uppercase font-bold">Incident Date</p>
                                            <p className="text-sm text-slate-200 font-bold mt-1">
                                                {claim.incidentDate ? new Date(claim.incidentDate).toLocaleDateString() : '—'}
                                            </p>
                                        </div>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold">Description</p>
                                        <p className="text-sm text-slate-300 mt-2 leading-relaxed bg-slate-800/30 p-3 rounded-xl border border-slate-800/40">
                                            {claim.description || 'No description provided.'}
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Evidence Documents */}
                            <section className="space-y-3">
                                <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                    <Eye size={12} /> Evidence Documents
                                </h3>
                                <div className="grid grid-cols-3 gap-3">
                                    {claim.documents && claim.documents.length > 0 ? (
                                        claim.documents.map((doc, idx) => (
                                            <div key={idx} className="group relative aspect-square bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-blue-500/50 transition-all">
                                                <div className="absolute inset-0 flex items-center justify-center text-slate-700">
                                                    <FileText size={28} />
                                                </div>
                                                {doc.url && <img src={doc.url} alt={`Evidence ${idx + 1}`} className="absolute inset-0 w-full h-full object-cover" />}
                                                <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                    <span className="text-[9px] font-bold text-white uppercase tracking-widest">{doc.type || 'Document'}</span>
                                                    <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 bg-blue-600 rounded-full text-white">
                                                        <ExternalLink size={14} />
                                                    </a>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="col-span-3 py-8 bg-slate-900/20 border border-dashed border-slate-800 rounded-2xl flex flex-col items-center justify-center text-slate-600">
                                            <AlertCircle size={28} className="opacity-20 mb-2" />
                                            <p className="text-[10px] font-bold uppercase tracking-[0.15em] opacity-40">No evidence documents attached</p>
                                        </div>
                                    )}
                                </div>
                            </section>

                            {/* ── Status Transition Controls (Phase 5C) ── */}
                            {!isFinal ? (
                                <section className="space-y-3">
                                    <h3 className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-2">
                                        <Activity size={12} /> Status Transition
                                    </h3>
                                    <div className="bg-slate-900/50 border border-slate-800/60 rounded-2xl p-5 space-y-4">

                                        {/* Status selector */}
                                        <div className="relative">
                                            <select
                                                value={selectedStatus}
                                                onChange={e => { setSelectedStatus(e.target.value); setConfirmStep(false); }}
                                                className="w-full bg-slate-800 border border-slate-700 rounded-xl py-3 pl-4 pr-10 text-slate-200 text-sm font-bold appearance-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all"
                                            >
                                                <option value="">— Select next status —</option>
                                                {allowedTransitions.map(s => (
                                                    <option key={s} value={s}>{TRANSITION_LABELS[s] || s}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
                                        </div>

                                        {/* Admin Notes */}
                                        <div>
                                            <label className="text-[10px] text-slate-500 uppercase font-bold tracking-widest block mb-2">
                                                Admin Notes {selectedStatus === 'REJECTED' && <span className="text-red-400">* (required for rejection)</span>}
                                            </label>
                                            <textarea
                                                value={adminNotes}
                                                onChange={e => setAdminNotes(e.target.value)}
                                                rows={3}
                                                placeholder={selectedStatus === 'REJECTED' ? 'State the reason for rejection (min 10 chars)...' : 'Optional internal notes for audit trail...'}
                                                className="w-full bg-slate-800/60 border border-slate-700 rounded-xl p-3 text-sm text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none resize-none transition-all"
                                            />
                                            {selectedStatus === 'REJECTED' && (
                                                <p className={`text-[10px] mt-1 font-bold ${adminNotes.trim().length < 10 ? 'text-red-500' : 'text-green-500'}`}>
                                                    {adminNotes.trim().length}/10 minimum characters
                                                </p>
                                            )}
                                        </div>

                                        {/* Coverage warning before approval */}
                                        {selectedStatus === 'APPROVED' && isOverCoverage && (
                                            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400">
                                                <AlertTriangle size={16} className="shrink-0 mt-0.5" />
                                                <p className="text-[10px] font-bold leading-relaxed">
                                                    Warning: This claim amount exceeds the remaining coverage. Backend will enforce the final check, but proceeding may result in rejection.
                                                </p>
                                            </div>
                                        )}

                                        {/* Phase 5D: Double-confirm for APPROVED */}
                                        {confirmStep && selectedStatus === 'APPROVED' && (
                                            <div className="p-4 bg-amber-500/10 border border-amber-500/30 rounded-2xl space-y-3">
                                                <div className="flex items-center gap-2 text-amber-400">
                                                    <AlertTriangle size={16} />
                                                    <p className="text-xs font-black uppercase tracking-tight">Final Confirmation Required</p>
                                                </div>
                                                <p className="text-[11px] text-slate-400 leading-relaxed">
                                                    You are about to <strong className="text-amber-400">APPROVE</strong> this claim for <strong className="text-white">₹{claim.amount?.toLocaleString()}</strong>.
                                                    This action is <strong className="text-red-400">irreversible</strong> and will trigger financial disbursement workflows. Confirm?
                                                </p>
                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={cancelConfirm}
                                                        className="flex-1 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold border border-slate-700 transition-all"
                                                    >
                                                        Cancel
                                                    </button>
                                                    <button
                                                        onClick={handleTransition}
                                                        disabled={processing}
                                                        className="flex-[2] py-2 bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-green-500/20 disabled:opacity-50 flex items-center justify-center gap-2"
                                                    >
                                                        {processing ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
                                                        {processing ? 'Processing...' : 'Confirm Approval'}
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </section>
                            ) : (
                                /* Phase 5D: Final state lock UI */
                                <div className="flex items-start gap-3 p-4 bg-slate-800/30 border border-slate-700/50 rounded-2xl">
                                    <Lock size={18} className="text-slate-500 shrink-0 mt-0.5" />
                                    <div>
                                        <p className="text-xs font-black text-slate-400 uppercase tracking-wider">Record Locked</p>
                                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                                            This claim has reached a final state (<strong className="text-slate-500">{claim.status}</strong>) and cannot be modified. All actions are permanently recorded in the audit log.
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Existing admin notes (read-only display) */}
                            {claim.adminNotes && isFinal && (
                                <div className="p-4 bg-slate-800/20 border border-slate-700/30 rounded-2xl">
                                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-2">Admin Notes (Recorded)</p>
                                    <p className="text-sm text-slate-300 leading-relaxed">{claim.adminNotes}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* ── Footer ── */}
                <div className="p-5 border-t border-slate-800 bg-slate-900/60 flex items-center justify-between shrink-0">
                    <div className="flex items-center gap-2 text-slate-600">
                        <Info size={14} />
                        <span className="text-[10px] font-bold uppercase tracking-widest">All transitions are audit-logged and irreversible</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs font-bold transition-all border border-slate-700"
                        >
                            Close
                        </button>
                        {!isFinal && !confirmStep && (
                            <button
                                onClick={handleTransition}
                                disabled={!selectedStatus || processing}
                                className={`px-6 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed ${selectedStatus === 'REJECTED'
                                    ? 'bg-gradient-to-r from-red-600 to-rose-700 hover:from-red-700 hover:to-rose-800 text-white shadow-lg shadow-red-500/20'
                                    : selectedStatus === 'APPROVED'
                                        ? 'bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800 text-white shadow-lg shadow-green-500/20'
                                        : 'bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 text-white shadow-lg shadow-blue-500/20'
                                    }`}
                            >
                                {processing ? <Loader2 size={14} className="animate-spin" /> : null}
                                {processing ? 'Processing...' : selectedStatus ? `Apply: ${selectedStatus}` : 'Apply Transition'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ClaimReviewModal;
