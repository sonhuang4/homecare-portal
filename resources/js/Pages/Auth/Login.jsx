import React, { useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { useToast } from '../../Context/ToastContext';

export default function Login({ status, canResetPassword }) {
    const { success, error, info } = useToast();
    
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    // Show status messages as toasts
    useEffect(() => {
        if (status) {
            success(status);
        }
    }, [status]);

    // Show validation errors as toasts
    useEffect(() => {
        if (errors.email) {
            error(errors.email);
        }
    }, [errors.email]);

    useEffect(() => {
        return () => {
            reset('password');
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();
        
        info('Signing you in...');
        
        post(route('login'), {
            onSuccess: () => {
                success('Welcome back! Redirecting to your dashboard...');
            },
            onError: () => {
                error('Login failed. Please check your credentials and try again.');
            }
        });
    };

    return (
        <>
            <Head title="Login" />
            
            <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 relative overflow-hidden">
                {/* Background decorative elements */}
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
                    <div className="absolute top-10 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-2000"></div>
                    <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse animation-delay-4000"></div>
                </div>

                {/* Navigation */}
                <nav className="relative z-10 p-6">
                    <div className="max-w-7xl mx-auto flex justify-between items-center">
                        <Link href="/" className="text-white text-2xl font-bold flex items-center space-x-2 hover:text-blue-200 transition-colors">
                            <span className="text-3xl">🏠</span>
                            <span>Homecare Portal</span>
                        </Link>
                        <div className="space-x-4">
                            <Link 
                                href="/"
                                className="text-white hover:text-blue-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10 font-medium"
                            >
                                Home
                            </Link>
                            <Link 
                                href="/register"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-all transform hover:scale-105 font-medium shadow-lg"
                            >
                                Register
                            </Link>
                        </div>
                    </div>
                </nav>

                {/* Main Content */}
                <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-120px)] p-6">
                    <div className="max-w-md w-full">
                        {/* Header */}
                        <div className="text-center mb-8">
                            <h1 className="text-4xl font-bold text-white mb-2">Welcome Back</h1>
                            <p className="text-gray-300 text-lg">Sign in to your account</p>
                        </div>

                        {/* Login Form */}
                        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20 shadow-2xl">
                            <form onSubmit={submit} className="space-y-6">
                                {/* Email Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Email Address
                                    </label>
                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={data.email}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        autoComplete="username"
                                        placeholder="Enter your email"
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                    />
                                    {errors.email && (
                                        <div className="flex items-center space-x-2 text-red-300 text-sm mt-1">
                                            <span>⚠️</span>
                                            <span>{errors.email}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                    <label className="block text-sm font-medium text-white">
                                        Password
                                    </label>
                                    <input
                                        id="password"
                                        type="password"
                                        name="password"
                                        value={data.password}
                                        className="w-full px-4 py-3 bg-white/20 border border-white/30 rounded-lg text-white placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 backdrop-blur-sm"
                                        autoComplete="current-password"
                                        placeholder="Enter your password"
                                        onChange={(e) => setData('password', e.target.value)}
                                        required
                                    />
                                    {errors.password && (
                                        <div className="flex items-center space-x-2 text-red-300 text-sm mt-1">
                                            <span>⚠️</span>
                                            <span>{errors.password}</span>
                                        </div>
                                    )}
                                </div>

                                {/* Remember Me & Forgot Password */}
                                <div className="flex items-center justify-between">
                                    <label className="flex items-center space-x-2 cursor-pointer">
                                        <input
                                            name="remember"
                                            type="checkbox"
                                            checked={data.remember}
                                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-colors"
                                            onChange={(e) => setData('remember', e.target.checked)}
                                        />
                                        <span className="text-sm text-gray-300 select-none">Remember me</span>
                                    </label>

                                    {canResetPassword && (
                                        <Link
                                            href={route('password.request')}
                                            className="text-sm text-blue-400 hover:text-blue-300 transition-colors font-medium"
                                        >
                                            Forgot password?
                                        </Link>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all transform hover:scale-[1.02] disabled:opacity-50 disabled:transform-none shadow-lg"
                                >
                                    {processing ? (
                                        <span className="flex items-center justify-center space-x-2">
                                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing in...</span>
                                        </span>
                                    ) : (
                                        <span className="flex items-center justify-center space-x-2">
                                            <span>Sign In</span>
                                            <span>🚀</span>
                                        </span>
                                    )}
                                </button>
                            </form>

                            {/* Register Link */}
                            <div className="mt-6 text-center">
                                <p className="text-gray-300">
                                    Don't have an account?{' '}
                                    <Link
                                        href={route('register')}
                                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                                    >
                                        Create one here
                                    </Link>
                                </p>
                            </div>

                            {/* Quick Features */}
                            <div className="mt-8 pt-6 border-t border-white/20">
                                <p className="text-center text-sm text-gray-400 mb-4">Access your portal to:</p>
                                <div className="grid grid-cols-2 gap-4 text-xs text-gray-300">
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Manage Requests</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Book Appointments</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>View Documents</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-green-400">✓</span>
                                        <span>Track Progress</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Security Notice */}
                        <div className="mt-6 text-center">
                            <p className="text-sm text-gray-400 flex items-center justify-center space-x-2">
                                <span>🔒</span>
                                <span>Your data is encrypted and secure</span>
                            </p>
                        </div>
                    </div>
                </div>

                {/* Custom animations */}
                <style jsx>{`
                    .animation-delay-2000 {
                        animation-delay: 2s;
                    }
                    .animation-delay-4000 {
                        animation-delay: 4s;
                    }
                `}</style>
            </div>
        </>
    );
}