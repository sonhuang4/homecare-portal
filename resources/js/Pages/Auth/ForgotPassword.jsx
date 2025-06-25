import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <>
            <Head title="Reset Password - Homecare by NWB" />
            
            <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Left Panel - Support & Reassurance */}
                <div className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden">
                    {/* Subtle background elements */}
                    <div className="absolute inset-0 opacity-10">
                        <div className="absolute top-1/4 left-1/3 w-64 h-64 rounded-full filter blur-3xl" style={{ backgroundColor: "#00b3ba" }}></div>
                        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 rounded-full filter blur-2xl" style={{ backgroundColor: "#00b3ba" }}></div>
                    </div>
                    
                    <div className="relative z-10">
                        {/* Logo */}
                        <Link href="/" className="flex items-center space-x-4">
                            <img src="/images/logo.png" alt="NWB Logo" className="w-[10rem] h-[9rem]" />
                            <div>
                                <div className="text-white text-2xl font-bold">Homecare</div>
                                <div className="text-sm font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                            </div>
                        </Link>
                    </div>

                    {/* Main Content */}
                    <div className="relative z-10 space-y-8">
                        <div>
                            <h1 className="text-4xl font-bold text-white mb-4 leading-tight">
                                We'll Help You<br />
                                Get Back In
                            </h1>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Don't worry, it happens to everyone. We'll send you a secure 
                                password reset link to get you back into your homecare portal.
                            </p>
                        </div>

                        {/* Security features */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg">Account Security</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <svg className="w-4 h-4" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Secure Reset Process</h4>
                                        <p className="text-slate-400 text-sm">Your reset link expires in 60 minutes for security.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <svg className="w-4 h-4" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Email Verification</h4>
                                        <p className="text-slate-400 text-sm">We only send reset links to registered accounts.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <svg className="w-4 h-4" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M12 2.25a9.75 9.75 0 11-6.928 2.828A9.75 9.75 0 0112 2.25z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">24/7 Support</h4>
                                        <p className="text-slate-400 text-sm">Need help? Contact our support team anytime.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-center">
                        <p className="text-slate-500 text-sm">
                            Your account security is our priority • Encrypted & Protected
                        </p>
                    </div>
                </div>

                {/* Right Panel - Reset Form */}
                <div className="flex flex-col justify-center px-8 lg:px-16 py-12">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center space-x-3">
                            <img src="/images/logo.png" alt="NWB Logo" className="w-[10rem] h-[9rem]" />
                            <div>
                                <div className="text-white text-xl font-bold">Homecare</div>
                                <div className="text-xs font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center lg:text-left mb-8">
                            <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                <svg className="w-6 h-6" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-white mb-2">Reset your password</h2>
                            <p className="text-slate-400">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>

                        {/* Status Message */}
                        {status && (
                            <div className="mb-6 p-4 rounded-xl border border-green-500/20 bg-green-500/10">
                                <div className="flex items-center space-x-3">
                                    <svg className="w-5 h-5 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <p className="text-green-400 text-sm font-medium">{status}</p>
                                </div>
                            </div>
                        )}

                        {/* Reset Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Email address
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                                        </svg>
                                    </div>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                        style={{ "--tw-ring-color": "#00b3ba" }}
                                        autoComplete="username"
                                        placeholder="Enter your email address"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.email && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
                                style={{ backgroundColor: "#00b3ba" }}
                            >
                                {processing ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Sending reset link...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Send password reset link
                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Back to Login */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400">
                                Remember your password?{' '}
                                <Link
                                    href={route('login')}
                                    className="font-medium hover:opacity-80 transition-opacity"
                                    style={{ color: "#00b3ba" }}
                                >
                                    Back to sign in →
                                </Link>
                            </p>
                        </div>

                        {/* Help Section */}
                        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                            <h4 className="text-white font-medium mb-2 flex items-center">
                                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                Need help?
                            </h4>
                            <p className="text-slate-400 text-sm mb-3">
                                If you don't receive the email within a few minutes, check your spam folder or contact support.
                            </p>
                            <Link
                                href="/contact"
                                className="text-sm font-medium hover:opacity-80 transition-opacity inline-flex items-center"
                                style={{ color: "#00b3ba" }}
                            >
                                Contact support
                                <svg className="ml-1 h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                </svg>
                            </Link>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="lg:hidden mt-8 flex justify-center space-x-6">
                            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                                Home
                            </Link>
                            <Link href="/about" className="text-slate-400 hover:text-white transition-colors text-sm">
                                About
                            </Link>
                            <Link href="/contact" className="text-slate-400 hover:text-white transition-colors text-sm">
                                Contact
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}