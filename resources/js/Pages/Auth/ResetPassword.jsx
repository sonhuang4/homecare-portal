import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <>
            <Head title="Create New Password - Homecare by NWB" />
            
            <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Left Panel - Security & Trust */}
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
                                Secure Password<br />
                                Reset Process
                            </h1>
                            <p className="text-slate-300 text-lg leading-relaxed">
                                You're creating a new password for your homecare portal. 
                                Choose a strong password to keep your account secure.
                            </p>
                        </div>

                        {/* Password Security Tips */}
                        <div className="space-y-4">
                            <h3 className="text-white font-semibold text-lg">Password Security Tips</h3>
                            
                            <div className="space-y-4">
                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <svg className="w-4 h-4" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Use 8+ Characters</h4>
                                        <p className="text-slate-400 text-sm">Include letters, numbers, and symbols for strength.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <svg className="w-4 h-4" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Avoid Common Words</h4>
                                        <p className="text-slate-400 text-sm">Don't use personal info or dictionary words.</p>
                                    </div>
                                </div>

                                <div className="flex items-start space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
                                    <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                        <svg className="w-4 h-4" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h4 className="text-white font-medium">Unique Password</h4>
                                        <p className="text-slate-400 text-sm">Don't reuse passwords from other accounts.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-center">
                        <p className="text-slate-500 text-sm">
                            Your new password will be encrypted and securely stored
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
                            <h2 className="text-3xl font-bold text-white mb-2">Create new password</h2>
                            <p className="text-slate-400">
                                Set a strong password for <span style={{ color: "#00b3ba" }}>{email}</span>
                            </p>
                        </div>

                        {/* Reset Form */}
                        <form onSubmit={submit} className="space-y-6">
                            {/* Email Field (Read-only) */}
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
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-slate-300 cursor-not-allowed"
                                        autoComplete="username"
                                        onChange={(e) => setData('email', e.target.value)}
                                        readOnly
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

                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    New password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                        style={{ "--tw-ring-color": "#00b3ba" }}
                                        autoComplete="new-password"
                                        placeholder="Create a strong password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                        autoFocus
                                    />
                                </div>
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password}
                                    </p>
                                )}
                                <p className="text-slate-400 text-xs mt-2">
                                    Minimum 8 characters with letters, numbers, and symbols
                                </p>
                            </div>

                            {/* Confirm Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Confirm new password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <input
                                        id="password_confirmation"
                                        type="password"
                                        name="password_confirmation"
                                        value={data.password_confirmation}
                                        className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200"
                                        style={{ "--tw-ring-color": "#00b3ba" }}
                                        autoComplete="new-password"
                                        placeholder="Confirm your new password"
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        required
                                    />
                                </div>
                                {errors.password_confirmation && (
                                    <p className="text-red-400 text-sm mt-2 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                        {errors.password_confirmation}
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
                                        Updating password...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Update password & sign in
                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Security Notice */}
                        <div className="mt-8 p-4 rounded-xl bg-white/5 border border-white/10">
                            <div className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                                <div>
                                    <h4 className="text-white font-medium text-sm mb-1">Secure Reset</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        After updating your password, you'll be automatically signed in to your homecare portal.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Mobile Navigation */}
                        <div className="lg:hidden mt-8 flex justify-center space-x-6">
                            <Link href="/" className="text-slate-400 hover:text-white transition-colors text-sm">
                                Home
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