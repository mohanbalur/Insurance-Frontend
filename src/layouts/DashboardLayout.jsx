import React, { useState, useEffect } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Shield,
    Shield as ShieldIcon,
    FileText,
    AlertCircle,
    History,
    ArrowLeft,
    Menu,
    X,
    LogOut,
    LifeBuoy,
    ExternalLink,
    Briefcase
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { normalizeRole } from '../utils/role';

const DashboardLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [isSidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
    const role = normalizeRole(user?.role);

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(true);
            } else {
                setSidebarOpen(false);
            }
        };
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    const navItems = [
        role === 'AGENT'
            ? { label: 'Overview', path: '/agent/dashboard', icon: LayoutDashboard }
            : { label: 'Overview', path: '/dashboard', icon: LayoutDashboard },
        { label: 'My Policies', path: '/dashboard/policies', icon: Shield },
        { label: 'My Claims', path: '/dashboard/claims', icon: AlertCircle },
        { label: 'Payment History', path: '/dashboard/payments', icon: History },
        { label: 'KYC Verification', path: '/dashboard/kyc', icon: FileText },
        role === 'USER' && { label: 'Become an Agent', path: '/dashboard/apply-agent', icon: Briefcase },
        { label: 'Explore Plans', path: '/plans', icon: ExternalLink },
        { label: 'Back to Home', path: '/', icon: ArrowLeft },
    ].filter(Boolean);

    return (
        <div className="h-screen bg-[#F4F7FB] flex overflow-hidden">
            {/* Mobile Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                bg-[#0B1F3A] text-white fixed lg:relative h-full z-50 transition-all duration-300 ease-in-out
                ${isSidebarOpen ? 'w-64 translate-x-0' : '-translate-x-full lg:translate-x-0 lg:w-20'}
            `}>
                <div className="p-6 flex items-center justify-between overflow-hidden whitespace-nowrap">
                    <Link to="/" className="flex items-center gap-3 cursor-pointer">
                        <div className="bg-blue-600 p-2 rounded-lg">
                            <ShieldIcon className="text-white w-5 h-5" />
                        </div>
                        {isSidebarOpen && (
                            <h1 className="text-lg font-semibold text-[#0B1F3A]">
                                Insurance
                            </h1>
                        )}
                    </Link>
                    {/* Mobile Close Button */}
                    <button onClick={() => setSidebarOpen(false)} className="lg:hidden p-1 text-slate-400 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>

                <nav className="mt-6 px-4 space-y-2 overflow-y-auto max-h-[calc(100vh-250px)] custom-scrollbar">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/dashboard' || item.path === '/agent/dashboard'}
                            onClick={() => {
                                if (window.innerWidth < 1024) setSidebarOpen(false);
                            }}
                            className={({ isActive }) => `
                                flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group overflow-hidden whitespace-nowrap
                                ${isActive
                                    ? 'bg-[#1E90FF] text-white shadow-lg shadow-blue-600/20 font-medium'
                                    : 'text-slate-400 hover:bg-slate-800/50 hover:text-white'
                                }
                            `}
                        >
                            <item.icon size={22} className="flex-shrink-0" />
                            {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
                        </NavLink>
                    ))}
                </nav>

                <div className="absolute bottom-8 left-0 w-full px-6">
                    {isSidebarOpen && (
                        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-4 mb-4 backdrop-blur-sm">
                            <div className="flex items-center gap-2 text-slate-400 mb-1">
                                <LifeBuoy size={14} />
                                <span className="text-[10px] font-bold uppercase tracking-wider">Support</span>
                            </div>
                            <p className="text-sm font-semibold text-white mb-2 leading-tight">Need assistance?</p>
                            <button className="w-full bg-[#1E90FF] text-white text-xs py-2 rounded-lg font-bold hover:bg-blue-600 transition-all active:scale-95">Live Chat</button>
                        </div>
                    )}
                    <button
                        onClick={handleLogout}
                        className="flex items-center space-x-3 text-slate-400 hover:text-red-400 font-medium transition-colors w-full px-4 py-2 group hover:bg-red-500/5 rounded-xl"
                    >
                        <LogOut size={22} className="flex-shrink-0" />
                        {isSidebarOpen && <span className="text-sm">Logout</span>}
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col min-h-0 min-w-0">
                <header className="bg-white h-16 md:h-[68px] flex items-center justify-between px-3 md:px-6 border-b border-slate-100 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-slate-500 hover:text-[#1E90FF] hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center space-x-3 md:space-x-5">
                        <div className="text-right hidden sm:block">
                            <p className="text-xs md:text-sm font-bold text-[#0B1F3A] leading-tight">{user?.name}</p>
                            <p className="text-[10px] text-slate-400 leading-tight uppercase tracking-widest font-bold mt-0.5">{user?.role}</p>
                        </div>
                        <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-tr from-[#1E90FF] to-blue-400 rounded-full flex items-center justify-center text-white text-sm font-bold border-2 border-white shadow-md ring-1 ring-slate-100">
                            {user?.name?.[0]?.toUpperCase()}
                        </div>
                    </div>
                </header>

                <div className="p-3 md:p-4 flex-1 min-h-0 overflow-auto">
                    <div className="mx-auto w-full max-w-7xl min-w-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default DashboardLayout;
