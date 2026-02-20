import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, User, Shield, LogOut, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { normalizeRole } from '../utils/role';

const Navbar = () => {
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

    const handleLogout = async () => {
        setIsMobileMenuOpen(false);
        await logout();
        navigate('/login');
    };

    // Close dropdown on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const role = normalizeRole(user?.role);
    const dashboardPath = role === 'ADMIN' ? '/admin/dashboard' : role === 'AGENT' ? '/agent/dashboard' : '/dashboard';

    return (
        <nav className="bg-white border-b border-slate-100 sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-20 items-center">
                    {/* Logo */}
                    <Link to="/" className="flex items-center space-x-2" onClick={() => setIsMobileMenuOpen(false)}>
                        <div className="w-10 h-10 bg-[#1E90FF] rounded-lg flex items-center justify-center">
                            <Shield className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-[#0B1F3A]">Insurance</span>
                    </Link>

                    {/* Nav Links - Desktop */}
                    <div className="hidden md:flex items-center space-x-8">
                        <Link to="/" className="text-slate-600 hover:text-[#1E90FF] font-medium transition-colors">Home</Link>
                        <Link to="/plans" className="text-slate-600 hover:text-[#1E90FF] font-medium transition-colors">Insurance</Link>

                        {!isAuthenticated ? (
                            <>
                                <Link to="/login" className="text-slate-600 hover:text-[#1E90FF] font-medium transition-colors">Login</Link>
                                <Link
                                    to="/register"
                                    className="bg-[#1E90FF] text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-[#0B1F3A] transition-all duration-300 shadow-md hover:shadow-lg"
                                >
                                    Register
                                </Link>
                            </>
                        ) : (
                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center space-x-2 text-slate-700 hover:text-[#1E90FF] font-bold transition-all focus:outline-none"
                                >
                                    <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center text-[#1E90FF] border border-blue-100">
                                        {user?.name?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="hidden sm:inline">{user?.name}</span>
                                    <ChevronDown size={16} className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {/* Dropdown Menu */}
                                {isDropdownOpen && (
                                    <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-fadeIn py-2 ring-1 ring-black ring-opacity-5">
                                        <div className="px-4 py-3 border-b border-slate-50 mb-1 text-center">
                                            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Account</p>
                                            <p className="text-sm font-bold text-[#0B1F3A] truncate">{user?.email}</p>
                                        </div>

                                        <Link
                                            to="/profile"
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1E90FF] transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <User size={16} />
                                            My Profile
                                        </Link>

                                        <Link
                                            to={dashboardPath}
                                            className="flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-[#1E90FF] transition-colors"
                                            onClick={() => setIsDropdownOpen(false)}
                                        >
                                            <LayoutDashboard size={16} />
                                            Dashboard
                                        </Link>

                                        <div className="border-t border-slate-50 mt-1 pt-1">
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    handleLogout();
                                                }}
                                                className="flex items-center gap-2 w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors font-medium"
                                            >
                                                <LogOut size={16} />
                                                Logout
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="text-slate-600 p-2 hover:bg-slate-50 rounded-lg transition-colors"
                        >
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Nav Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t border-slate-100 animate-slideDown shadow-xl pb-6">
                    <div className="px-4 pt-4 pb-3 space-y-1">
                        <Link
                            to="/"
                            className="block px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-[#1E90FF] rounded-xl font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Home
                        </Link>
                        <Link
                            to="/plans"
                            className="block px-4 py-3 text-slate-600 hover:bg-blue-50 hover:text-[#1E90FF] rounded-xl font-medium"
                            onClick={() => setIsMobileMenuOpen(false)}
                        >
                            Insurance
                        </Link>

                        {!isAuthenticated ? (
                            <div className="pt-4 space-y-2 px-4">
                                <Link
                                    to="/login"
                                    className="block w-full text-center py-3 text-slate-600 font-medium hover:text-[#1E90FF]"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="block w-full text-center bg-[#1E90FF] text-white py-3 rounded-xl font-bold shadow-lg shadow-blue-500/20"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    Get Started
                                </Link>
                            </div>
                        ) : (
                            <div className="pt-4 border-t border-slate-50 mt-4 px-4 space-y-2">
                                <div className="flex items-center gap-3 mb-4 p-2">
                                    <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-[#1E90FF] font-bold border border-blue-100">
                                        {user?.name?.[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">{user?.name}</p>
                                        <p className="text-xs text-slate-400">{user?.email}</p>
                                    </div>
                                </div>
                                <Link
                                    to={dashboardPath}
                                    className="block w-full py-3 px-4 bg-slate-50 text-slate-700 rounded-xl font-medium flex items-center gap-2"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Shield size={18} />
                                    Account Dashboard
                                </Link>
                                <button
                                    onClick={handleLogout}
                                    className="block w-full py-3 px-4 text-red-500 font-medium flex items-center gap-2 hover:bg-red-50 rounded-xl transition-colors"
                                >
                                    <LogOut size={18} />
                                    System Logout
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
