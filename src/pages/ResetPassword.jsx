import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ResetPassword = () => {
    const { resetPassword } = useAuth();
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        token: '',
        password: '',
        confirmPassword: ''
    });
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            return setMessage({ type: 'error', text: 'Passwords do not match' });
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await resetPassword(formData.token, formData.password);
            setMessage({
                type: 'success',
                text: 'Password reset successful! You can now sign in with your new password.'
            });
            setTimeout(() => navigate('/login'), 3000);
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to reset password. Please check your token.'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-[#F4F7FB] py-4 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            <div className="max-w-md w-full space-y-4 relative z-10">
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 bg-[#1E90FF] rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                        <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                        </svg>
                    </div>
                    <h2 className="mt-2 text-xl font-extrabold text-[#0B1F3A] tracking-tight">
                        Reset Your Password
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Set a new secure password for your account
                    </p>
                </div>

                <div className="bg-white py-6 px-6 shadow-xl shadow-blue-500/5 rounded-2xl sm:px-8 border border-blue-100 ring-1 ring-blue-500/20">
                    {message.type === 'success' ? (
                        <div className="text-center py-4 animate-fadeIn">
                            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-4 rounded-xl mb-6">
                                <p className="font-bold text-base mb-1">Success!</p>
                                <p className="text-xs">{message.text}</p>
                            </div>
                            <p className="text-slate-500 text-xs">Redirecting to login in 3 seconds...</p>
                        </div>
                    ) : (
                        <form className="space-y-3" onSubmit={handleSubmit}>
                            {message.type === 'error' && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium animate-fadeIn text-center">
                                    {message.text}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 text-center">
                                    Reset Token
                                </label>
                                <input
                                    name="token"
                                    type="text"
                                    required
                                    value={formData.token}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium text-center font-mono"
                                    placeholder="Enter your token here"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 text-center">
                                    New Password
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    required
                                    value={formData.password}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium text-center"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 text-center">
                                    Confirm New Password
                                </label>
                                <input
                                    name="confirmPassword"
                                    type="password"
                                    required
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium text-center"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-[#1E90FF] hover:bg-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E90FF] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md ${loading ? 'opacity-75 cursor-wait' : ''}`}
                                >
                                    {loading ? 'Resetting...' : 'Reset Password'}
                                </button>
                            </div>

                            <div className="text-center pt-1">
                                <Link to="/forgot-password" title="Go back to generate a new token" className="text-xs font-medium text-slate-400 hover:text-[#1E90FF] transition-colors">
                                    ← Back to request token
                                </Link>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ResetPassword;
