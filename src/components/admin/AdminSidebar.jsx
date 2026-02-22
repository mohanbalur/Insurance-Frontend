import React from 'react';
import { Link, NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    UserCheck,
    FileText,
    AlertCircle,
    Package,
    UserCog,
    Users,
    History,
    Globe,
    Shield as ShieldIcon,
    Layers,
    X
} from 'lucide-react';

const AdminSidebar = ({ isOpen, onClose }) => {
    const navItems = [
        { label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard' },
        { label: 'Plan Management', icon: Package, path: '/admin/plans' },
        { label: 'Category Management', icon: Layers, path: '/admin/categories' },
        { label: 'User Directory', icon: Users, path: '/admin/users' },
        { label: 'KYC Review', icon: UserCheck, path: '/admin/kyc' },
        { label: 'Underwriting', icon: FileText, path: '/admin/policies' },
        { label: 'Claims', icon: AlertCircle, path: '/admin/claims' },
        { label: 'Agents', icon: UserCog, path: '/admin/agents' },
        { label: 'Audit Logs', icon: History, path: '/admin/audit' },
        { label: 'CMS Editor', icon: Globe, path: '/admin/cms' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300"
                    onClick={onClose}
                />
            )}

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-64 bg-[#0B1F3A] flex flex-col text-white shadow-2xl transition-transform duration-300 ease-in-out
                md:relative md:translate-x-0
                ${isOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                {/* Branding */}
                <div className="p-6 border-b border-slate-700/50 flex items-center justify-between">
                    <Link
                        to="/admin/dashboard"
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => {
                            if (window.innerWidth < 768) onClose();
                        }}
                    >
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <ShieldIcon className="text-white w-5 h-5" />
                        </div>
                        <div>
                            <h1 className="text-white font-bold text-lg">Admin</h1>
                            <p className="text-xs text-gray-400">OPS CENTER</p>
                        </div>
                    </Link>
                    {/* Mobile Close Button */}
                    <button onClick={onClose} className="md:hidden p-2 text-slate-400 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 mt-6 px-4 space-y-1 overflow-y-auto custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            onClick={() => {
                                if (window.innerWidth < 768) onClose();
                            }}
                            className={({ isActive }) => `
                                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group
                                ${isActive
                                    ? 'bg-[#1E90FF] text-white shadow-lg shadow-blue-600/20 font-medium'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    <item.icon size={20} className={isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'} />
                                    <span className="text-sm">{item.label}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </nav>
            </aside>
        </>
    );
};

export default AdminSidebar;
