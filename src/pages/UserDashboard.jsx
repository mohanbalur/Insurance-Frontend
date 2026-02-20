import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Clock3, Wallet, ArrowUpRight, CircleCheck } from 'lucide-react';
import axiosInstance from '../api/axios';
import { useAuth } from '../contexts/AuthContext';

const UserDashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        activePolicies: 0,
        pendingClaims: 0,
        totalPaid: 0
    });
    const [recentPolicies, setRecentPolicies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.role === 'ADMIN') {
            navigate('/admin/dashboard', { replace: true });
            return;
        }

        const fetchDashboardData = async () => {
            try {
                const policiesRes = await axiosInstance.get('/policies/my-policies');
                const policies = policiesRes.data.data.policies || [];

                const claimsRes = await axiosInstance.get('/claims/my-claims');
                const claims = claimsRes.data.data.claims || [];

                const paymentsRes = await axiosInstance.get('/payments/my-history');
                const payments = paymentsRes.data.data.payments || [];

                setStats({
                    activePolicies: policies.filter((p) => p.status === 'ACTIVE').length,
                    pendingClaims: claims.filter((c) => c.status === 'PENDING').length,
                    totalPaid: payments.reduce((acc, curr) => acc + (curr.status === 'COMPLETED' ? curr.amount : 0), 0)
                });

                setRecentPolicies(policies.slice(0, 4));
            } catch (error) {
                console.error('Error fetching dashboard data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [user, navigate]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-t-2 border-[#1E90FF]" />
            </div>
        );
    }

    const statCards = [
        {
            label: 'Active Policies',
            value: stats.activePolicies,
            icon: ShieldCheck,
            tone: 'text-blue-600 bg-blue-50'
        },
        {
            label: 'Pending Claims',
            value: stats.pendingClaims,
            icon: Clock3,
            tone: 'text-amber-600 bg-amber-50'
        },
        {
            label: 'Total Paid',
            value: `Rs ${stats.totalPaid.toLocaleString()}`,
            icon: Wallet,
            tone: 'text-emerald-600 bg-emerald-50'
        }
    ];

    return (
        <div className="h-full min-w-0 space-y-4 animate-fadeIn">
            <header className="flex flex-col gap-1">
                <h1 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">Overview</h1>
                <p className="text-sm text-slate-500">Your insurance account snapshot.</p>
            </header>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                {statCards.map((stat) => (
                    <div key={stat.label} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="text-xs font-medium text-slate-500">{stat.label}</p>
                                <h3 className="mt-1 text-xl font-bold text-[#0B1F3A]">{stat.value}</h3>
                            </div>
                            <div className={`rounded-xl p-2 ${stat.tone}`}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                <section className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
                        <h2 className="text-base font-bold text-[#0B1F3A]">Recent Policies</h2>
                        <Link to="/dashboard/policies" className="text-xs font-semibold text-[#1E90FF] hover:underline">
                            View all
                        </Link>
                    </div>

                    <div className="max-h-[300px] overflow-auto">
                        {recentPolicies.length > 0 ? (
                            <div className="divide-y divide-slate-100">
                                {recentPolicies.map((policy) => (
                                    <div key={policy._id} className="flex items-start justify-between gap-3 px-4 py-3">
                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-semibold text-[#0B1F3A]">{policy.plan?.name}</p>
                                            <p className="text-xs text-slate-500">Policy #{policy._id.slice(-8).toUpperCase()}</p>
                                        </div>
                                        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${policy.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-600'}`}>
                                            {policy.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="flex h-[220px] flex-col items-center justify-center gap-2 text-slate-400">
                                <CircleCheck size={24} className="opacity-30" />
                                <p className="text-sm">No policies found.</p>
                                <Link to="/plans" className="inline-flex items-center gap-1 text-xs font-semibold text-[#1E90FF] hover:underline">
                                    Browse plans <ArrowUpRight size={12} />
                                </Link>
                            </div>
                        )}
                    </div>
                </section>

                <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h2 className="text-base font-bold text-[#0B1F3A]">Quick Actions</h2>
                    <p className="mt-1 text-xs text-slate-500">Common actions in one place.</p>

                    <div className="mt-4 space-y-2">
                        <Link
                            to="/dashboard/claims"
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E90FF]"
                        >
                            File / Track Claims
                            <ArrowUpRight size={14} />
                        </Link>
                        <Link
                            to="/dashboard/kyc"
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E90FF]"
                        >
                            KYC Verification
                            <ArrowUpRight size={14} />
                        </Link>
                        <Link
                            to="/dashboard/policies"
                            className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm font-medium text-slate-700 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-[#1E90FF]"
                        >
                            My Policies
                            <ArrowUpRight size={14} />
                        </Link>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default UserDashboard;
