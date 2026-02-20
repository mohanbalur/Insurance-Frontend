import React, { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, CheckCircle2, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axios';

const ProfilePage = () => {
    const { user, setUser } = useAuth();
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        address: user?.address || ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                address: user.address || ''
            });
        }
    }, [user]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await axiosInstance.put('/auth/profile', formData);
            const updatedUser = response.data.data.user;

            const storedUser = JSON.parse(localStorage.getItem('user'));
            const newUserData = { ...storedUser, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(newUserData));
            setUser(newUserData);

            setMessage({ type: 'success', text: 'Profile updated successfully.' });
        } catch (error) {
            const apiMessage = error.response?.data?.message;
            const errorMsg = apiMessage || error.message || 'Failed to update profile';

            setMessage({ type: 'error', text: errorMsg });

            if (error.response?.status === 401) {
                setMessage({
                    type: 'error',
                    text: 'Session expired. Please logout and login again.'
                });
            }
        } finally {
            setLoading(false);
        }
    };

    const fieldBaseClass = 'w-full rounded-xl border bg-white px-4 py-3 text-sm text-slate-800 shadow-sm outline-none transition-all placeholder:text-slate-400';
    const editableFieldClass = `${fieldBaseClass} border-slate-200 focus:border-[#1E90FF] focus:ring-4 focus:ring-blue-100/70`;
    const readOnlyFieldClass = `${fieldBaseClass} border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed`;

    return (
        <div className="mx-auto flex min-h-[calc(100vh-11rem)] w-full max-w-5xl items-center justify-center py-6 md:py-10 animate-fadeIn">
            <div className="w-full max-w-4xl overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 md:px-6">
                    <div>
                        <h1 className="text-xl md:text-2xl font-bold text-[#0B1F3A]">My Profile</h1>
                        <p className="text-xs md:text-sm text-slate-500">Update your account details in one place.</p>
                    </div>
                    <div className="hidden sm:inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-[#1E90FF]">
                        <User size={14} />
                        {user?.role || 'USER'}
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="p-4 md:p-6">
                    {message.text && (
                        <div className={`mb-4 flex items-start gap-2 rounded-xl border px-3 py-2 text-xs md:text-sm font-medium ${message.type === 'success'
                            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                            : 'border-red-200 bg-red-50 text-red-700'
                            }`}>
                            {message.type === 'success' ? (
                                <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
                            ) : (
                                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                            )}
                            <p>{message.text}</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Full Name</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={editableFieldClass}
                                placeholder="John Doe"
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Email Address</label>
                            <div className="relative">
                                <Mail size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="email"
                                    value={formData.email}
                                    disabled
                                    className={`${readOnlyFieldClass} pl-9`}
                                />
                            </div>
                            <p className="text-[11px] text-slate-500">Email cannot be changed.</p>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Phone Number</label>
                            <div className="relative">
                                <Phone size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    className={`${editableFieldClass} pl-9`}
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>

                        <div className="space-y-2 md:col-span-2">
                            <label className="text-xs font-semibold uppercase tracking-wide text-slate-600">Home Address</label>
                            <div className="relative">
                                <MapPin size={15} className="pointer-events-none absolute left-3 top-4 text-slate-400" />
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    rows="2"
                                    className={`${editableFieldClass} min-h-[84px] resize-none pl-9`}
                                    placeholder="123 Main St, City, Country"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-4">
                        <p className="text-xs text-slate-500 hidden md:block">Profile: Active</p>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`inline-flex min-w-[170px] items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all ${loading
                                ? 'cursor-not-allowed bg-blue-400'
                                : 'bg-[#1E90FF] hover:bg-blue-600'
                                }`}
                        >
                            {loading ? (
                                <>
                                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/50 border-t-white" />
                                    <span>Saving...</span>
                                </>
                            ) : (
                                <span>Save Changes</span>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ProfilePage;
