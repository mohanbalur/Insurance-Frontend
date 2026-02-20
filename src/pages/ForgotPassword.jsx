import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = () => {
    const { forgotPassword } = useAuth();
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '', token: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '', token: '' });

        try {
            const response = await forgotPassword(email);
            setMessage({
                type: 'success',
                text: 'Password reset token generated successfully.',
                token: response.data.token // Mocked behavior: displaying token since email service isn't live
            });
        } catch (error) {
            setMessage({
                type: 'error',
                text: error.message || 'Failed to process request. Please check the email address.'
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <h2 className="mt-2 text-xl font-extrabold text-[#0B1F3A] tracking-tight">
                        Forgot Password
                    </h2>
                    <p className="mt-0.5 text-xs text-slate-500">
                        Remember your password?{' '}
                        <Link to="/login" className="font-medium text-[#1E90FF] hover:text-[#0B1F3A] transition-colors">
                            Sign in instead
                        </Link>
                    </p>
                </div>

                <div className="bg-white py-6 px-6 shadow-xl shadow-blue-500/5 rounded-2xl sm:px-8 border border-blue-100 ring-1 ring-blue-500/20">
                    {!message.token ? (
                        <form className="space-y-4" onSubmit={handleSubmit}>
                            {message.type === 'error' && (
                                <div className="bg-red-50 border border-red-100 text-red-600 px-3 py-2 rounded-lg text-xs font-medium animate-fadeIn text-center">
                                    {message.text}
                                </div>
                            )}

                            <div>
                                <label className="block text-[10px] font-bold text-slate-700 uppercase tracking-wide mb-1.5 text-center">
                                    Enter your registered email address
                                </label>
                                <div className="relative rounded-lg shadow-sm">
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-full px-3 py-2.5 border border-slate-200 rounded-lg bg-slate-50 placeholder-slate-400 text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#1E90FF]/20 focus:border-[#1E90FF] focus:bg-white transition-all text-sm font-medium text-center"
                                        placeholder="name@company.com"
                                    />
                                </div>
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-[#1E90FF] hover:bg-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#1E90FF] transition-all transform hover:-translate-y-0.5 active:translate-y-0 active:shadow-md ${loading ? 'opacity-75 cursor-wait' : ''}`}
                                >
                                    {loading ? 'Sending...' : 'Send Reset Link'}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center space-y-4 animate-fadeIn">
                            <div className="bg-green-50 border border-green-100 text-green-700 px-4 py-4 rounded-xl">
                                <p className="font-bold text-base mb-1">Success!</p>
                                <p className="text-xs">{message.text}</p>
                            </div>

                            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Your Reset Token</p>
                                <p className="text-lg font-mono font-bold text-[#0B1F3A] break-all">{message.token}</p>
                                <p className="mt-2 text-[10px] text-slate-500 italic">Copy this token to use on the reset page.</p>
                            </div>

                            <Link
                                to="/reset-password"
                                className="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-lg shadow-blue-500/20 text-sm font-bold text-white bg-[#1E90FF] hover:bg-[#0B1F3A] transition-all"
                            >
                                Continue to Reset Password
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ForgotPassword;
