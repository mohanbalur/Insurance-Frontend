import React, { useState, useEffect } from 'react';
import {
    Users,
    ShieldCheck,
    IndianRupee,
    Activity,
    AlertCircle
} from 'lucide-react';
import adminService from '../../services/adminService';
import StatCard from '../../components/admin/StatCard';
import {
    RevenueAreaChart,
    ClaimsStatusChart
} from '../../components/admin/AdminCharts';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState({
        summary: {},
        revenue: [],
        claims: [],
        policies: [],
        revenueMetrics: { total: 0, last30: 0 }
    });

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        setLoading(true);
        try {
            const [summary, revenue, claims, policies] = await Promise.all([
                adminService.getDashboardSummary(),
                adminService.getRevenueReport(),
                adminService.getClaimsReport(),
                adminService.getPolicyReport()
            ]);

            setData({
                summary,
                revenue: revenue.monthlyRevenue,
                claims: claims.claimsByStatus,
                policies: policies.top5MostPurchasedPlans,
                revenueMetrics: {
                    total: revenue.totalRevenue,
                    last30: revenue.last30DaysRevenue
                }
            });
        } catch (error) {
            console.error('Dashboard Load Error:', error);
            toast.error('Failed to load operational analytics');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
            {/* Header - More Compact */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                    <h1 className="text-2xl font-black tracking-tight text-white">Ops Control Center</h1>
                    <p className="text-slate-500 mt-0.5 text-[11px] font-medium uppercase tracking-wider">Operational Health Monitor</p>
                </div>
                <button
                    onClick={fetchDashboardData}
                    className="px-3 py-1.5 bg-slate-800/50 hover:bg-slate-700 text-slate-300 text-[11px] font-bold rounded-lg border border-slate-700/50 transition-all flex items-center space-x-2 active:scale-95"
                >
                    <Activity size={12} />
                    <span>REFRESH DATA</span>
                </button>
            </div>

            {/* Top Level Stats - Tighter Gap */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <StatCard
                    title="Gross Revenue"
                    value={`₹${(data.revenueMetrics?.total || 0).toLocaleString()}`}
                    icon={IndianRupee}
                    subtitle="Lifetime Collection"
                    loading={loading}
                    className="p-4"
                />
                <StatCard
                    title="Active Policies"
                    value={data.summary?.activePolicies || 0}
                    icon={ShieldCheck}
                    subtitle={`${data.summary?.totalPolicies || 0} Total`}
                    loading={loading}
                    className="p-4"
                />
                <StatCard
                    title="Pending Claims"
                    value={data.summary?.pendingClaims || 0}
                    icon={AlertCircle}
                    trend={data.summary?.pendingClaims > 5 ? 'up' : 'down'}
                    trendValue={data.summary?.pendingClaims > 0 ? "ACTION" : "CLEAR"}
                    loading={loading}
                    className="p-4"
                />
                <StatCard
                    title="Customer Base"
                    value={data.summary?.totalUsers || 0}
                    icon={Users}
                    subtitle={`${data.summary?.approvedAgents || 0} Agents`}
                    loading={loading}
                    className="p-4"
                />
            </div>

            {/* Charts Grid - More Compact Payout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Revenue Growth - 2/3 Width */}
                <div className="lg:col-span-2 bg-[#162031] border border-slate-800 rounded-2xl p-6 flex flex-col shadow-xl">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h3 className="text-sm font-black text-white uppercase tracking-wider">Revenue Trends</h3>
                            <p className="text-[10px] text-slate-500 font-bold">Platform growth trajectory</p>
                        </div>
                        <div className="px-2 py-0.5 bg-blue-500/10 text-blue-400 text-[9px] font-black rounded border border-blue-500/20 uppercase tracking-widest">
                            Live
                        </div>
                    </div>
                    <div className="h-64 w-full">
                        <RevenueAreaChart data={data.revenue} loading={loading} />
                    </div>
                </div>

                {/* Claim Distribution - 1/3 Width */}
                <div className="bg-[#162031] border border-slate-800 rounded-2xl p-6 flex flex-col shadow-xl">
                    <h3 className="text-sm font-black text-white uppercase tracking-wider mb-0.5">Claim Pipeline</h3>
                    <p className="text-[10px] text-slate-500 font-bold mb-6">Status distribution</p>
                    <div className="h-56 w-full">
                        <ClaimsStatusChart data={data.claims} loading={loading} />
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800">
                        <div className="flex justify-between items-center text-[10px] font-bold">
                            <span className="text-slate-500 uppercase tracking-widest">Total Payouts</span>
                            <span className="text-white">₹{((data.summary?.approvedClaims || 0) * 15000).toLocaleString()}+</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
