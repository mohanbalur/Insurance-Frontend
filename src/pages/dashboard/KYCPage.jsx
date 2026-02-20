import React, { useState, useEffect } from 'react';
import { ShieldCheck, AlertTriangle, Clock3, UploadCloud, CheckCircle2, XCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { getKYCStatus, submitKYC } from '../../services/kycService';
import { toast } from 'react-hot-toast';

const KYCPage = () => {
    const { accessToken, refreshUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [kycStatus, setKycStatus] = useState(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const [formData, setFormData] = useState({
        dob: '',
        gender: 'Male',
        aadhaarNumber: '',
        panNumber: '',
        accountNumber: '',
        ifscCode: ''
    });

    const [files, setFiles] = useState({
        aadhaarCard: null,
        panCard: null,
        bankProof: null
    });

    useEffect(() => {
        if (!accessToken) {
            setLoading(false);
            return;
        }
        fetchStatus();
    }, [accessToken]);

    const fetchStatus = async () => {
        try {
            setLoading(true);
            const data = await getKYCStatus();
            if (data.success) {
                const status = data.data.kycStatus || 'NOT_SUBMITTED';
                setKycStatus(status);
                if (status === 'REJECTED') {
                    setRejectionReason(data.data.kycRejectionReason || 'Please review details and resubmit.');
                }
            }
        } catch (error) {
            toast.error('Could not fetch KYC status. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setSuccessMessage('');
        setErrorMessage('');
    };

    const handleFileChange = (e) => {
        const { name, files: selectedFiles } = e.target;
        if (selectedFiles && selectedFiles[0]) {
            setFiles((prev) => ({ ...prev, [name]: selectedFiles[0] }));
            setSuccessMessage('');
            setErrorMessage('');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccessMessage('');
        setErrorMessage('');

        if (!files.aadhaarCard || !files.panCard || !files.bankProof) {
            setErrorMessage('All documents are required.');
            toast.error('All documents are required.');
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();

            Object.keys(formData).forEach((key) => data.append(key, formData[key]));
            data.append('aadhaarCard', files.aadhaarCard);
            data.append('panCard', files.panCard);
            data.append('bankProof', files.bankProof);

            await submitKYC(data);
            setSuccessMessage('KYC submitted successfully. Your verification is now under review.');
            toast.success('KYC submitted successfully');

            await fetchStatus();
            if (typeof refreshUser === 'function') await refreshUser();
        } catch (error) {
            const msg = error.response?.data?.message || 'Submission failed. Please check your inputs.';
            setErrorMessage(msg);
            toast.error(msg, { duration: 5000 });
        } finally {
            setSubmitting(false);
        }
    };

    const inputClass = 'w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition-all placeholder:text-slate-400 focus:border-[#1E90FF] focus:ring-4 focus:ring-blue-100';

    const statusMeta = {
        VERIFIED: {
            label: 'Verified',
            icon: CheckCircle2,
            tone: 'bg-emerald-50 text-emerald-700 border-emerald-200',
            note: 'Your profile is verified. You can purchase policies and file claims.'
        },
        PENDING_VERIFICATION: {
            label: 'Under Review',
            icon: Clock3,
            tone: 'bg-amber-50 text-amber-700 border-amber-200',
            note: 'Your documents are under review. Typical turnaround is 24-48 hours.'
        },
        REJECTED: {
            label: 'Rejected',
            icon: XCircle,
            tone: 'bg-red-50 text-red-700 border-red-200',
            note: rejectionReason || 'Please review your submission and try again.'
        },
        NOT_SUBMITTED: {
            label: 'Not Submitted',
            icon: AlertTriangle,
            tone: 'bg-slate-100 text-slate-700 border-slate-200',
            note: 'Complete the form below to submit your verification.'
        }
    };

    const currentStatus = statusMeta[kycStatus || 'NOT_SUBMITTED'];
    const StatusIcon = currentStatus.icon;

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-t-2 border-[#1E90FF]" />
            </div>
        );
    }

    return (
        <div className="h-full min-w-0 space-y-4 animate-fadeIn">
            <header className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">KYC Verification</h1>
                    <p className="text-sm text-slate-500">Submit your identity and bank documents securely.</p>
                </div>
                <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${currentStatus.tone}`}>
                    <StatusIcon size={14} />
                    {currentStatus.label}
                </div>
            </header>

            {(kycStatus === 'VERIFIED' || kycStatus === 'PENDING_VERIFICATION') ? (
                <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <div className="flex items-start gap-3">
                        <div className={`rounded-xl border p-2 ${currentStatus.tone}`}>
                            <StatusIcon size={18} />
                        </div>
                        <div>
                            <p className="text-sm font-semibold text-[#0B1F3A]">Status: {currentStatus.label}</p>
                            <p className="mt-1 text-sm text-slate-600">{currentStatus.note}</p>
                        </div>
                    </div>
                </section>
            ) : (
                <div className="grid h-[calc(100%-72px)] min-h-[460px] grid-cols-1 gap-3 xl:grid-cols-3">
                    <aside className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-1">
                        <div className="mb-3 flex items-center gap-2">
                            <ShieldCheck size={17} className="text-[#1E90FF]" />
                            <h2 className="text-sm font-bold uppercase tracking-wide text-slate-700">Submission Checklist</h2>
                        </div>

                        <ul className="space-y-2 text-sm text-slate-600">
                            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">Aadhaar number and document</li>
                            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">PAN number and document</li>
                            <li className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">Bank account, IFSC and proof</li>
                        </ul>

                        {kycStatus === 'REJECTED' && (
                            <div className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-700">
                                <p className="font-semibold">Previous submission was rejected:</p>
                                <p className="mt-1">{rejectionReason}</p>
                            </div>
                        )}
                    </aside>

                    <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm xl:col-span-2">
                        <form onSubmit={handleSubmit} className="flex h-full flex-col">
                            <div className="space-y-3 overflow-auto pr-1">
                                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Date of Birth</label>
                                        <input type="date" name="dob" value={formData.dob} onChange={handleInputChange} required className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Gender</label>
                                        <select name="gender" value={formData.gender} onChange={handleInputChange} className={inputClass}>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Aadhaar Number</label>
                                        <input type="text" name="aadhaarNumber" value={formData.aadhaarNumber} onChange={handleInputChange} required placeholder="12 digits" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">PAN Number</label>
                                        <input type="text" name="panNumber" value={formData.panNumber} onChange={handleInputChange} required placeholder="ABCDE1234F" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">Account Number</label>
                                        <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} required placeholder="9-18 digits" className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="mb-1 block text-xs font-semibold uppercase tracking-wide text-slate-600">IFSC Code</label>
                                        <input type="text" name="ifscCode" value={formData.ifscCode} onChange={handleInputChange} required placeholder="ABCD0123456" className={inputClass} />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="mb-2 text-sm font-bold text-[#0B1F3A]">Document Uploads</h3>
                                    <div className="grid grid-cols-1 gap-2 md:grid-cols-3">
                                        <label className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                            Aadhaar Card
                                            <input type="file" name="aadhaarCard" onChange={handleFileChange} required accept=".jpg,.jpeg,.png,.pdf" className="mt-1 block w-full text-xs" />
                                        </label>
                                        <label className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                            PAN Card
                                            <input type="file" name="panCard" onChange={handleFileChange} required accept=".jpg,.jpeg,.png,.pdf" className="mt-1 block w-full text-xs" />
                                        </label>
                                        <label className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs text-slate-600">
                                            Bank Proof
                                            <input type="file" name="bankProof" onChange={handleFileChange} required accept=".jpg,.jpeg,.png,.pdf" className="mt-1 block w-full text-xs" />
                                        </label>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-3 border-t border-slate-100 pt-3">
                                {successMessage && (
                                    <div className="mb-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs font-semibold text-emerald-700">
                                        {successMessage}
                                    </div>
                                )}
                                {errorMessage && (
                                    <div className="mb-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-semibold text-red-700">
                                        {errorMessage}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition-colors ${submitting ? 'cursor-not-allowed bg-slate-400' : 'bg-[#1E90FF] hover:bg-blue-600'}`}
                                >
                                    <UploadCloud size={15} />
                                    {submitting ? 'Submitting...' : 'Submit KYC'}
                                </button>
                            </div>
                        </form>
                    </section>
                </div>
            )}
        </div>
    );
};

export default KYCPage;
