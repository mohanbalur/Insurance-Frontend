import React from 'react';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, trend, trendValue, subtitle, loading }) => {
    if (loading) {
        return (
            <div className="bg-[#162031] border border-slate-800 p-6 rounded-2xl animate-pulse">
                <div className="flex justify-between items-start">
                    <div className="space-y-3">
                        <div className="h-4 w-24 bg-slate-700/50 rounded"></div>
                        <div className="h-8 w-32 bg-slate-700/50 rounded"></div>
                    </div>
                    <div className="w-12 h-12 bg-slate-700/50 rounded-xl"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-[#162031] border border-slate-800 p-6 rounded-2xl hover:border-blue-500/50 transition-all duration-300 group shadow-lg shadow-black/20">
            <div className="flex justify-between items-start">
                <div>
                    <p className="text-sm font-medium text-slate-400 mb-1">{title}</p>
                    <h3 className="text-2xl font-bold text-white tracking-tight">{value}</h3>

                    {trendValue && (
                        <div className="flex items-center mt-2 space-x-1">
                            {trend === 'up' ? (
                                <ArrowUpRight size={14} className="text-green-400" />
                            ) : (
                                <ArrowDownRight size={14} className="text-red-400" />
                            )}
                            <span className={`text-xs font-semibold ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
                                {trendValue}
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">vs last month</span>
                        </div>
                    )}

                    {subtitle && !trendValue && (
                        <p className="text-[10px] text-slate-500 mt-2 font-medium uppercase tracking-wider">{subtitle}</p>
                    )}
                </div>

                <div className="w-12 h-12 bg-blue-500/10 rounded-xl flex items-center justify-center text-[#1E90FF] group-hover:bg-[#1E90FF] group-hover:text-white transition-all duration-300 shadow-inner">
                    <Icon size={24} />
                </div>
            </div>
        </div>
    );
};

export default StatCard;
