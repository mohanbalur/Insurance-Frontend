import React, { useState } from 'react';
import {
    Briefcase,
    TrendingUp,
    Users,
    ShieldCheck,
    CheckCircle2,
    ArrowRight,
    Loader2
} from 'lucide-react';
import axiosInstance from '../../api/axios';
import { useAuth } from '../../contexts/AuthContext';
import toast from 'react-hot-toast';

const BecomeAgent = () => {
    const { user, setUser } = useAuth();
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleApply = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.post('/agents/apply');
            if (response.data.success) {
                setSubmitted(true);
                toast.success('Application submitted successfully!');

                // Update local role optimistically
                const updatedUser = { ...user, role: 'AGENT' };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
            }
        } catch (error) {
            console.error('Agent Application Error:', error);
            toast.error(error.response?.data?.message || 'Failed to submit application');
        } finally {
            setLoading(false);
        }
    };

    if (submitted || user?.role === 'AGENT') {
        return (
            <div className="max-w-2xl mx-auto py-12 text-center animate-fadeIn">
                <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h1 className="text-3xl font-bold text-[#0B1F3A] mb-4">Application Received!</h1>
                <p className="text-slate-500 mb-8 leading-relaxed">
                    Thank you for applying to join our sales force.
                    Your professional status is now set to **AGENT** (Pending Admin Approval).
                    You can access your limited dashboard, but referral links will activate once verified.
                </p>
                <div className="flex justify-center gap-4">
                    <button
                        onClick={() => window.location.href = '/agent/dashboard'}
                        className="bg-[#1E90FF] text-white px-8 py-3 rounded-xl font-bold hover:bg-[#0B1F3A] transition-all"
                    >
                        Go to Agent Dashboard
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-12 animate-fadeIn">
            <div className="text-center space-y-4">
                <h1 className="text-4xl font-extrabold text-[#0B1F3A]">Grow with Us</h1>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    Join our exclusive network of insurance agents and earn industry-leading commissions helping people secure their future.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {[
                    {
                        title: 'High Commissions',
                        desc: 'Earn a steady 5% commission on every policy premium direct to your account.',
                        icon: TrendingUp,
                        color: 'blue'
                    },
                    {
                        title: 'Premium Tools',
                        desc: 'Access real-time sales tracking, unique referral links, and QR marketing tools.',
                        icon: Briefcase,
                        color: 'purple'
                    },
                    {
                        title: 'No Overhead',
                        desc: 'We handle the underwriting and support. You focus on building relationships.',
                        icon: Users,
                        color: 'emerald'
                    }
                ].map((benefit, idx) => (
                    <div key={idx} className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
                        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform ${benefit.color === 'blue' ? 'bg-blue-50 text-blue-500' :
                                benefit.color === 'purple' ? 'bg-purple-50 text-purple-500' :
                                    'bg-emerald-50 text-emerald-500'
                            }`}>
                            <benefit.icon size={28} />
                        </div>
                        <h3 className="text-lg font-bold text-[#0B1F3A] mb-3">{benefit.title}</h3>
                        <p className="text-slate-500 text-sm leading-relaxed">{benefit.desc}</p>
                    </div>
                ))}
            </div>

            <div className="bg-[#0B1F3A] rounded-[2.5rem] p-12 text-white relative overflow-hidden shadow-2xl">
                <div className="relative z-10 max-w-2xl">
                    <h2 className="text-3xl font-bold mb-6">Ready to start your journey?</h2>
                    <p className="text-slate-400 mb-8 leading-relaxed">
                        By clicking "Apply Now", you agree to our agent terms and conditions.
                        Our team will review your profile and verification status before granting sales authorization.
                    </p>
                    <button
                        onClick={handleApply}
                        disabled={loading}
                        className="flex items-center gap-3 bg-[#1E90FF] hover:bg-white hover:text-[#0B1F3A] text-white px-10 py-4 rounded-2xl font-bold text-lg transition-all active:scale-95 disabled:opacity-50"
                    >
                        {loading ? <Loader2 className="animate-spin" /> : <ShieldCheck />}
                        {loading ? 'Submitting Application...' : 'Apply as Agent Now'}
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </div>

                {/* Decorative element */}
                <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 right-12 translate-y-1/3 opacity-10">
                    <ShieldCheck size={200} />
                </div>
            </div>
        </div>
    );
};

export default BecomeAgent;
