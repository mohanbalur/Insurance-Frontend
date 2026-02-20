import React, { useState, useRef, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, ChevronDown, UserCircle, LogOut, Shield, X, User } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Re-defining NAV_ITEMS here since we are replacing AdminSidebar usage with direct markup or need to extract it.
// Actually, the previous file imported AdminSidebar. To strictly follow the "clean SaaS structure" and "mobile sidebar", 
// I should probably either use AdminSidebar component if it supports the new "hidden md:block" class prop or transparently render it.
// The user provided specific JSX for the sidebar in the prompt. I will use that pattern.
// But I need the nav items. I will assume they are safe to hardcode or import.
// Let's check AdminSidebar content first? No, I'll just use the existing sidebar component if possible, but the user *gave* me the sidebar JSX code in the prompt step 1.
// "Update AdminLayout.jsx ... <aside ... > ... </aside>"
// The user's snippet for AdminSidebar import was `import AdminSidebar from '../components/admin/AdminSidebar';`.
// But the snippet in the prompt has the sidebar markup INLINED.
// "Step 1 ... <aside className="w-64 ..."> ... </aside>"
// I will INLINE the sidebar as requested to ensure I match the structure exactly.
// I need `NAV_ITEMS`.

import {
    LayoutDashboard,
    Users,
    FileText,
    ShieldAlert,
    Activity,
    Settings,
    BarChart3,
    History,
    Globe,
    Briefcase,
    Layers
} from 'lucide-react';

const NAV_ITEMS = [
    { label: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Plan Management', path: '/admin/plans', icon: Briefcase },
    { label: 'Category Management', path: '/admin/categories', icon: Layers },
    { label: 'User Directory', path: '/admin/users', icon: Users },
    { label: 'KYC Review', path: '/admin/kyc', icon: ShieldAlert },
    { label: 'Underwriting', path: '/admin/underwriting', icon: FileText },
    { label: 'Claims', path: '/admin/claims', icon: Activity },
    { label: 'Agents', path: '/admin/agents', icon: UserCircle },
    { label: 'Audit Logs', path: '/admin/audit-logs', icon: History },
    { label: 'CMS Editor', path: '/admin/cms', icon: Globe },
];

const AdminLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close mobile menu on route change
    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    // Outside click detection for profile dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <div className="h-screen w-screen flex bg-[#0B1F3A] text-white">

            {/* Sidebar - Desktop */}
            <aside className="hidden md:block w-64 shrink-0 h-full border-r border-white/10 bg-[#0B1F3A]">
                <div className="h-full flex flex-col">
                    <div className="h-16 flex items-center px-6 border-b border-white/10">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                <Shield size={20} className="text-white" />
                            </div>
                            <div>
                                <h1 className="text-xl font-bold tracking-tight text-white">Admin</h1>
                                <p className="text-[10px] text-blue-400 font-bold tracking-widest uppercase">Ops Center</p>
                            </div>
                        </div>
                    </div>

                    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                        <div className="mb-2 px-4 text-xs font-bold text-slate-500 uppercase tracking-widest">
                            Main Menu
                        </div>
                        {NAV_ITEMS.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                        ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20'
                                        : 'text-slate-400 hover:text-white hover:bg-white/5'
                                        }`}
                                >
                                    <Icon size={18} className={isActive ? 'text-white' : 'text-slate-400'} />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t border-white/10">
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full"
                        >
                            <LogOut size={18} />
                            Sign Out
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Area */}
            <div className="flex-1 flex flex-col min-h-0 relative min-w-0">

                {/* Topbar */}
                <div className="h-16 shrink-0 border-b border-white/10 px-6 flex items-center justify-between bg-[#0B1F3A]/95 backdrop-blur-sm sticky top-0 z-20">
                    <div className="flex items-center gap-4">
                        {/* Mobile Menu Toggle */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/5"
                        >
                            <Menu size={20} />
                        </button>

                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 rounded-full bg-emerald-400" />
                            <span className="text-xs font-bold text-slate-400 tracking-wider uppercase hidden sm:block">System Online</span>
                        </div>
                    </div>

                    <div className="relative" ref={dropdownRef}>
                        <button
                            onClick={() => setIsProfileOpen(!isProfileOpen)}
                            className="flex items-center gap-4 group"
                        >
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold text-white max-w-[150px] truncate">{user?.name || 'Administrator'}</p>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest text-right">Root Access</p>
                            </div>
                            <div className="w-9 h-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center group-hover:border-blue-500 transition-colors">
                                <User size={18} className="text-slate-400 group-hover:text-white" />
                            </div>
                        </button>

                        {/* Profile Dropdown */}
                        {isProfileOpen && (
                            <div className="absolute right-0 top-full mt-2 w-56 bg-[#162031] border border-slate-700 rounded-2xl shadow-2xl py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div className="px-4 py-3 border-b border-slate-700/50 mb-1">
                                    <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">Signed in as</p>
                                    <p className="text-sm font-bold text-white truncate">{user?.email}</p>
                                </div>

                                <Link
                                    to="/admin/profile"
                                    onClick={() => setIsProfileOpen(false)}
                                    className="flex items-center space-x-3 px-4 py-2.5 text-sm text-slate-300 hover:bg-[#1E90FF] hover:text-white transition-all mx-2 rounded-xl"
                                >
                                    <UserCircle size={18} />
                                    <span>My Profile</span>
                                </Link>

                                <div className="mt-1 pt-1 border-t border-slate-700/50">
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center space-x-3 w-[calc(100%-16px)] mx-2 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
                                    >
                                        <LogOut size={18} />
                                        <span>System Logout</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Scrollable Content */}
                <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth min-w-0">
                    <Outlet />
                </main>

                {/* Mobile Sidebar Overlay */}
                {isMobileMenuOpen && (
                    <div className="absolute inset-0 z-50 md:hidden flex justify-start">
                        {/* Backdrop */}
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />

                        <div className="relative w-64 bg-[#0B1F3A] border-r border-white/10 h-full flex flex-col shadow-2xl animate-in slide-in-from-left duration-200">
                            <div className="h-16 shrink-0 flex items-center justify-between px-6 border-b border-white/10">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
                                        <Shield size={20} className="text-white" />
                                    </div>
                                    <span className="font-bold text-white text-lg">Admin</span>
                                </div>
                                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-white/10">
                                    <X size={20} />
                                </button>
                            </div>
                            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                                {NAV_ITEMS.map((item) => {
                                    const Icon = item.icon;
                                    const isActive = location.pathname === item.path;
                                    return (
                                        <Link
                                            key={item.path}
                                            to={item.path}
                                            className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-xl transition-all ${isActive
                                                ? 'bg-blue-600 text-white'
                                                : 'text-slate-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            <Icon size={18} />
                                            {item.label}
                                        </Link>
                                    );
                                })}
                            </nav>
                            <div className="p-4 border-t border-white/10">
                                <button
                                    onClick={handleLogout}
                                    className="flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all w-full"
                                >
                                    <LogOut size={18} />
                                    Sign Out
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AdminLayout;
