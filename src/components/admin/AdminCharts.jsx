import React from 'react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend,
    BarChart, Bar, Tooltip as BarTooltip
} from 'recharts';

/**
 * RevenueAreaChart
 * Visualizes monthly revenue growth with high-contrast gradients.
 */
export const RevenueAreaChart = ({ data, loading }) => {
    if (loading) return <div className="h-full w-full bg-slate-800/20 rounded-2xl animate-pulse" />;

    // Safety check for null or empty data
    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-800/5 rounded-2xl border border-dashed border-slate-800/20">
                <span className="text-slate-500 text-xs font-medium italic">No revenue data available</span>
            </div>
        );
    }

    // Format data for Recharts (e.g., from { _id: { year, month }, revenue })
    const chartData = data.map(item => ({
        name: `${item._id.month}/${item._id.year}`,
        value: item.revenue
    })).reverse();

    return (
        <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#1E90FF" stopOpacity={0.3} />
                        <stop offset="95%" stopColor="#1E90FF" stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis
                    dataKey="name"
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    dy={10}
                />
                <YAxis
                    stroke="#64748b"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                />
                <Tooltip
                    contentStyle={{ backgroundColor: '#0B1F3A', border: '1px solid #1e293b', borderRadius: '12px', color: '#fff' }}
                    itemStyle={{ color: '#1E90FF' }}
                />
                <Area
                    type="monotone"
                    dataKey="value"
                    stroke="#1E90FF"
                    strokeWidth={3}
                    fillOpacity={1}
                    fill="url(#colorRevenue)"
                    animationDuration={1500}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

/**
 * ClaimsStatusChart
 * Pie chart showing status distribution.
 */
export const ClaimsStatusChart = ({ data, loading }) => {
    if (loading) return <div className="h-full w-full bg-slate-800/20 rounded-2xl animate-pulse" />;

    const COLORS = {
        'PENDING': '#f59e0b',
        'UNDER_REVIEW': '#3b82f6',
        'APPROVED': '#10b981',
        'REJECTED': '#ef4444'
    };

    // Safety check for null or empty data
    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-800/5 rounded-2xl border border-dashed border-slate-800/20">
                <span className="text-slate-500 text-xs font-medium italic">No claims data available</span>
            </div>
        );
    }

    const chartData = data.map(item => ({
        name: item._id,
        value: item.count,
        color: COLORS[item._id] || '#64748b'
    }));

    return (
        <ResponsiveContainer width="100%" height="100%">
            <PieChart>
                <Pie
                    data={chartData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    animationDuration={1000}
                >
                    {chartData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                </Pie>
                <Tooltip
                    contentStyle={{ backgroundColor: '#0B1F3A', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            </PieChart>
        </ResponsiveContainer>
    );
};

/**
 * PlanDistributionChart
 * Bar chart showing top 5 plans.
 */
export const PlanDistributionChart = ({ data, loading }) => {
    if (loading) return <div className="h-full w-full bg-slate-800/20 rounded-2xl animate-pulse" />;

    // Safety check for null or empty data
    if (!data || data.length === 0) {
        return (
            <div className="h-full w-full flex items-center justify-center bg-slate-800/5 rounded-2xl border border-dashed border-slate-800/20">
                <span className="text-slate-500 text-xs font-medium italic">No plan distribution data</span>
            </div>
        );
    }

    return (
        <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 40, right: 30 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={true} vertical={false} />
                <XAxis type="number" hide />
                <YAxis
                    dataKey="name"
                    type="category"
                    stroke="#64748b"
                    fontSize={11}
                    axisLine={false}
                    tickLine={false}
                    width={100}
                />
                <BarTooltip
                    cursor={{ fill: '#1e293b', opacity: 0.4 }}
                    contentStyle={{ backgroundColor: '#0B1F3A', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar
                    dataKey="count"
                    fill="#1E90FF"
                    radius={[0, 4, 4, 0]}
                    barSize={20}
                    animationDuration={1200}
                />
            </BarChart>
        </ResponsiveContainer>
    );
};
