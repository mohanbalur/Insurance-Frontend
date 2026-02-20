import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Filter,
    Shield,
    TrendingUp,
    Activity,
    AlertCircle,
    CheckCircle2
} from 'lucide-react';
import adminService from '../../services/adminService';
import PlanModal from '../../components/admin/PlanModal';
import toast from 'react-hot-toast';

const PlanManagement = () => {
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [filter, setFilter] = useState('ALL'); // ALL, ACTIVE, INACTIVE, DELETED

    useEffect(() => {
        fetchPlans();
    }, []);

    const fetchPlans = async () => {
        setLoading(true);
        try {
            const response = await adminService.adminGetPlans();
            setPlans(response.data?.plans || []);
        } catch (error) {
            toast.error('Failed to load insurance plans');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateOrUpdate = async (formData) => {
        try {
            if (selectedPlan) {
                await adminService.adminUpdatePlan(selectedPlan._id, formData);
                toast.success('Plan updated successfully');
            } else {
                await adminService.adminCreatePlan(formData);
                toast.success('New plan created successfully');
            }
            setIsModalOpen(false);
            fetchPlans();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Action failed');
        }
    };

    const handleDelete = async (planId) => {
        if (!window.confirm('Are you sure you want to delete this plan? This will hide it from new users but preserve it for existing policyholders.')) return;

        try {
            await adminService.adminDeletePlan(planId);
            toast.success('Plan soft-deleted successfully');
            fetchPlans();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    const filteredPlans = plans.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.type.toLowerCase().includes(searchQuery.toLowerCase());

        if (filter === 'ACTIVE') return matchesSearch && p.isActive && !p.isDeleted;
        if (filter === 'INACTIVE') return matchesSearch && !p.isActive && !p.isDeleted;
        if (filter === 'DELETED') return matchesSearch && p.isDeleted;
        return matchesSearch;
    });

    const stats = {
        total: plans.length,
        active: plans.filter(p => p.isActive && !p.isDeleted).length,
        deleted: plans.filter(p => p.isDeleted).length
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Plan Management
                        <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs rounded-full border border-blue-500/30">
                            {stats.active} ACTIVE PRODUCTS
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-1">Configure and monitor insurance products across the platform.</p>
                </div>

                <button
                    onClick={() => {
                        setSelectedPlan(null);
                        setIsModalOpen(true);
                    }}
                    className="flex items-center gap-2 px-6 py-3 bg-[#1E90FF] hover:bg-blue-600 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    Create New Plan
                </button>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                    { label: 'Total Products', val: stats.total, icon: Activity, color: 'blue' },
                    { label: 'Active Coverage', val: stats.active, icon: TrendingUp, color: 'emerald' },
                    { label: 'Archived Versions', val: stats.deleted, icon: Shield, color: 'slate' }
                ].map((s, i) => (
                    <div key={i} className="bg-[#162031] border border-slate-800 p-4 rounded-2xl flex items-center gap-4">
                        <div className={`p-2.5 bg-${s.color}-500/10 rounded-xl text-${s.color}-400 shrink-0`}>
                            <s.icon size={20} />
                        </div>
                        <div className="min-w-0">
                            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider truncate">{s.label}</p>
                            <p className="text-xl font-bold text-white tracking-tight">{s.val}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
                    <input
                        type="text"
                        placeholder="Search products by name or type..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-[#162031] border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-slate-200 placeholder:text-slate-600 focus:ring-2 focus:ring-blue-500/40 focus:border-blue-500 outline-none transition-all shadow-xl"
                    />
                </div>
                <div className="flex items-center gap-2 bg-[#162031] border border-slate-800 p-1.5 rounded-2xl whitespace-nowrap overflow-x-auto">
                    {['ALL', 'ACTIVE', 'INACTIVE', 'DELETED'].map((f) => (
                        <button
                            key={f}
                            onClick={() => setFilter(f)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${filter === f ? 'bg-slate-700 text-white shadow-inner' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {f}
                        </button>
                    ))}
                </div>
            </div>

            {/* Plans Table */}
            <div className="bg-[#162031] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Product Detail</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Financials</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Duration</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/50">
                            {loading ? (
                                Array(3).fill(0).map((_, i) => (
                                    <tr key={i} className="animate-pulse">
                                        <td colSpan="5" className="px-8 py-6"><div className="h-12 bg-slate-800/50 rounded-xl" /></td>
                                    </tr>
                                ))
                            ) : filteredPlans.length > 0 ? (
                                filteredPlans.map((plan) => (
                                    <tr key={plan._id} className={`hover:bg-slate-800/30 transition-colors group ${plan.isDeleted ? 'opacity-60 grayscale' : ''}`}>
                                        <td className="px-8 py-6">
                                            <div className="flex flex-col">
                                                <span className="font-bold text-slate-200 uppercase tracking-tight">{plan.name}</span>
                                                <span className="text-[10px] text-blue-400 font-bold uppercase tracking-wider mt-0.5">{plan.type}</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-bold text-emerald-400">₹{plan.premium.toLocaleString()} /mo</span>
                                                <span className="text-[10px] text-slate-500 font-bold uppercase">₹{plan.coverage.toLocaleString()} Coverage</span>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            <span className="text-sm text-slate-300 font-medium">{plan.durationMonths} Months</span>
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap">
                                            {plan.isDeleted ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-500/10 text-slate-500 border border-slate-500/20 uppercase tracking-widest">Deleted</span>
                                            ) : plan.isActive ? (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest">Active</span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest">Inactive</span>
                                            )}
                                        </td>
                                        <td className="px-8 py-6 whitespace-nowrap text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    disabled={plan.isDeleted}
                                                    onClick={() => {
                                                        setSelectedPlan(plan);
                                                        setIsModalOpen(true);
                                                    }}
                                                    className="p-2 text-slate-400 hover:text-blue-400 hover:bg-blue-400/10 rounded-lg transition-all disabled:opacity-30"
                                                >
                                                    <Edit2 size={16} />
                                                </button>
                                                <button
                                                    disabled={plan.isDeleted}
                                                    onClick={() => handleDelete(plan._id)}
                                                    className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all disabled:opacity-30"
                                                >
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="5" className="px-8 py-20 text-center text-slate-500">
                                        No insurance plans found matching your criteria.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <PlanModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSubmit={handleCreateOrUpdate}
                plan={selectedPlan}
            />
        </div>
    );
};

export default PlanManagement;
