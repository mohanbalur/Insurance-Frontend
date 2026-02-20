import React, { useState, useEffect } from 'react';
import {
    User,
    Mail,
    Phone,
    MapPin,
    Shield,
    Lock,
    Eye,
    EyeOff,
    Save,
    RefreshCw,
    CheckCircle,
    Calendar,
    Clock,
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../api/axios';
import toast from 'react-hot-toast';

// ─── Avatar Initials ───────────────────────────────────────────────────────────
const AdminAvatar = ({ name }) => {
    const initials = (name || 'A')
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);

    return (
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-[#1E90FF] to-[#0B1F3A] flex items-center justify-center text-white text-2xl font-bold shadow-lg shadow-blue-200">
            {initials}
        </div>
    );
};

// ─── Section Wrapper ───────────────────────────────────────────────────────────
const Section = ({ title, icon: Icon, children }) => (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <Icon size={16} className="text-[#1E90FF]" />
            </div>
            <h2 className="text-base font-bold text-[#0B1F3A]">{title}</h2>
        </div>
        <div className="p-6">{children}</div>
    </div>
);

// ─── Password Field ────────────────────────────────────────────────────────────
const PasswordField = ({ label, name, value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="space-y-1">
            <label className="block text-xs font-semibold text-slate-700">{label}</label>
            <div className="relative">
                <input
                    type={show ? 'text' : 'password'}
                    name={name}
                    value={value}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full px-4 py-2.5 pr-10 rounded-xl border border-slate-200 text-sm text-[#0B1F3A] placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-[#1E90FF] transition-all"
                />
                <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                    {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
            </div>
        </div>
    );
};

// ─── Main Component ────────────────────────────────────────────────────────────
const AdminProfile = () => {
    const { user, setUser } = useAuth();

    // Profile form state
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        phone: '',
        address: '',
    });
    const [profileLoading, setProfileLoading] = useState(false);

    // Password form state
    const [passwords, setPasswords] = useState({
        oldPassword: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [passwordLoading, setPasswordLoading] = useState(false);

    // Live profile from backend
    const [liveProfile, setLiveProfile] = useState(null);

    // Fetch fresh profile on mount
    useEffect(() => {
        axiosInstance
            .get('/auth/profile')
            .then((res) => {
                const u = res.data.data.user;
                setLiveProfile(u);
                setProfile({
                    name: u.name || '',
                    email: u.email || '',
                    phone: u.phone || '',
                    address: u.address || '',
                });
            })
            .catch(() => {
                // Fall back to context user
                if (user) {
                    setProfile({
                        name: user.name || '',
                        email: user.email || '',
                        phone: user.phone || '',
                        address: user.address || '',
                    });
                }
            });
    }, []);

    // ── Save Profile ────────────────────────────────────────────────────────────
    const handleProfileSave = async (e) => {
        e.preventDefault();
        if (!profile.name.trim()) {
            toast.error('Name is required');
            return;
        }
        setProfileLoading(true);
        try {
            const res = await axiosInstance.put('/auth/profile', {
                name: profile.name,
                phone: profile.phone,
                address: profile.address,
            });
            const updatedUser = res.data.data.user;

            // Sync context + localStorage
            const stored = JSON.parse(localStorage.getItem('user') || '{}');
            const merged = { ...stored, ...updatedUser };
            localStorage.setItem('user', JSON.stringify(merged));
            setUser(merged);
            setLiveProfile(updatedUser);

            toast.success('Profile updated successfully');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to update profile');
        } finally {
            setProfileLoading(false);
        }
    };

    // ── Change Password ─────────────────────────────────────────────────────────
    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!passwords.oldPassword || !passwords.newPassword) {
            toast.error('All password fields are required');
            return;
        }
        if (passwords.newPassword !== passwords.confirmPassword) {
            toast.error('New passwords do not match');
            return;
        }
        if (passwords.newPassword.length < 8) {
            toast.error('New password must be at least 8 characters');
            return;
        }
        setPasswordLoading(true);
        try {
            await axiosInstance.put('/auth/change-password', {
                oldPassword: passwords.oldPassword,
                newPassword: passwords.newPassword,
            });
            toast.success('Password changed successfully');
            setPasswords({ oldPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to change password');
        } finally {
            setPasswordLoading(false);
        }
    };

    const displayUser = liveProfile || user;

    return (
        <div className="flex flex-col space-y-6 animate-in fade-in duration-500">
            {/* Identity Card - More Compact */}
            <div className="bg-gradient-to-r from-[#0B1F3A] to-[#1a3a6b] rounded-2xl p-6 text-white flex items-center gap-6 shadow-xl border border-white/5">
                <div className="shrink-0">
                    <AdminAvatar name={displayUser?.name} />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-1">
                        <p className="text-xl font-black tracking-tight truncate">{displayUser?.name || '—'}</p>
                        <span className="inline-flex items-center gap-1.5 bg-blue-500/20 text-[#1E90FF] text-[9px] font-black px-2 py-0.5 rounded border border-blue-500/30 uppercase tracking-widest">
                            <Shield size={10} /> System Admin
                        </span>
                    </div>
                    <p className="text-blue-300/70 text-xs font-medium truncate mb-3">{displayUser?.email || '—'}</p>
                    <div className="flex items-center gap-4 flex-wrap">
                        {displayUser?.createdAt && (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-medium">
                                <Calendar size={10} className="text-blue-400" />
                                <span className="text-slate-500">Joined</span> {new Date(displayUser.createdAt).toLocaleDateString()}
                            </span>
                        )}
                        {displayUser?.lastLogin && (
                            <span className="inline-flex items-center gap-1 text-slate-400 text-[10px] font-medium pl-4 border-l border-slate-700/50">
                                <Clock size={10} className="text-blue-400" />
                                <span className="text-slate-500">Last login</span> {new Date(displayUser.lastLogin).toLocaleString()}
                            </span>
                        )}
                    </div>
                </div>
                {displayUser?.isActive !== undefined && (
                    <div className="shrink-0">
                        <span className={`inline-flex items-center gap-1 text-[9px] font-black px-3 py-1 rounded-full border shadow-sm ${displayUser.isActive ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'} uppercase tracking-widest`}>
                            <CheckCircle size={10} />
                            {displayUser.isActive ? 'Active' : 'Suspended'}
                        </span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                {/* Left Column: Profile & Credentials */}
                <div className="space-y-6">
                    <Section title="Personal Information" icon={User}>
                        <form onSubmit={handleProfileSave} className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Full Name</label>
                                    <div className="relative group">
                                        <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E90FF] transition-colors" />
                                        <input
                                            type="text"
                                            value={profile.name}
                                            onChange={(e) => setProfile((p) => ({ ...p, name: e.target.value }))}
                                            placeholder="John Admin"
                                            required
                                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/20 text-xs text-[#0B1F3A] font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Phone Number</label>
                                    <div className="relative group">
                                        <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#1E90FF] transition-colors" />
                                        <input
                                            type="tel"
                                            value={profile.phone}
                                            onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                                            placeholder="+91 98765 43210"
                                            className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/20 text-xs text-[#0B1F3A] font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1.5">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Address</label>
                                <div className="relative group">
                                    <MapPin size={14} className="absolute left-3 top-2.5 text-slate-400 group-focus-within:text-[#1E90FF] transition-colors" />
                                    <textarea
                                        value={profile.address}
                                        onChange={(e) => setProfile((p) => ({ ...p, address: e.target.value }))}
                                        rows={2}
                                        placeholder="Enter operational address"
                                        className="w-full pl-9 pr-3 py-2 rounded-lg border border-slate-200 bg-slate-50/20 text-xs text-[#0B1F3A] font-semibold placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] transition-all resize-none"
                                    />
                                </div>
                            </div>

                            {/* Integrated Access Credentials - Denser Markout */}
                            <div className="pt-2 border-t border-slate-100 flex gap-4">
                                <div className="flex-1 p-2 bg-slate-50 rounded-lg border border-slate-200/50">
                                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Primary Email</label>
                                    <div className="flex items-center gap-2">
                                        <Mail size={12} className="text-[#1E90FF]" />
                                        <span className="text-[11px] text-[#0B1F3A] font-bold truncate">{profile.email}</span>
                                    </div>
                                </div>
                                <div className="flex-1 p-2 bg-slate-50 rounded-lg border border-slate-200/50">
                                    <label className="block text-[8px] font-black text-slate-400 uppercase tracking-widest mb-0.5">Namespace</label>
                                    <div className="flex items-center gap-2">
                                        <Shield size={12} className="text-slate-400" />
                                        <span className="text-[11px] text-slate-600 font-bold truncate">Admin.Root.Ops</span>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={profileLoading}
                                    className="w-full sm:w-auto px-6 py-2 bg-[#1E90FF] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-blue-600 transition-all shadow-md shadow-blue-500/10 active:scale-95 disabled:opacity-50"
                                >
                                    {profileLoading ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                                    {profileLoading ? 'Updating' : 'Save Details'}
                                </button>
                            </div>
                        </form>
                    </Section>
                </div>

                {/* Right Column: Security */}
                <div className="space-y-6">
                    <Section title="Security Settings" icon={Lock}>
                        <form onSubmit={handlePasswordChange} className="space-y-4">
                            <PasswordField
                                label="CURRENT PASSWORD"
                                name="oldPassword"
                                value={passwords.oldPassword}
                                onChange={(e) => setPasswords((p) => ({ ...p, oldPassword: e.target.value }))}
                                placeholder="Verification required"
                            />

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <PasswordField
                                    label="NEW PASSWORD"
                                    name="newPassword"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords((p) => ({ ...p, newPassword: e.target.value }))}
                                    placeholder="Min. 8 chars"
                                />
                                <PasswordField
                                    label="CONFIRM PASSWORD"
                                    name="confirmPassword"
                                    value={passwords.confirmPassword}
                                    onChange={(e) =>
                                        setPasswords((p) => ({ ...p, confirmPassword: e.target.value }))
                                    }
                                    placeholder="Match exactly"
                                />
                            </div>

                            {/* Optimized Strength Hint */}
                            {passwords.newPassword && (
                                <div className="space-y-1.5">
                                    <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                                        <span className="text-slate-400">Security</span>
                                        <span className={passwords.newPassword.length < 8 ? 'text-rose-500' : passwords.newPassword.length < 12 ? 'text-amber-500' : 'text-emerald-500'}>
                                            {passwords.newPassword.length < 8 ? 'Weak' : passwords.newPassword.length < 12 ? 'Fair' : 'Strong'}
                                        </span>
                                    </div>
                                    <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full transition-all duration-500 ${passwords.newPassword.length < 8
                                                ? 'w-1/3 bg-rose-500'
                                                : passwords.newPassword.length < 12
                                                    ? 'w-2/3 bg-amber-500'
                                                    : 'w-full bg-emerald-500'
                                                }`}
                                        />
                                    </div>
                                </div>
                            )}

                            <div className="flex justify-end pt-2">
                                <button
                                    type="submit"
                                    disabled={passwordLoading}
                                    className="w-full sm:w-auto px-6 py-2 bg-[#0B1F3A] text-white rounded-lg font-bold text-xs flex items-center justify-center gap-2 hover:bg-slate-700 transition-all shadow-md active:scale-95 disabled:opacity-50"
                                >
                                    {passwordLoading ? <RefreshCw size={14} className="animate-spin" /> : <Lock size={14} />}
                                    {passwordLoading ? 'Verifying' : 'Change Password'}
                                </button>
                            </div>
                        </form>
                    </Section>
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;
