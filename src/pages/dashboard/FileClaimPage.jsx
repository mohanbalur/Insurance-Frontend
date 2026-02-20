import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';

const FileClaimPage = () => {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [policies, setPolicies] = useState([]);
    const [selectedPolicy, setSelectedPolicy] = useState('');
    const [coverageSummary, setCoverageSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        incidentDate: '',
        description: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchActivePolicies = async () => {
            try {
                const response = await axiosInstance.get('/policies/my-policies');
                const active = (response.data.data.policies || []).filter(p => p.status === 'ACTIVE');
                setPolicies(active);
            } catch (err) {
                console.error('Failed to fetch policies:', err);
                setError('Failed to load active policies.');
            } finally {
                setLoading(false);
            }
        };

        if (user?.kycStatus === 'VERIFIED') {
            fetchActivePolicies();
        } else {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        const fetchCoverageSummary = async () => {
            if (!selectedPolicy) {
                setCoverageSummary(null);
                return;
            }

            try {
                const response = await axiosInstance.get(`/policies/${selectedPolicy}/coverage-summary`);
                setCoverageSummary(response.data.data.summary);
            } catch (err) {
                console.error('Failed to fetch coverage summary:', err);
                setError('Failed to load policy coverage details.');
            }
        };

        fetchCoverageSummary();
    }, [selectedPolicy]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    const validateForm = () => {
        if (!selectedPolicy) return 'Please select a policy';
        if (!formData.amount || formData.amount <= 0) return 'Please enter a valid claim amount';
        if (!formData.incidentDate) return 'Please select an incident date';
        if (!formData.description) return 'Please provide a description';

        if (coverageSummary) {
            const amount = parseFloat(formData.amount);
            if (amount > coverageSummary.remainingCoverage) {
                return `Claim amount ₹${amount.toLocaleString()} exceeds remaining coverage of ₹${coverageSummary.remainingCoverage.toLocaleString()}`;
            }

            const incidentDate = new Date(formData.incidentDate);
            const startDate = new Date(coverageSummary.startDate);
            const endDate = new Date(coverageSummary.endDate);

            if (incidentDate < startDate || incidentDate > endDate) {
                return `Incident date must be between ${startDate.toLocaleDateString()} and ${endDate.toLocaleDateString()}`;
            }
        }

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationError = validateForm();
        if (validationError) {
            setError(validationError);
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            await axiosInstance.post('/claims', {
                policyId: selectedPolicy,
                amount: parseFloat(formData.amount),
                description: formData.description,
                incidentDate: formData.incidentDate
            });
            setSuccess('Claim submitted successfully! Redirecting to claims page...');
            setTimeout(() => navigate('/dashboard/claims'), 2000);
        } catch (err) {
            console.error('Claim submission error:', err);
            setError(err.response?.data?.message || 'Failed to submit claim. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1E90FF]"></div>
            </div>
        );
    }

    if (user?.kycStatus !== 'VERIFIED') {
        return (
            <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                </div>
                <h2 className="text-xl font-bold text-[#0B1F3A] mb-2">KYC Verification Required</h2>
                <p className="text-slate-500 mb-6">You must complete your KYC verification before you can file a claim.</p>
                <button
                    onClick={() => navigate('/dashboard/kyc')}
                    className="bg-[#1E90FF] text-white px-6 py-2 rounded-xl font-bold hover:bg-blue-600 transition-all"
                >
                    Complete KYC
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn">
            <div>
                <h1 className="text-2xl font-bold text-[#0B1F3A]">File New Claim</h1>
                <p className="text-slate-500">Submit a new insurance claim for review.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm space-y-6">
                        {error && (
                            <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm font-medium border border-red-100">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="bg-green-50 text-green-600 p-4 rounded-xl text-sm font-medium border border-green-100">
                                {success}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Select Policy</label>
                            <select
                                value={selectedPolicy}
                                onChange={(e) => setSelectedPolicy(e.target.value)}
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all"
                                required
                            >
                                <option value="">Select an active policy</option>
                                {policies.map(p => (
                                    <option key={p._id} value={p._id}>
                                        {p.plan?.name} ({p.policyNumber})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Claim Amount (₹)</label>
                                <input
                                    type="number"
                                    name="amount"
                                    value={formData.amount}
                                    onChange={handleInputChange}
                                    placeholder="Enter amount"
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Incident Date</label>
                                <input
                                    type="date"
                                    name="incidentDate"
                                    value={formData.incidentDate}
                                    onChange={handleInputChange}
                                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-[#0B1F3A] mb-2">Description / Reason</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                rows="4"
                                placeholder="Describe the incident in detail..."
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all"
                                required
                            ></textarea>
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={submitting || !selectedPolicy}
                                className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${submitting || !selectedPolicy
                                        ? 'bg-slate-200 text-slate-400 cursor-not-allowed'
                                        : 'bg-[#1E90FF] text-white hover:bg-blue-600 shadow-blue-500/20'
                                    }`}
                            >
                                {submitting ? 'Submitting Claim...' : 'Submit Claim'}
                            </button>
                        </div>
                    </form>
                </div>

                <div className="lg:col-span-1 space-y-6">
                    <div className="bg-[#0B1F3A] text-white p-8 rounded-3xl shadow-xl">
                        <h3 className="text-lg font-bold mb-6">Coverage Summary</h3>
                        {coverageSummary ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs text-slate-400 mb-1">Total Coverage</p>
                                    <p className="text-xl font-bold">₹{coverageSummary.coverageAmount.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs text-slate-400 mb-1">Remaining Balance</p>
                                    <p className="text-xl font-bold text-green-400">₹{coverageSummary.remainingCoverage.toLocaleString()}</p>
                                </div>
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <p className="text-xs text-slate-400 mb-1">Used / Reserved</p>
                                    <p className="text-sm font-medium text-yellow-400">₹{(coverageSummary.usedAmount + coverageSummary.reservedAmount).toLocaleString()}</p>
                                </div>
                                <div className="pt-4 border-t border-white/10">
                                    <p className="text-xs text-slate-400 mb-2">Validity Period</p>
                                    <p className="text-xs font-medium">
                                        {new Date(coverageSummary.startDate).toLocaleDateString()} - {new Date(coverageSummary.endDate).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-slate-400 text-sm">Select a policy to view coverage details.</p>
                            </div>
                        )}
                    </div>

                    <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
                        <h3 className="text-sm font-bold text-[#0B1F3A] mb-4">Claim Guidelines</h3>
                        <ul className="text-xs text-slate-500 space-y-3">
                            <li className="flex gap-2">
                                <span className="text-[#1E90FF] font-bold">•</span>
                                Incident must have occurred within the policy period.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-[#1E90FF] font-bold">•</span>
                                Claim amount cannot exceed the remaining coverage balance.
                            </li>
                            <li className="flex gap-2">
                                <span className="text-[#1E90FF] font-bold">•</span>
                                Documentation may be requested after initial submission.
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FileClaimPage;
