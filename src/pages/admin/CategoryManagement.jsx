import React, { useState, useEffect } from 'react';
import {
    Plus,
    Search,
    Edit2,
    Trash2,
    Shield,
    Activity,
    CheckCircle2,
    X,
    Save,
    AlertCircle,
    Info
} from 'lucide-react';
import adminService from '../../services/adminService';
import toast from 'react-hot-toast';

const CategoryManagement = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [formData, setFormData] = useState({
        name: '',
        code: '',
        description: '',
        icon: 'Shield',
        isActive: true
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const response = await adminService.adminGetPlanTypes();
            setCategories(response.data?.planTypes || []);
        } catch (error) {
            toast.error('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    const handleOpenModal = (category = null) => {
        if (category) {
            setSelectedCategory(category);
            setFormData({
                name: category.name,
                code: category.code,
                description: category.description,
                icon: category.icon || 'Shield',
                isActive: category.isActive
            });
        } else {
            setSelectedCategory(null);
            setFormData({
                name: '',
                code: '',
                description: '',
                icon: 'Shield',
                isActive: true
            });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (selectedCategory) {
                await adminService.adminUpdatePlanType(selectedCategory._id, formData);
                toast.success('Category updated successfully');
            } else {
                await adminService.adminCreatePlanType(formData);
                toast.success('Category created successfully');
            }
            setIsModalOpen(false);
            fetchCategories();
        } catch (error) {
            toast.error(error.response?.data?.message || 'Operation failed');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this category? Plans using this category might be affected.')) return;
        try {
            await adminService.adminDeletePlanType(id);
            toast.success('Category deleted');
            fetchCategories();
        } catch (error) {
            toast.error('Deletion failed');
        }
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-white flex items-center gap-3">
                        Category Management
                        <span className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs rounded-full border border-purple-500/30">
                            {categories.length} TYPES
                        </span>
                    </h1>
                    <p className="text-slate-400 mt-1">Manage dynamic insurance types and product categories.</p>
                </div>

                <button
                    onClick={() => handleOpenModal()}
                    className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-purple-500/20 active:scale-95"
                >
                    <Plus size={20} />
                    Add New Category
                </button>
            </div>

            {/* Categories Table */}
            <div className="bg-[#162031] border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[800px]">
                        <thead>
                            <tr className="bg-slate-900/50 border-b border-slate-800">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Category</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Code</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Description</th>
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
                            ) : categories.map((cat) => (
                                <tr key={cat._id} className="hover:bg-slate-800/30 transition-colors group">
                                    <td className="px-8 py-6">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                                                <Shield size={18} />
                                            </div>
                                            <span className="font-bold text-slate-200">{cat.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-8 py-6">
                                        <span className="px-2 py-1 bg-slate-800 text-slate-400 rounded text-xs font-mono">{cat.code}</span>
                                    </td>
                                    <td className="px-8 py-6 max-w-xs truncate text-sm text-slate-500">
                                        {cat.description}
                                    </td>
                                    <td className="px-8 py-6">
                                        {cat.isActive ? (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20 uppercase tracking-widest">Active</span>
                                        ) : (
                                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20 uppercase tracking-widest">Disabled</span>
                                        )}
                                    </td>
                                    <td className="px-8 py-6 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button onClick={() => handleOpenModal(cat)} className="p-2 text-slate-400 hover:text-purple-400 hover:bg-purple-400/10 rounded-lg transition-all">
                                                <Edit2 size={16} />
                                            </button>
                                            <button onClick={() => handleDelete(cat._id)} className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                    <div className="bg-[#162031] border border-slate-800 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden">
                        <div className="px-8 py-6 border-b border-slate-800 flex items-center justify-between">
                            <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                                {selectedCategory ? 'Edit Category' : 'New Category'}
                            </h3>
                            <button onClick={() => setIsModalOpen(false)} className="p-2 text-slate-500 hover:text-white rounded-xl">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Display Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200"
                                        placeholder="e.g. Cyber Insurance"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">URL Code (Uppercase)</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.code}
                                        onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 font-mono"
                                        placeholder="CYBER"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                                    <textarea
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 px-4 text-slate-200 resize-none"
                                        rows="3"
                                        placeholder="Explain what this category covers..."
                                    />
                                </div>
                                <div className="flex items-center gap-3 p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl">
                                    <input
                                        type="checkbox"
                                        id="catActive"
                                        checked={formData.isActive}
                                        onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                        className="w-5 h-5 rounded border-slate-700 bg-slate-800 text-purple-500"
                                    />
                                    <label htmlFor="catActive" className="text-sm font-bold text-slate-300 uppercase tracking-wide cursor-pointer">
                                        Allow plans in this category
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl transition-all shadow-lg flex items-center justify-center gap-2"
                            >
                                <Save size={18} />
                                {selectedCategory ? 'Update Category' : 'Create Category'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CategoryManagement;
