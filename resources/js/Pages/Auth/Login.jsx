import React, { useEffect } from "react";
import { Head, Link, useForm } from "@inertiajs/react";
import { useToast } from "../../Context/ToastContext";

export default function Login({ status, canResetPassword }) {
    const { success, error, info } = useToast();

    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        if (status) {
            success(status);
        }
    }, [status]);

    useEffect(() => {
        if (errors.email) {
            error(errors.email);
        }
    }, [errors.email]);

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        info("Signing you in...");
        post(route("login"), {
            onSuccess: () => {
                success("Welcome back! Redirecting to your dashboard...");
            },
            onError: () => {
                error("Login failed. Please check your credentials and try again.");
            },
        });
    };

    return (
        <>
            <Head title="Login - Homecare by NWB" />
            
            <div className="min-h-screen grid lg:grid-cols-2" style={{ backgroundColor: "#0a0a0a" }}>
                {/* Left Panel - Branding & Info */}
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
                            <p className="text-slate-300 text-lg leading-relaxed">
                                Access your personalized homecare portal to manage services, 
                                track appointments, and maintain your property with ease.
                            </p>
                        </div>

                        {/* Feature highlights */}
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                    <svg className="w-5 h-5" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold">Service Requests</h3>
                                <p className="text-slate-400 text-sm">Submit and track maintenance requests with real-time updates.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                    <svg className="w-5 h-5" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3a4 4 0 118 0v4m-4 0v9M7 7l5 5 5-5" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold">Smart Scheduling</h3>
                                <p className="text-slate-400 text-sm">Book appointments that fit your schedule automatically.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                    <svg className="w-5 h-5" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold">Credit System</h3>
                                <p className="text-slate-400 text-sm">Manage your service credits and subscription benefits.</p>
                            </div>

                            <div className="space-y-3">
                                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: "rgba(0, 179, 186, 0.2)" }}>
                                    <svg className="w-5 h-5" fill="none" stroke="#00b3ba" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                </div>
                                <h3 className="text-white font-semibold">WhatsApp Support</h3>
                                <p className="text-slate-400 text-sm">Get instant help through our integrated chat system.</p>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="relative z-10 text-center">
                        <p className="text-slate-500 text-sm">
                            Trusted by 500+ homeowners in Los Angeles • Licensed & Insured
                        </p>
                    </div>
                </div>

                {/* Right Panel - Login Form */}
                <div className="flex flex-col justify-center px-8 lg:px-16 py-12">
                    {/* Mobile Logo */}
                    <div className="lg:hidden mb-8 text-center">
                        <Link href="/" className="inline-flex items-center space-x-3">
                            <img src="/path/to/nwb-logo.png" alt="NWB Logo" className="w-10 h-10" />
                            <div>
                                <div className="text-white text-xl font-bold">Homecare</div>
                                <div className="text-xs font-medium" style={{ color: "#00b3ba" }}>by NWB</div>
                            </div>
                        </Link>
                    </div>

                    <div className="w-full max-w-md mx-auto">
                        {/* Header */}
                        <div className="text-center lg:text-left mb-8">
                            <h2 className="text-3xl font-bold text-white mb-2">Welcome back</h2>
                            <p className="text-slate-400">Sign in to access your homecare portal</p>
                        </div>

                        {/* Login Form */}
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
                                        placeholder="Enter your email"
                                        onChange={(e) => setData("email", e.target.value)}
                                        required
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
                                    Password
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
                                        placeholder="Enter your password"
                                        onChange={(e) => setData("password", e.target.value)}
                                        required
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

                            {/* Remember & Forgot */}
                            <div className="flex items-center justify-between">
                                <label className="flex items-center">
                                    <input
                                        name="remember"
                                        type="checkbox"
                                        checked={data.remember}
                                        className="h-4 w-4 rounded border-white/20 text-white focus:ring-offset-0"
                                        style={{ accentColor: "#00b3ba" }}
                                        onChange={(e) => setData("remember", e.target.checked)}
                                    />
                                    <span className="ml-2 text-sm text-slate-300">Remember me</span>
                                </label>

                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="text-sm font-medium hover:opacity-80 transition-opacity"
                                        style={{ color: "#00b3ba" }}
                                    >
                                        Forgot password?
                                    </Link>
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
                                        Signing in...
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center">
                                        Sign in to portal
                                        <svg className="ml-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </span>
                                )}
                            </button>
                        </form>

                        {/* Register Link */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400">
                                New to Homecare by NWB?{" "}
                                <Link
                                    href={route("register")}
                                    className="font-medium hover:opacity-80 transition-opacity"
                                    style={{ color: "#00b3ba" }}
                                >
                                    Start your membership →
                                </Link>
                            </p>
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