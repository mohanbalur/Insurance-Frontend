import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../../api/axios';
import { toast } from 'react-hot-toast';

const PaymentSimulationPage = () => {
    const { policyId } = useParams();
    const navigate = useNavigate();
    const [policy, setPolicy] = useState(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [paymentId, setPaymentId] = useState(null);
    const [step, setStep] = useState('initiate'); // initiate | processing | success

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await axiosInstance.get(`/policies/${policyId}`);
                setPolicy(response.data.data.policy);
            } catch (error) {
                console.error('Error fetching policy:', error);
                toast.error('Failed to load policy details');
            } finally {
                setLoading(false);
            }
        };
        fetchPolicy();
    }, [policyId]);

    const handleInitiate = async () => {
        setProcessing(true);
        try {
            const response = await axiosInstance.post(`/payments/initiate/${policyId}`);
            setPaymentId(response.data.data.payment._id);
            setStep('processing');
        } catch (error) {
            console.error('Initiation error:', error);
            toast.error(error.response?.data?.message || 'Failed to initiate payment');
        } finally {
            setProcessing(false);
        }
    };

    const handleSimulateSuccess = async () => {
        setProcessing(true);
        try {
            await axiosInstance.post(`/payments/verify/${paymentId}`);
            setStep('success');
            toast.success('Payment simulated successfully!');
            setTimeout(() => navigate('/dashboard/policies'), 2000);
        } catch (error) {
            console.error('Verification error:', error);
            toast.error('Simulation failed. Please try again.');
        } finally {
            setProcessing(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#1E90FF]"></div>
            </div>
        );
    }

    if (!policy) {
        return (
            <div className="text-center py-12">
                <h3 className="text-xl font-bold text-[#0B1F3A]">Policy not found</h3>
                <button onClick={() => navigate('/dashboard/policies')} className="mt-4 text-[#1E90FF] font-bold">Back to Policies</button>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto py-12 px-4">
            <div className="bg-white rounded-3xl border border-slate-100 shadow-2xl overflow-hidden">
                {/* Header */}
                <div className="bg-[#0B1F3A] p-8 text-white text-center">
                    <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/20">
                        <svg className="w-8 h-8 text-[#1E90FF]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-extrabold uppercase tracking-tight">Payment Gateway</h2>
                    <p className="text-slate-400 text-sm mt-1">Simulated Secure Checkout</p>
                </div>

                {/* Content */}
                <div className="p-10">
                    {step === 'initiate' && (
                        <div className="space-y-6 animate-fadeIn">
                            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-500 text-sm">Policy Number</span>
                                    <span className="font-mono font-bold text-[#0B1F3A]">{policy.policyNumber}</span>
                                </div>
                                <div className="flex justify-between items-center mb-4">
                                    <span className="text-slate-500 text-sm">Plan</span>
                                    <span className="font-bold text-[#0B1F3A]">{policy.plan?.name}</span>
                                </div>
                                <div className="border-t border-slate-200 pt-4 mt-4 flex justify-between items-center">
                                    <span className="text-lg font-bold text-[#0B1F3A]">Total to Pay</span>
                                    <span className="text-2xl font-extrabold text-[#1E90FF]">₹{policy.premiumAmount.toLocaleString()}</span>
                                </div>
                            </div>

                            <button
                                onClick={handleInitiate}
                                disabled={processing}
                                className="w-full py-4 bg-[#1E90FF] text-white rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:scale-[1.02] transition-all disabled:opacity-50"
                            >
                                {processing ? 'Initiating...' : 'Proceed to Simulator'}
                            </button>
                            <button
                                onClick={() => navigate('/dashboard/policies')}
                                className="w-full text-slate-400 font-medium py-2"
                            >
                                Cancel and return
                            </button>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="text-center py-8 space-y-6 animate-pulse">
                            <div className="flex justify-center">
                                <div className="relative">
                                    <div className="w-20 h-20 border-4 border-[#1E90FF]/10 rounded-full"></div>
                                    <div className="w-20 h-20 border-4 border-t-[#1E90FF] rounded-full absolute top-0 animate-spin"></div>
                                </div>
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-[#0B1F3A]">Awaiting Network Confirmation</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mt-2">
                                    In a live environment, this would securely handshake with the bank.
                                </p>
                            </div>
                            <div className="grid grid-cols-2 gap-4 pt-6">
                                <button
                                    onClick={handleSimulateSuccess}
                                    disabled={processing}
                                    className="px-6 py-4 bg-green-500 text-white rounded-2xl font-bold shadow-lg shadow-green-500/20 hover:bg-green-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Success
                                </button>
                                <button
                                    onClick={() => {
                                        toast.error('Simulated Failure');
                                        setStep('initiate');
                                    }}
                                    className="px-6 py-4 bg-red-500 text-white rounded-2xl font-bold shadow-lg shadow-red-500/20 hover:bg-red-600 transition-all flex items-center justify-center gap-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                    Failure
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-8 space-y-6 animate-fadeIn">
                            <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="text-2xl font-extrabold text-[#0B1F3A]">Payment Successful</h3>
                                <p className="text-slate-500 mt-2">
                                    Your policy is now in the <b>Underwriting Queue</b>.
                                </p>
                            </div>
                            <div className="bg-slate-50 p-4 rounded-xl text-sm font-medium text-slate-500">
                                Redirecting you to your policies...
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 border-t border-slate-100 flex items-center justify-center gap-4 text-slate-400 text-xs font-medium uppercase tracking-widest">
                    <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg>
                        SSL SECURE
                    </span>
                    <span>•</span>
                    <span>PCI DSS COMPLIANT</span>
                </div>
            </div>
        </div>
    );
};

export default PaymentSimulationPage;
