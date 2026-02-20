import React, { useState, useEffect } from 'react';
import {
    Users,
    ShieldCheck,
    DollarSign,
    TrendingUp,
    Copy,
    ExternalLink,
    Clock,
    Calendar,
    ArrowUpRight
} from 'lucide-react';
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer
} from 'recharts';
import agentService from '../../services/agentService';
import toast from 'react-hot-toast';

const AgentDashboard = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await agentService.getDashboard();
                if (response.success) {
                    setData(response.data);
                }
            } catch (error) {
                console.error('Error fetching agent dashboard:', error);
                toast.error('Failed to load dashboard data');
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    const copyReferralLink = () => {
        const link = `${window.location.origin}/plans?ref=${data?.referralCode}`;
        navigator.clipboard.writeText(link);
        toast.success('Referral link copied to clipboard');
    };

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="h-9 w-9 animate-spin rounded-full border-b-2 border-t-2 border-blue-500" />
            </div>
        );
    }

    const stats = [
        { title: 'Policies Sold', value: data?.totalPoliciesSold || 0, icon: ShieldCheck, color: 'text-blue-500', bg: 'bg-blue-50' },
        { title: 'Active Policies', value: data?.activePoliciesCount || 0, icon: Users, color: 'text-emerald-500', bg: 'bg-emerald-50' },
        { title: 'Total Commission', value: `Rs ${data?.totalCommission?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-50' },
        { title: 'Rate', value: `${data?.commissionRate || 5}%`, icon: TrendingUp, color: 'text-purple-500', bg: 'bg-purple-50' },
    ];

    return (
        <div className="h-full min-w-0 space-y-4 animate-fadeIn">
            <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">Agent Performance</h1>
                    <p className="text-sm text-slate-500">Track sales and commission in real time.</p>
                </div>

                <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-white p-1.5 shadow-sm">
                    <div className="rounded-lg bg-blue-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-blue-600">
                        Ref: {data?.referralCode}
                    </div>
                    <button
                        onClick={copyReferralLink}
                        className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-500"
                        title="Copy referral link"
                    >
                        <Copy size={16} />
                    </button>
                    <button
                        className="rounded-lg p-1.5 text-slate-400 transition-all hover:bg-blue-50 hover:text-blue-500"
                        title="Open storefront"
                        onClick={() => window.open(`/plans?ref=${data?.referralCode}`, '_blank')}
                    >
                        <ExternalLink size={16} />
                    </button>
                </div>
            </header>

            <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
                {stats.map((stat, idx) => (
                    <div key={idx} className="rounded-2xl border border-slate-200 bg-white p-3.5 shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                            <div>
                                <p className="mb-1 text-xs font-medium text-slate-500">{stat.title}</p>
                                <h3 className="text-xl font-bold leading-tight text-[#0B1F3A]">{stat.value}</h3>
                            </div>
                            <div className={`${stat.bg} ${stat.color} rounded-xl p-2`}>
                                <stat.icon size={18} />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 gap-3 xl:grid-cols-3">
                <div className="xl:col-span-2 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 flex items-center justify-between">
                        <h3 className="text-base font-bold text-[#0B1F3A]">Sales Overview</h3>
                        <div className="flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
                            <Calendar size={13} />
                            <span>Last 6 Months</span>
                        </div>
                    </div>

                    <div className="h-[220px] w-full min-w-0 min-h-[220px]">
                        <ResponsiveContainer width="100%" height="100%" minWidth={280} minHeight={220}>
                            <AreaChart data={data?.monthlySales}>
                                <defs>
                                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.12} />
                                        <stop offset="95%" stopColor="#1E90FF" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                                <XAxis
                                    dataKey="month"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                                    dy={8}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#94A3B8', fontSize: 11 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '12px',
                                        border: '1px solid #E2E8F0',
                                        boxShadow: '0 4px 12px rgba(15,23,42,0.08)',
                                        fontSize: '12px'
                                    }}
                                />
                                <Area
                                    type="monotone"
                                    dataKey="sales"
                                    stroke="#1E90FF"
                                    strokeWidth={2.5}
                                    fillOpacity={1}
                                    fill="url(#colorSales)"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="flex min-h-[290px] flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <h3 className="mb-3 text-base font-bold text-[#0B1F3A]">Recent Sales</h3>
                    <div className="flex-1 space-y-3 overflow-auto pr-1">
                        {data?.recentSales?.length > 0 ? (
                            data.recentSales.map((sale) => (
                                <div key={sale._id} className="flex items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/70 p-2.5">
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-semibold text-[#0B1F3A]">{sale.user?.name}</p>
                                        <p className="truncate text-xs text-slate-500">{sale.plan?.name}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm font-bold text-[#0B1F3A]">Rs {(sale.premiumAmount * data.commissionRate / 100).toLocaleString()}</p>
                                        <p className="text-[10px] uppercase tracking-wide text-slate-400">Commission</p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="flex h-full flex-col items-center justify-center py-6 text-slate-400">
                                <Clock size={26} className="mb-2 opacity-30" />
                                <p className="text-sm">No sales yet.</p>
                            </div>
                        )}
                    </div>
                    <button className="mt-3 inline-flex items-center justify-center gap-1 text-xs font-semibold text-[#1E90FF] hover:underline">
                        View Leads Queue <ArrowUpRight size={13} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AgentDashboard;
