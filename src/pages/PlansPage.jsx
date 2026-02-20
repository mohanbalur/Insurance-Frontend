import React, { useState, useEffect } from 'react';
import axiosInstance from '../api/axios';
import { Link } from 'react-router-dom';

const PlansPage = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPlans = async () => {
            try {
                const response = await axiosInstance.get('/plans');
                if (response.data.success && response.data.data && response.data.data.plans) {
                    const data = response.data.data.plans;
                    if (!data || data.length === 0) {
                        setError('NO_PLANS');
                    } else {
                        setPlans(data);
                    }
                } else {
                    setError('FETCH_ERROR');
                }
            } catch (err) {
                console.error('Plans fetch error:', err);
                setError('FETCH_ERROR');
            } finally {
                setLoading(false);
            }
        };

        fetchPlans();
    }, []);

    if (loading) {
        return (
            <div className="min-h-[60vh] flex items-center justify-center">
                <div className="text-[#1E90FF] font-bold animate-pulse">Fetching Insurance Plans...</div>
            </div>
        );
    }

    if (error === 'NO_PLANS') {
        return (
            <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center bg-white">
                <div className="max-w-md">
                    <h2 className="text-2xl font-bold text-[#0B1F3A] mb-4">No Active Plans Found</h2>
                    <p className="text-slate-600 mb-8">
                        The backend currently has no active insurance plans. Would you like me to request seed plan creation? (Example: "Standard Health Plan")
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#F4F7FB] py-16 lg:py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h1 className="text-4xl font-bold text-[#0B1F3A] mb-4">Choose Your Plan</h1>
                    <p className="text-slate-600 text-lg">Transparent pricing and comprehensive coverage tailored to your life.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {plans.map((plan) => (
                        <div key={plan._id} className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all flex flex-col h-full">
                            <div className="flex justify-between items-start mb-6">
                                <span className="bg-[#1E90FF]/10 text-[#1E90FF] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                    {plan.type}
                                </span>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-[#0B1F3A]">${plan.premium}</span>
                                    <span className="text-slate-400 text-sm">/mo</span>
                                </div>
                            </div>

                            <h3 className="text-xl font-bold text-[#0B1F3A] mb-3">{plan.name}</h3>
                            <p className="text-slate-500 text-sm mb-6 flex-grow">{plan.description}</p>

                            <div className="space-y-4 mb-8">
                                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                                    <span className="text-slate-400">Coverage</span>
                                    <span className="font-bold text-[#0B1F3A]">${plan.coverage.toLocaleString()}</span>
                                </div>
                                <div className="flex items-center justify-between text-sm py-2 border-b border-slate-50">
                                    <span className="text-slate-400">Duration</span>
                                    <span className="font-bold text-[#0B1F3A]">{plan.durationMonths} Months</span>
                                </div>
                            </div>

                            <Link
                                to={`/plans/${plan._id}`}
                                className="w-full bg-[#0B1F3A] text-white text-center py-4 rounded-xl font-bold hover:bg-[#1E90FF] transition-colors shadow-md"
                            >
                                View Details
                            </Link>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PlansPage;
