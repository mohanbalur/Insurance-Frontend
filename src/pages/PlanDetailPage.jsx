import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const PlanDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [plan, setPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [purchasing, setPurchasing] = useState(false);
    const [purchaseError, setPurchaseError] = useState(null);
    const [purchaseSuccess, setPurchaseSuccess] = useState(false);

    useEffect(() => {
        // Detect referral code from URL
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');
        if (ref) {
            localStorage.setItem('referralCode', ref);
            console.log('Referral code captured:', ref);
        }

        const fetchPlan = async () => {
            try {
                const response = await axiosInstance.get(`/plans/${id}`);
                if (response.data.success && response.data.data && response.data.data.plan) {
                    setPlan(response.data.data.plan);
                } else {
                    setError('PLAN_NOT_FOUND');
                }
            } catch (err) {
                console.error('Plan detail fetch error:', err);
                setError('PLAN_NOT_FOUND');
            } finally {
                setLoading(false);
            }
        };

        fetchPlan();
    }, [id]);

    const handlePurchase = async () => {
        if (!user) {
            navigate('/login');
            return;
        }

        if (user.kycStatus !== 'VERIFIED') {
            setPurchaseError('KYC verification required. Please complete your verification to purchase this plan.');
            return;
        }

        setPurchasing(true);
        setPurchaseError(null);

        try {
            const referralCode = localStorage.getItem('referralCode');
            const response = await axiosInstance.post('/policies/purchase', {
                planId: id,
                referralCode
            });
            if (response.data.success) {
                setPurchaseSuccess(true);
                setTimeout(() => navigate('/dashboard/policies'), 2000);
            }
        } catch (err) {
            console.error('Purchase error:', err);
            setPurchaseError(err.response?.data?.message || 'Failed to initiate purchase. Please try again.');
        } finally {
            setPurchasing(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-[#1E90FF] font-bold animate-pulse">Loading Plan Details...</div>
            </div>
        );
    }

    if (error || !plan) {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
                <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">Plan Not Found</h2>
                <Link to="/plans" className="text-[#1E90FF] font-bold">Back to Plans</Link>
            </div>
        );
    }

    return (
        <div className="bg-white py-16 lg:py-24">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <Link to="/plans" className="text-slate-400 hover:text-[#1E90FF] flex items-center mb-8 font-medium transition-colors">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Back to all plans
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Left Column: Details */}
                    <div className="lg:col-span-2">
                        <div className="inline-block bg-[#1E90FF]/10 text-[#1E90FF] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-6">
                            {plan.type}
                        </div>
                        <h1 className="text-4xl font-extrabold text-[#0B1F3A] mb-6">{plan.name}</h1>
                        <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                            {plan.description}
                        </p>

                        <div className="space-y-6">
                            <h3 className="text-xl font-bold text-[#0B1F3A]">Plan Highlights</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-sm text-slate-400 mb-1">Total Coverage</p>
                                    <p className="text-2xl font-bold text-[#0B1F3A]">${plan.coverage.toLocaleString()}</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <p className="text-sm text-slate-400 mb-1">Policy Duration</p>
                                    <p className="text-2xl font-bold text-[#0B1F3A]">{plan.durationMonths} Months</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Pricing Box */}
                    <div className="lg:col-span-1">
                        <div className="bg-[#0B1F3A] text-white p-8 rounded-3xl shadow-xl sticky top-24">
                            <div className="mb-8">
                                <p className="text-slate-400 text-sm mb-1">Monthly Premium</p>
                                <div className="flex items-baseline space-x-1">
                                    <span className="text-4xl font-bold">${plan.premium}</span>
                                    <span className="text-slate-400">/month</span>
                                </div>
                            </div>

                            {purchaseSuccess ? (
                                <div className="bg-green-500/20 text-green-400 p-4 rounded-xl text-sm font-medium mb-4 flex items-center">
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                    Purchase initiated! Redirecting...
                                </div>
                            ) : (
                                <>
                                    {purchaseError && (
                                        <div className="bg-red-500/20 text-red-400 p-4 rounded-xl text-sm font-medium mb-4">
                                            {purchaseError}
                                            {purchaseError.includes('KYC') && (
                                                <button
                                                    onClick={() => navigate('/dashboard/kyc')}
                                                    className="block mt-2 text-[#1E90FF] underline font-bold"
                                                >
                                                    Complete KYC Now
                                                </button>
                                            )}
                                        </div>
                                    )}
                                    <button
                                        onClick={handlePurchase}
                                        disabled={purchasing}
                                        className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg mb-4 ${purchasing
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : 'bg-[#1E90FF] text-white hover:bg-white hover:text-[#0B1F3A]'
                                            }`}
                                    >
                                        {purchasing ? 'Processing...' : 'Buy This Plan'}
                                    </button>
                                </>
                            )}
                            <p className="text-xs text-center text-slate-400">
                                Secure checkout by SecureLife Payments
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetailPage;
