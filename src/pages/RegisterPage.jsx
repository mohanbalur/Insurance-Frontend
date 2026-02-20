import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const RegisterPage = () => {
    const { register } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || null;
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRoleRedirection = (user) => {
        // Redirect back if coming from a specific action, otherwise Home page
        if (from) {
            navigate(from, { replace: true });
        } else if (user.role === 'ADMIN') {
            navigate('/admin/dashboard');
        } else {
            // Standard users and agents go to Home page by default after registration
            navigate('/');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (formData.password !== formData.confirmPassword) {
            return setError('Passwords do not match');
        }

        setLoading(true);
        try {
            const { name, email, password } = formData;
            const result = await register({ name, email, password });

            if (result.success && result.data?.user) {
                handleRoleRedirection(result.data.user);
            } else {
                setError(result.message || 'Registration failed');
            }
        } catch (err) {
            setError(err.message || 'An error occurred during registration. Please try again.');
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                    </div>
                    <h2 className="mt-2 text-xl font-extrabold text-[#0B1F3A] tracking-tight">
                        Create your account
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Already have an account?{' '}
                        <Link to="/login" className="font-medium text-[#1E90FF] hover:text-[#0B1F3A] transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>

                <div className="bg-white py-6 px-6 shadow-xl shadow-blue-500/5 rounded-2xl sm:px-8 border border-blue-100 ring-1 ring-blue-500/20">
                    <form className="space-y-3" onSubmit={handleSubmit}>
                        {error && (
                            <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium flex items-center gap-2 animate-fadeIn">
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {error}
                            </div>
                        )}

                        <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Full Name
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <input
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Email Address
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium"
                                    placeholder="name@company.com"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Password
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1">
                                Confirm Password
                            </label>
                            <div className="relative rounded-lg shadow-sm">
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium"
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className="flex items-center pt-1">
                            <input
                                id="terms"
                                name="terms"
                                type="checkbox"
                                required
                                className="h-3.5 w-3.5 text-[#1E90FF] focus:ring-[#1E90FF] border-slate-300 rounded cursor-pointer transition-all"
                            />
                            <label htmlFor="terms" className="ml-2 block text-xs text-slate-600 cursor-pointer">
                                I agree to the <a href="#" className="text-[#1E90FF] hover:underline">Terms</a> and <a href="#" className="text-[#1E90FF] hover:underline">Privacy Policy</a>
                            </label>
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
                                        Creating account...
                                    </div>
                                ) : 'Create Account'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
