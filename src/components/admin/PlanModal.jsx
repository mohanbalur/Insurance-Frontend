import React, { useState, useEffect } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const PlanModal = ({ isOpen, onClose, onSubmit, plan }) => {
    const [categories, setCategories] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        type: '',
        premium: '',
        coverage: '',
        durationMonths: '',
        isActive: true
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await adminService.adminGetPlanTypes({ isActive: 'true' });
                setCategories(response.data?.planTypes || []);
                if (!plan && response.data?.planTypes?.length > 0) {
                    setFormData(prev => ({ ...prev, type: response.data.planTypes[0].code }));
                }
            } catch (error) {
                console.error('Failed to fetch categories:', error);
            }
        };

        if (isOpen) {
            fetchCategories();
        }
    }, [isOpen, plan]);

    useEffect(() => {
        if (plan) {
            setFormData({
                name: plan.name,
                description: plan.description,
                type: plan.type,
                premium: plan.premium,
                coverage: plan.coverage,
                durationMonths: plan.durationMonths,
                isActive: plan.isActive
            });
        }
    }, [plan, isOpen]);

    if (!isOpen) return null;

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(formData);
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : (type === 'number' ? Number(value) : value)
        }));
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
            <div className="bg-[#162031] border border-slate-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                    <div>
                        <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                            {plan ? 'Edit Insurance Plan' : 'Configure New Plan'}
                        </h3>
                        <p className="text-xs text-slate-500 mt-1 uppercase font-bold tracking-widest">
                            Product Designer & Risk Configuration
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-xl transition-all">
                        <X size={24} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-8 space-y-6 overflow-y-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Plan Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-blue-500/40 outline-none"
                                placeholder="e.g. LifeGuard Platinum"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                required
                                rows="3"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-blue-500/40 outline-none resize-none"
                                placeholder="Details about coverage and benefits..."
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Insurance Type</label>
                            <select
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-blue-500/40 outline-none"
                            >
                                {categories.map(t => <option key={t._id} value={t.code}>{t.name}</option>)}
                            </select>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Monthly Premium (₹)</label>
                            <input
                                type="number"
                                name="premium"
                                value={formData.premium}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-blue-500/40 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Coverage Amount (₹)</label>
                            <input
                                type="number"
                                name="coverage"
                                value={formData.coverage}
                                onChange={handleChange}
                                required
                                min="0"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-blue-500/40 outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Duration (Months)</label>
                            <input
                                type="number"
                                name="durationMonths"
                                value={formData.durationMonths}
                                onChange={handleChange}
                                required
                                min="1"
                                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 focus:ring-2 focus:ring-blue-500/40 outline-none"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl">
                        <input
                            type="checkbox"
                            name="isActive"
                            checked={formData.isActive}
                            onChange={handleChange}
                            id="isActive"
                            className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-blue-500 focus:ring-blue-500/40"
                        />
                        <label htmlFor="isActive" className="text-sm font-bold text-slate-300 uppercase tracking-wide cursor-pointer">
                            Active & Publicly Available
                        </label>
                    </div>
                </form>

                {/* Footer */}
                <div className="px-8 py-6 bg-slate-900/50 border-t border-slate-800 flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2 text-slate-500">
                        <AlertCircle size={16} />
                        <span className="text-[10px] uppercase font-bold tracking-widest">Changes affect new purchases only</span>
                    </div>
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold rounded-xl text-sm transition-all"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSubmit}
                            className="px-6 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-xl text-sm transition-all flex items-center gap-2 shadow-lg shadow-blue-500/20"
                        >
                            <Save size={18} />
                            {plan ? 'Update Plan' : 'Launch Plan'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanModal;
