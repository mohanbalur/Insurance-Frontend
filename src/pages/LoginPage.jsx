import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { normalizeRole } from '../utils/role';

const LoginPage = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || null;
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
        setFormData({ ...formData, [e.target.name]: value });
    };

    const handleRoleRedirection = (user) => {
        const role = normalizeRole(user?.role);
        // Role-first redirect prevents stale `from` states from sending admins to user pages.
        if (role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else if (role === 'AGENT') {
            navigate('/agent/dashboard');
        } else if (from) {
            navigate(from, { replace: true });
        } else {
            // Standard users go to Home page by default
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await login(formData.email, formData.password);
            if (result.success && result.data?.user) {
                handleRoleRedirection(result.data.user);
            } else {
                setError(result.message || 'Invalid email or password');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during login. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F4F7FB] py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-md w-full space-y-4 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 bg-[#1E90FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 transform rotate-3 hover:rotate-0 transition-all duration-500">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                        </svg>
                    </div>
                    <h2 className="mt-2 text-xl font-extrabold text-[#0B1F3A] tracking-tight">
                        Welcome back
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Don't have an account?{' '}
                        <Link to="/register" className="font-medium text-[#1E90FF] hover:text-[#0B1F3A] transition-colors">
                            Register now
                        </Link>
                    </p>
                </div>

                <div className="bg-white py-6 px-6 shadow-xl shadow-blue-500/5 rounded-2xl sm:px-8 border border-blue-100 ring-1 ring-blue-500/20">
                    <form className="space-y-4" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 animate-fadeIn">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div>
                            <label htmlFor="email" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                                Email Address
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide">
                                    Password
                                </label>
                                <div className="text-[10px]">
                                    <Link to="/forgot-password" className="font-semibold text-[#1E90FF] hover:text-[#0B1F3A] transition-colors">
                                        Forgot password?
                                    </Link>
                                </div>
                            </div>
                            <div className="relative rounded-lg shadow-sm">
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="current-password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                            <div className="flex items-center">
                                <input
                                    id="rememberMe"
                                    name="rememberMe"
                                    type="checkbox"
                                    checked={formData.rememberMe}
                                    onChange={handleChange}
                                    className="h-3.5 w-3.5 text-[#1E90FF] focus:ring-[#1E90FF] border-slate-300 rounded cursor-pointer transition-all"
                                />
                                <label htmlFor="rememberMe" className="ml-2 block text-xs text-slate-600 cursor-pointer select-none">
                                    Remember me
                                </label>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                type="submit"
                                disabled={loading}
                                className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-[#1E90FF] hover:bg-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E90FF] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md ${loading ? 'opacity-75 cursor-wait' : ''}`}
                            >
                                {loading ? (
                                    <div className="flex items-center gap-2">
                                        <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Signing in...
                                    </div>
                                ) : 'Sign In'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
