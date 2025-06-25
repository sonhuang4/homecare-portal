import React from 'react';
import { Head, useForm } from '@inertiajs/react';

export default function ConfirmPassword() {
    const { data, setData, post, processing, errors, reset } = useForm({
        password: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.confirm'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Confirm Password - Homecare by NWB" />
            
            <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Subtle background elements */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full filter blur-3xl" style={{ backgroundColor: "#00b3ba" }}></div>
                    <div className="absolute bottom-1/4 right-1/4 w-48 h-48 rounded-full filter blur-2xl" style={{ backgroundColor: "#00b3ba" }}></div>
                </div>

                <div className="relative z-10 w-full max-w-md">
                    {/* Header */}
                    <div className="text-center mb-8">
                        {/* Logo */}
                        <div className="flex items-center justify-center space-x-3 mb-6">
                            <img src="/images/logo.png" alt="NWB Logo" className="w-[10rem] h-[9rem]" />
                            <div>
                                <div className="text-white text-xl font-bold">Homecare</div>
                                <div className="text-xs font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                            </div>
                        </div>

                        {/* Security Icon */}
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl mb-4" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                            <svg className="w-8 h-8" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-2">Security Verification</h1>
                        <p className="text-slate-400 text-sm leading-relaxed">
                            You're accessing a secure area of your homecare portal. 
                            Please confirm your password to continue.
                        </p>
                    </div>

                    {/* Confirmation Form */}
                    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                        <form onSubmit={submit} className="space-y-6">
                            {/* Password Field */}
                            <div>
                                <label className="block text-sm font-medium text-white mb-2">
                                    Current Password
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
                                        autoComplete="current-password"
                                        placeholder="Enter your current password"
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
                            </div>

                            {/* Confirm Button */}
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
                                        Verifying...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Confirm & Continue
                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Security Info */}
                        <div className="mt-6 pt-6 border-t border-white/20">
                            <div className="flex items-start space-x-3">
                                <svg className="w-5 h-5 text-slate-400 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div>
                                    <h4 className="text-white font-medium text-sm mb-1">Why do we need this?</h4>
                                    <p className="text-slate-400 text-xs leading-relaxed">
                                        For your security, we require password confirmation before accessing 
                                        sensitive account settings and billing information.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Security Features */}
                    <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                            <p className="text-white text-xs font-medium">Encrypted</p>
                            <p className="text-slate-400 text-xs">256-bit SSL</p>
                        </div>
                        <div className="p-3 rounded-lg bg-white/5 border border-white/10">
                            <svg className="w-6 h-6 mx-auto mb-2" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                            </svg>
                            <p className="text-white text-xs font-medium">Protected</p>
                            <p className="text-slate-400 text-xs">SOC 2 Compliant</p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-center">
                        <p className="text-slate-500 text-xs">
                            Your security is our priority • Homecare by NWB
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}